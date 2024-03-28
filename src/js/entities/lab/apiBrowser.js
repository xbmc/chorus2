/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Entities for the API Browser.
//
// @param [Object] The entities object
// @param [Object] The full application object
// @param [Object] Backbone
// @param [Object] Marionette
// @param [Object] jQuery
// @param [Object] lodash (underscore)
//
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
  */

  var API = {

    dictionary: {},

    fields: {
      minimal: [],
      small: ['method', 'description', 'thumbnail', 'params', 'permission', 'returns', 'type', 'namespace', 'methodname'],
      full: []
    },

    //# Fetch a single entity
    getEntity(id, collection) {
      const model = collection.where({id}).shift();
      return model;
    },

    //# Fetch an entity collection.
    getCollection(options = {}) {
      const collection = new KodiEntities.ApiMethodCollection();
      collection.fetch(helpers.entities.buildOptions(options));
      return collection;
    },

    parseCollection(itemsRaw = [], type = 'method') {
      const items = [];
      for (var method in itemsRaw) {
        var item = itemsRaw[method];
        item.method = method;
        item.id = method;
        API.dictionary[item.id] = item.id;
        if (type === 'type') {
          item.params = _.extend({}, item);
          item.description = 'API Type';
        }
        item.type = type;
        var methodParts = method.replace('.', '[SPLIT]').split('[SPLIT]');
        item.namespace = methodParts[0];
        item.methodname = methodParts[1];
        items.push(item);
      }
      return items;
    }
  };


  /*
   Models and collections.
  */

  //# Single API Method model.
  KodiEntities.ApiMethod = class ApiMethod extends App.KodiEntities.Model {
    defaults() {
      const fields = _.extend(this.modelDefaults, {id: 1, params: {}});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'small'), fields);
    }
  };

  //# Method collection
  const Cls = (KodiEntities.ApiMethodCollection = class ApiMethodCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.ApiMethod;
      this.prototype.methods = {read: ['JSONRPC.Introspect', 'getdescriptions', 'getmetadata']};
    }
    args() { return this.getArgs({
      getdescriptions: true,
      getmetadata: true
    }); }
    parse(resp, xhr) {
      const methods = API.parseCollection(this.getResult(resp, 'methods'), 'method');
      const types = API.parseCollection(this.getResult(resp, 'types'), 'type');
      return methods.concat(types);
    }
  });
  Cls.initClass();


  /*
   Request Handlers.
  */

  //# Get an single method collection
  App.reqres.setHandler("introspect:entity", (id, collection) => API.getEntity(id, collection));

  //# Get the introspect collection of methods
  App.reqres.setHandler("introspect:entities", (options = {}) => API.getCollection(options));

  //# Get a dictionary of all known methods/types, must be called after fetch
  return App.reqres.setHandler("introspect:dictionary", () => API.dictionary);
});
