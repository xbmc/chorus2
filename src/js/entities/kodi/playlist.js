/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
  */

  var API = {

    fields: {
      minimal: ['title', 'thumbnail', 'file'],
      small: ['artist', 'genre', 'year', 'rating', 'album', 'track', 'duration', 'playcount', 'dateadded', 'episode', 'artistid', 'albumid', 'tvshowid'],
      full: ['fanart']
    },

    //# Types that can be thumbed up
    canThumbsUp: ['song', 'movie', 'episode'],

    //# Fetch an entity collection.
    getCollection(options) {
      const defaultOptions = {cache: false, useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      const collection = new KodiEntities.PlaylistCollection();
      collection.fetch(options);
      return collection;
    },

    //# Attempt to get the type of a playlist item by parsing the properties
    getType(item, media) {
      let type = 'file';
      if ((item.id !== undefined) && (item.id !== '')) {
        if (media === 'audio') {
          type = 'song';
        } else if (media === 'video') {
          if (item.episode !== '') {
            type = 'episode';
          } else {
            type = 'movie';
          }
        }
      }
      return type;
    },

    //# Enrich the playlist item with as much extra data as possible.
    parseItems(items, options) {
      for (var i in items) {
        var item = items[i];
        item.position = parseInt(i);
        items[i] = this.parseItem(item, options);
      }
      return items;
    },

    parseItem(item, options) {
      item.playlistid = options.playlistid;
      item.media = options.media;
      item.player = 'kodi';
      if (!item.type || (item.type === 'unknown')) {
        item.type = API.getType(item, options.media);
      }
      if (item.type === 'file') {
        item.id = item.file;
      }
      item.uid = helpers.entities.createUid(item);
      item.canThumbsUp = helpers.global.inArray(item.type, API.canThumbsUp);
      item.thumbsUp = false;
      return item;
    }
  };


  /*
   Models and collections.
  */

  //# Single Playlist model.
  let Cls = (KodiEntities.PlaylistItem = class PlaylistItem extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.idAttribute = "position";
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {position: 0});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      resp.fullyloaded = true;
      const model = this.parseModel(resp.type, resp, resp.id);
      model.url = helpers.url.playlistUrl(model);
      return model;
    }
  });
  Cls.initClass();

  //# Playlists collection
  Cls = (KodiEntities.PlaylistCollection = class PlaylistCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.PlaylistItem;
      this.prototype.methods = {read: ['Playlist.GetItems', 'playlistid', 'properties', 'limits']};
    }
    args() { return this.getArgs({
      playlistid: this.argCheckOption('playlistid', 0),
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit()
    }); }
    parse(resp, xhr) {
      const items = this.getResult(resp, 'items');
      return API.parseItems(items, this.options);
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  //# Get an playlist collection
  App.reqres.setHandler("playlist:kodi:entities", function(media = 'audio') {
    const playlist = App.request("command:kodi:controller", media, 'PlayList');
    const options = {};
    options.media = media;
    options.playlistid = playlist.getPlayer();
    const collection = API.getCollection(options);
    collection.sortCollection('position', 'asc');
    return collection;
  });

  //# Expose the Api object for now-playing usage.
  return App.reqres.setHandler("playlist:kodi:entity:api", () => API);
});
