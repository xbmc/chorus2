// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  var API = {

    // Using the Kodi API key
    apiKey: 'ZWQ0Yjc4NGY5NzIyNzM1OGIzMWNhNGRkOTY2YTA0ZjE=',

    // V3 of API
    baseURL: 'http://webservice.fanart.tv/v3/',

    // Max image count
    maxImageCount: 15,

    artistFieldTranslate: {
      artistbackground: 'fanart',
      artistthumb: 'thumbnail'
    },

    //# Make a call to API
    call(path, params, callback) {
      const defaultParams =
        {api_key: config.getAPIKey('apiKeyFanartTv', this.apiKey)};
      params = _.extend(defaultParams, params);
      const url = this.baseURL + path + helpers.url.buildParams(params);
      const req = $.getJSON(url, resp => callback(resp));
      return req.fail(err => callback({status: 'error'}));
    },

    //# Add original and thumb properties to an image collection
    parseImageUrls(artType, collection) {
      if (collection.status && (collection.status === 'error')) {
        return [];
      }
      const items = [];
      const artTypes = this[artType + 'FieldTranslate'];
      for (var type in artTypes) {
        var field = artTypes[type];
        if (collection[type] != null) {
          collection[type] = collection[type].slice(0, this.maxImageCount);
          for (var i in collection[type]) {
            var item = collection[type][i];
            var row = item;
            row.thumbnail = this.getThumbnailUrl(item.url);
            row.provider = 'fanarttv';
            row.type = field;
            items.push(row);
          }
        }
      }
      return items;
    },

    //# Note - this might break in the future, API does not provide a thumb
    getThumbnailUrl: url => {
      return url.replace('assets.fanart.tv/', 'fanart.tv/detailpreview/');
    },

    //# Get Images
    images(type, id, callback) {
      return this.call(type + '/' + id, {}, resp => {
        return callback(this.parseImageUrls('artist', resp));
      });
    },

    //# Return a collection for an music search
    getMusicArtCollection(name, callback) {
      const cacheKey = 'fanarttv:' + encodeURIComponent(name);
      const cache = config.getLocal(cacheKey, []);
      if (cache.length > 0) {
        return API.createCollection(cache, callback);
      } else {
        return App.execute("musicbrainz:artist:entity", name, function(model) {
          if (model.get('id')) {
            return API.images('music', model.get('id'), results => API.createCollection(results, callback));
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


  //# Return the first matching entity on a name lookup
  return App.commands.setHandler("fanarttv:artist:image:entities", (name, callback) => API.getMusicArtCollection(name, callback));
});
