// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
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
      minimal: ['name'],
      small: ['order', 'role', 'thumbnail', 'origin', 'url'],
      full: []
    },

    //# Fetch an entity collection.
    getCollection(cast, origin) {
      for (var i in cast) {
        var item = cast[i];
        cast[i].origin = origin;
      }
      const collection = new KodiEntities.CastCollection(cast);
      return collection;
    }
  };


  /*
   Models and collections.
  */

  //# Single Casts model.
  let Cls = (KodiEntities.Cast = class Cast extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.idAttribute = "order";
    }
    defaults() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'small'), {});
    }
    parse(obj, xhr) {
      obj.url = '?cast=' + obj.name;
      return obj;
    }
  });
  Cls.initClass();

  //# Castss collection
  Cls = (KodiEntities.CastCollection = class CastCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Cast;
    }
  });
  Cls.initClass();


  /*
   Request Handlers.
  */

  //# Get an cast collection
  return App.reqres.setHandler("cast:entities", (cast, origin) => API.getCollection(cast, origin));
});
