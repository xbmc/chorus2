// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Youtube collection
*/
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  var API = {

    apiKey: 'QUl6YVN5Qnh2YVI2bUNuVVdOOGN2MlRpUFJtdUVoMEZ5a0JUQUgw',
    searchUrl: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=any&videoEmbeddable=true&order=relevance&safeSearch=none',
    maxResults: 5,

    kodiUrl: 'plugin://plugin.video.youtube/?action=play_video&videoid=',
    ytURL: 'https://youtu.be/',

    getSearchUrl() {
      return this.searchUrl + '&key=' + config.getAPIKey('apiKeyYouTube', this.apiKey);
    },

    parseItems(response) {
      const items = [];
      const enabled = App.request("addon:isEnabled", {addonid: 'plugin.video.youtube'}) ? true : false;
      for (var i in response.items) {
        var item = response.items[i];
        var resp = {
          id: item.id.videoId,
          title: item.snippet.title,
          label: item.snippet.title,
          desc: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          url: API.ytURL + item.id.videoId,
          addonEnabled: enabled
        };
        items.push(resp);
      }
      return items;
    }
  };


  const Cls = (Entities.YouTubeCollection = class YouTubeCollection extends Entities.ExternalCollection {
    static initClass() {
      this.prototype.model = Entities.ExternalEntity;
      this.prototype.url = API.getSearchUrl();
    }
    sync(method, collection, options) {
      options.dataType = "jsonp";
      options.timeout = 5000;
      return Backbone.sync(method, collection, options);
    }
    parse(resp) {
      return API.parseItems(resp);
    }
  });
  Cls.initClass();


  App.commands.setHandler("youtube:search:entities", function(query, options = {}, callback) {
    const yt = new Entities.YouTubeCollection();
    const data = _.extend({q: query, maxResults: API.maxResults}, options);
    return yt.fetch({
      data,
      success(collection) {
        return callback(collection);
      },
      error(collection) {
        return helpers.debug.log('Youtube search error', 'error', collection);
      }
    });
  });

  return App.commands.setHandler("youtube:trailer:entities", (title, callback) => App.execute("youtube:search:entities", title + ' trailer', {}, function(collection) {
    collection.map(function(item) {
      item.set({
        type: 'trailer',
        url: API.kodiUrl + item.id
      });
      return item;
    });
    return callback(collection);
  }));
});
