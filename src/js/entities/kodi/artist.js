// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
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
      minimal: [],
      small: ['thumbnail', 'mood', 'genre', 'style'],
      full: ['fanart', 'born', 'formed', 'description', 'died', 'disbanded', 'yearsactive', 'instrument', 'musicbrainzartistid']
    },

    //# Fetch a single artist
    getArtist(id, options) {
      const artist = new App.KodiEntities.Artist();
      artist.set({artistid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')});
      artist.fetch(options);
      return artist;
    },

    //# Fetch an artist collection.
    getArtists(options) {
      const collection = new KodiEntities.ArtistCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single artist model.
  let Cls = (KodiEntities.Artist = class Artist extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {
        read: ['AudioLibrary.GetArtistDetails', 'artistid', 'properties']
      };
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {artistid: 1, artist: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      //# If fetched directly, look in artist details and mark as fully loaded
      const obj = (resp.artistdetails != null) ? resp.artistdetails : resp;
      if (resp.artistdetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('artist', obj, obj.artistid);
    }
  });
  Cls.initClass();

  //# Artists collection
  Cls = (KodiEntities.ArtistCollection = class ArtistCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Artist;
      this.prototype.methods = {read: ['AudioLibrary.GetArtists', 'albumartistsonly', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      albumartistsonly: config.getLocal('albumArtistsOnly', true),
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort('title', 'ascending'),
      filter: this.argFilter()
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'artists'); }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  //# Get a single artist
  App.reqres.setHandler("artist:entity", (id, options = {}) => API.getArtist(id, options));

  //# Get an artist collection
  App.reqres.setHandler("artist:entities", function(options = {}) {
    // If using filters, search all artists
    if (options.filter && (options.albumartistsonly !== true)) {
      options.albumartistsonly = false;
    }
    return API.getArtists(options);
  });

  //# Get full field/property list for entity
  return App.reqres.setHandler("artist:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
