// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  var API = {

    // API Key
    apiKey: 'NzFiYTFmMDdlZDBmYzhmYjM2MWNmMDRhNThkNzUwNTE=',

    // V3 of API
    baseURL: 'https://api.themoviedb.org/3/',

    // Image base path
    baseImageURL: 'https://image.tmdb.org/t/p/',

    // Default lang
    defaultLang: 'en',

    // Max image count
    maxImageCount: 15,

    // Default thumb sizes
    thumbSize: {
      backdrops: 'w300',
      posters: 'w185'
    },

    fieldTranslate: {
      backdrops: 'fanart',
      posters: 'thumbnail'
    },

    //# Make a call to API
    call(path, params, callback) {
      const defaultParams =
        {api_key: config.getAPIKey('apiKeyTMDB', this.apiKey)};
      params = _.extend(defaultParams, params);
      const url = this.baseURL + path + helpers.url.buildParams(params) + '&callback=?';
      return $.getJSON(url, resp => callback(resp));
    },

    //# Get an image url, Sizes are:
    //# - Backdrop: w300, w780, w1280, original
    //# - Poster: w92, w154, w185, w342, w500, w780, original
    //# - Profile: w45, w185, h632, original
    //# - Stills: w92, w185, w300, original
    //# @see https://developers.themoviedb.org/3/configuration/get-api-configuration
    getImageURL(path, size = 'original') {
      return this.baseImageURL + size + path;
    },

    //# Parse response into an images collection
    parseImages(collection) {
      const items = [];
      for (var type in API.fieldTranslate) {
        var field = API.fieldTranslate[type];
        collection[type] = collection[type].slice(0, this.maxImageCount);
        for (var i in collection[type]) {
          var item = collection[type][i];
          item.id = item.file_path;
          item.url = this.getImageURL(item.file_path, 'original');
          item.thumbnail = this.getImageURL(item.file_path, this.thumbSize[type]);
          item.type = field;
          item.provider = 'moviedb';
          items.push(item);
        }
      }
      return items;
    },

    //# Find a movie
    find(id, source = 'imdb_id', callback) {
      return this.call('find/' + id, {external_source: source}, callback);
    },

    //# Get Images
    images(type, tmdbId, callback) {
      return this.call(type + '/' + tmdbId + '/images', {include_image_language: this.defaultLang + ',null'}, resp => {
        return callback(this.parseImages(resp));
      });
    },

    //# Get an image collection
    getCollection(options, callback) {
      const opts = _.extend({lookupType: 'imdb_id', lookupId: '', type: 'movie'}, options);
      const cacheKey = 'moviedb:' + JSON.stringify(opts);
      const cache = config.getLocal(cacheKey, []);
      if (cache.length > 0) {
        return API.createCollection(cache, callback);
      } else {
        return API.find(opts.lookupId, opts.lookupType, function(resp) {
          const resKey = opts.type + '_results';
          if (resp[resKey] && (resp[resKey].length > 0)) {
            const item = _.first(resp[resKey]);
            return API.images(opts.type, item.id, function(resp) {
              config.setLocal(cacheKey, resp);
              return API.createCollection(resp, callback);
            });
          } else {
            return API.createCollection([], callback);
          }
        });
      }
    },

    //# Create a collection from raw items
    createCollection(items, callback) {
      return callback(new Entities.ExternalCollection(items));
    }
  };



  //# Find movie images via IMDb ID
  App.commands.setHandler("themoviedb:movie:image:entities", function(lookupId, callback) {
    const options = {lookupId};
    return API.getCollection(options, callback);
  });

  //# Find tv images via IMDb ID
  return App.commands.setHandler("themoviedb:tv:image:entities", function(lookupId, callback) {
    const lookupType = lookupId.lastIndexOf('tt', 0) === 0 ? 'imdb_id' : 'tvdb_id';
    const options = {lookupId, lookupType, type: 'tv'};
    return API.getCollection(options, callback);
  });
});
