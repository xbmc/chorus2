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

  /*
    API Helpers
  */

  var API = {

    fields: {
      minimal: ['title', 'art'],
      small: ['playcount', 'lastplayed', 'dateadded', 'resume', 'rating', 'year', 'file', 'genre', 'writer', 'director', 'cast', 'set', 'studio', 'mpaa', 'tag'],
      full: ['plotoutline', 'imdbnumber', 'runtime', 'streamdetails', 'plot', 'trailer', 'sorttitle', 'originaltitle', 'country']
    },

    //# Fetch a single entity
    getEntity(id, options) {
      const entity = new App.KodiEntities.Movie();
      entity.set({movieid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an entity collection.
    getCollection(options) {
      const collection = new KodiEntities.MovieCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single Movie model.
  let Cls = (KodiEntities.Movie = class Movie extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['VideoLibrary.GetMovieDetails', 'movieid', 'properties']};
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {movieid: 1, movie: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      const obj = (resp.moviedetails != null) ? resp.moviedetails : resp;
      if (resp.moviedetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.playcount > 0 ? 0 : 1;
      return this.parseModel('movie', obj, obj.movieid);
    }
  });
  Cls.initClass();

  //# Movies collection
  Cls = (KodiEntities.MovieCollection = class MovieCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Movie;
      this.prototype.methods = {read: ['VideoLibrary.GetMovies', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort('title', 'ascending'),
      filter: this.argFilter()
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'movies'); }
  });
  Cls.initClass();

  //# Movie Custom collection, assumed passed an array of raw entity data.
  Cls = (KodiEntities.MovieCustomCollection = class MovieCustomCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Movie;
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a single movie
  App.reqres.setHandler("movie:entity", (id, options = {}) => API.getEntity(id, options));

  //# Get an movie collection
  App.reqres.setHandler("movie:entities", (options = {}) => API.getCollection(options));

  //# Given an array of models, return as collection.
  App.reqres.setHandler("movie:build:collection", items => new KodiEntities.MovieCustomCollection(items));

  //# Get full field/property list for entity
  return App.reqres.setHandler("movie:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
