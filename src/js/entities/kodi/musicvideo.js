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
      minimal: ['title'],
      small: ['thumbnail', 'file', 'genre', 'artist', 'year', 'playcount', 'dateadded', 'streamdetails', 'album', 'resume', 'director', 'rating'],
      full: ['fanart', 'studio', 'plot', 'track', 'tag']
    },

    //# Fetch a single artist
    getVideo(id, options) {
      const artist = new App.KodiEntities.MusicVideo();
      artist.set({musicvideoid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')});
      artist.fetch(options);
      return artist;
    },

    //# Fetch an artist collection.
    getVideos(options) {
      const collection = new KodiEntities.MusicVideoCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single video model.
  let Cls = (KodiEntities.MusicVideo = class MusicVideo extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {
        read: ['VideoLibrary.GetMusicVideoDetails', 'musicvideoid', 'properties']
      };
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {musicvideoid: 1, title: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      const obj = (resp.musicvideodetails != null) ? resp.musicvideodetails : resp;
      if (resp.musicvideodetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('musicvideo', obj, obj.musicvideoid);
    }
  });
  Cls.initClass();

  //# Video collection
  Cls = (KodiEntities.MusicVideoCollection = class MusicVideoCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.MusicVideo;
      this.prototype.methods = {read: ['VideoLibrary.GetMusicVideos', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      properties: this.argFields(helpers.entities.getFields(API.fields, 'full')),
      limits: this.argLimit(),
      sort: this.argSort('title', 'ascending'),
      filter: this.argFilter()
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'musicvideos'); }
  });
  Cls.initClass();

  //# Video Custom collection, assumed passed an array of raw entity data.
  Cls = (KodiEntities.MusicVideoCustomCollection = class MusicVideoCustomCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.MusicVideo;
    }
  });
  Cls.initClass();


  /*
   Request Handlers.
  */

  //# Get a single video
  App.reqres.setHandler("musicvideo:entity", (id, options = {}) => API.getVideo(id, options));

  //# Get an video collection
  App.reqres.setHandler("musicvideo:entities", (options = {}) => API.getVideos(options));

  //# Get full field/property list for entity
  App.reqres.setHandler("musicvideo:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));

  //# Given an array of models, return as collection.
  return App.reqres.setHandler("musicvideo:build:collection", items => new KodiEntities.MusicVideoCustomCollection(items));
});
