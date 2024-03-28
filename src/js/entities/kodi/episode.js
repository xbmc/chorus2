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
      minimal: ['title'],
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'season', 'rating', 'file', 'cast', 'showtitle', 'tvshowid', 'uniqueid', 'resume', 'firstaired'],
      full: ['fanart', 'plot', 'director', 'writer', 'runtime', 'streamdetails']
    },

    //# Fetch a single entity
    getEntity(id, options) {
      const entity = new App.KodiEntities.Episode();
      entity.set({episodeid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an entity collection.
    getCollection(options) {
      const defaultOptions = {cache: false, expires: config.get('static', 'collectionCacheExpiry'), useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      const collection = new KodiEntities.EpisodeCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single Episodes model.
  let Cls = (KodiEntities.Episode = class Episode extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['VideoLibrary.GetEpisodeDetails', 'episodeid', 'properties']};
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {episodeid: 1, episode: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      const obj = (resp.episodedetails != null) ? resp.episodedetails : resp;
      if (resp.episodedetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.playcount > 0 ? 0 : 1;
      return this.parseModel('episode', obj, obj.episodeid);
    }
  });
  Cls.initClass();

  //# Episodes collection
  Cls = (KodiEntities.EpisodeCollection = class EpisodeCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Episode;
      this.prototype.methods = {read: ['VideoLibrary.GetEpisodes', 'tvshowid', 'season', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      tvshowid: this.argCheckOption('tvshowid', undefined),
      season: this.argCheckOption('season', undefined),
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort("episode", "ascending"),
      filter: this.argCheckOption('filter', undefined)
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'episodes'); }
  });
  Cls.initClass();

  //# Episode Custom collection, assumed passed an array of raw entity data.
  Cls = (KodiEntities.EpisodeCustomCollection = class EpisodeCustomCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Episode;
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a single episode
  App.reqres.setHandler("episode:entity", (id, options = {}) => API.getEntity(id, options));

  //# Get an episode collection
  App.reqres.setHandler("episode:entities", (options = {}) => API.getCollection(options));

  //# Get an episode collection
  App.reqres.setHandler("episode:tvshow:entities", function(tvshowid, season, options = {}) {
    if (tvshowid !== 'all') {
      options.tvshowid = tvshowid;
      if (season !== 'all') {
        options.season = season;
      }
    }
    return API.getCollection(options);
  });

  //# Given an array of models, return as collection.
  App.reqres.setHandler("episode:build:collection", items => new KodiEntities.EpisodeCustomCollection(items));

  //# Get full field/property list for entity
  return App.reqres.setHandler("episode:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
