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
      small: ['playcount', 'lastplayed', 'dateadded', 'episode', 'rating', 'year', 'file', 'genre', 'watchedepisodes', 'cast', 'studio', 'mpaa', 'tag'],
      full: ['imdbnumber', 'episodeguide', 'plot', 'sorttitle', 'originaltitle', 'premiered']
    },

    //# Fetch a single entity
    getEntity(id, options) {
      const entity = new App.KodiEntities.TVShow();
      entity.set({tvshowid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an entity collection.
    getCollection(options) {
      const collection = new KodiEntities.TVShowCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single TVShows model.
  let Cls = (KodiEntities.TVShow = class TVShow extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['VideoLibrary.GetTVShowDetails', 'tvshowid', 'properties']};
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {tvshowid: 1, tvshow: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      const obj = (resp.tvshowdetails != null) ? resp.tvshowdetails : resp;
      if (resp.tvshowdetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.episode - obj.watchedepisodes;
      return this.parseModel('tvshow', obj, obj.tvshowid);
    }
  });
  Cls.initClass();

  //# TVShows collection
  Cls = (KodiEntities.TVShowCollection = class TVShowCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.TVShow;
      this.prototype.methods = {read: ['VideoLibrary.GetTVShows', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort('title', 'ascending'),
      filter: this.argFilter()
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'tvshows'); }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a single tvshow
  App.reqres.setHandler("tvshow:entity", (id, options = {}) => API.getEntity(id, options));

  //# Get an tvshow collection
  App.reqres.setHandler("tvshow:entities", (options = {}) => API.getCollection(options));

  //# Get full field/property list for entity
  return App.reqres.setHandler("tvshow:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
