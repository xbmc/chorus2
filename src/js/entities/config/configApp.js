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
/*
  App configuration settings, items stored in local storage and are
  specific to the browser/user instance. Not Kodi settings.
*/
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  var API = {

    storageKey: 'config:app',

    //# Get a loaded collection
    getCollection() {
      const collection = new Entities.ConfigAppCollection();
      collection.fetch();
      return collection;
    },

    //# Get a single config item
    getConfig(id, collection) {
      if (collection == null) { collection = API.getCollection(); }
      return collection.find({id});
    }
  };

  //# The config model
  let Cls = (Entities.ConfigApp = class ConfigApp extends Entities.Model {
    static initClass() {
      this.prototype.defaults =
        {data: {}};
    }
  });
  Cls.initClass();

  //# The config collection
  Cls = (Entities.ConfigAppCollection = class ConfigAppCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.ConfigApp;
      this.prototype.localStorage = new Backbone.LocalStorage(API.storageKey);
    }
  });
  Cls.initClass();


  //# Handler to return a single local setting.
  App.reqres.setHandler("config:app:get", function(configId, defaultData) {
    const model = API.getConfig(configId);
    if (model != null) {
      return model.get('data');
    } else {
      return defaultData;
    }
  });


  //# Handler to set/update a single local setting.
  App.reqres.setHandler("config:app:set", function(configId, configData) {
    const collection = API.getCollection();
    const model = API.getConfig(configId, collection);
    if (model != null) {
      return model.save({data: configData});
    } else {
      collection.create({id: configId, data: configData});
      return configData;
    }
  });


  //# Handler to return a single static setting (forgotten on page reload).
  App.reqres.setHandler("config:static:get", function(configId, defaultData) {
    const data = (config.static[configId] != null) ? config.static[configId] : defaultData;
    return data;
  });


  //# Handler to set a single static setting (forgotten on page reload).
  return App.reqres.setHandler("config:static:set", function(configId, data) {
    config.static[configId] = data;
    return data;
  });
});
