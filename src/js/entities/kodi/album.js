/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  var API = {

    fields: {
      minimal: ['thumbnail'],
      small: ['playcount', 'artistid', 'artist', 'genre', 'albumlabel', 'year', 'dateadded', 'style'],
      full: ['fanart', 'mood', 'description', 'rating', 'type', 'theme']
    },

    //# Fetch a single album
    getAlbum(id, options) {
      const album = new App.KodiEntities.Album();
      album.set({albumid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')});
      album.fetch(options);
      return album;
    },

    //# Fetch an album collection.
    getAlbums(options) {
      const collection = new KodiEntities.AlbumCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single album model.
  let Cls = (KodiEntities.Album = class Album extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {
        read: ['AudioLibrary.GetAlbumDetails', 'albumid', 'properties']
      };
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {albumid: 1, album: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      //# If fetched directly, look in album details and mark as fully loaded
      const obj = (resp.albumdetails != null) ? resp.albumdetails : resp;
      obj.title = obj.label;
      if (resp.albumdetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('album', obj, obj.albumid);
    }
  });
  Cls.initClass();

  //# Albums collection
  Cls = (KodiEntities.AlbumCollection = class AlbumCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Album;
      this.prototype.methods = {read: ['AudioLibrary.GetAlbums', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort('title', 'ascending'),
      filter: this.argFilter()
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'albums'); }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  //# Get a single album
  App.reqres.setHandler("album:entity", (id, options = {}) => API.getAlbum(id, options));

  //# Get an album collection
  App.reqres.setHandler("album:entities", (options = {}) => API.getAlbums(options));

  //# Get full field/property list for entity
  return App.reqres.setHandler("album:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
