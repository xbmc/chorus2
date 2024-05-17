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

  const API = {

    fields: {
      minimal: ['season', 'art'],
      small: ['showtitle', 'playcount', 'thumbnail', 'tvshowid', 'episode', 'watchedepisodes'],
      full: []
    },

    //# Fetch a single entity, requires a season collection passed.
    getEntity(collection, season) {
      return collection.findWhere({season});
    },

    //# Fetch an entity collection.
    getCollection(options) {
      const defaultOptions = {cache: false, expires: config.get('static', 'collectionCacheExpiry'), useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      const collection = new KodiEntities.SeasonCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single Seasons model.
  KodiEntities.Season = class Season extends App.KodiEntities.Model {
    defaults() {
      const fields = _.extend(this.modelDefaults, {seasonid: 1, season: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      const obj = (resp.seasondetails != null) ? resp.seasondetails : resp;
      if (resp.seasondetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.episode - obj.watchedepisodes;
      return this.parseModel('season', obj, obj.tvshowid + '/' + obj.season);
    }
  };

  //# Seasons collection
  const Cls = (KodiEntities.SeasonCollection = class SeasonCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Season;
      this.prototype.methods = {read: ['VideoLibrary.GetSeasons', 'tvshowid', 'properties', 'limits', 'sort']};
    }
    args() { return this.getArgs({
      tvshowid: this.argCheckOption('tvshowid', 0),
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort("season", "ascending")
    }); }
    parse(resp, xhr) {
      return this.getResult(resp, 'seasons');
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a single season
  App.reqres.setHandler("season:entity", (collection, season) => API.getEntity(collection, season));

  //# Get an season collection
  App.reqres.setHandler("season:entities", function(tvshowid, options = {}) {
    options.tvshowid = tvshowid;
    return API.getCollection(options);
  });

  //# Get full field/property list for entity
  return App.reqres.setHandler("season:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
