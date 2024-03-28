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

  const API = {

    fields: {
      minimal: ['title'],
      small: ['thumbnail'],
      full: []
    },

    //# Fetch a single entity, requires a channel collection passed.
    getEntity(collection, genre) {
      return collection.findWhere({title: genre});
    },

    //# Fetch an entity collection.
    getCollection(type, options) {
      const collection = new KodiEntities.GenreAudioCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single Genre model.
  KodiEntities.Genre = class Genre extends App.KodiEntities.Model {
    defaults() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), {});
    }
    parse(obj, xhr) {
      obj.fullyloaded = true;
      obj.url = 'music/genre/' + encodeURIComponent(obj.title);
      return obj;
    }
  };

  //# Genres audio collection
  const Cls = (KodiEntities.GenreAudioCollection = class GenreAudioCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Genre;
      this.prototype.methods = {read: ['AudioLibrary.GetGenres', 'properties', 'limits', 'sort']};
    }
    args() { return this.getArgs({
      properties: helpers.entities.getFields(API.fields, 'small'),
      limits: this.argLimit(),
      sort: this.argSort('title', 'ascending')
    }); }
    parse(resp, xhr) {
      return this.getResult(resp, 'genres');
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a single genre
  App.reqres.setHandler("genre:entity", (collection, genre) => API.getEntity(collection, genre));

  //# Get a genre collection
  return App.reqres.setHandler("genre:entities", (type = 'audio', options = {}) => API.getCollection(type, options));
});
