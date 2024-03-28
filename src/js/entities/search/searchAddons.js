/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  const API = {

    localKey: 'searchAddons',

    //# Get a collection from local storage.
    getLocalCollection() {
      const collection = new Entities.LocalSearchAddonsCollection([], {key: this.localKey});
      collection.fetch();
      return collection;
    },

    // Save current form to local storage collection
    saveLocal(items) {
      const collection = this.clearLocal();
      for (var i in items) {
        var item = items[i];
        collection.create(item);
      }
      return collection;
    },

    //# remove all items from a list
    clearLocal() {
      let model;
      const collection = this.getLocalCollection();
      while ((model = collection.first())) {
        model.destroy();
      }
      return collection;
    }
  };

  //# Model
  let Cls = (Entities.SearchAddons = class SearchAddons extends App.Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        id: '',
        url: '',
        title: 'Untitled',
        media: 'music'
      };
    }
  });
  Cls.initClass();

  //# Local storage collection
  Cls = (Entities.LocalSearchAddonsCollection = class LocalSearchAddonsCollection extends App.Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.SearchAddons;
      this.prototype.localStorage = new Backbone.LocalStorage(API.localKey);
    }
  });
  Cls.initClass();

  //# Get local storage entities
  App.reqres.setHandler("searchAddons:entities", items => API.getLocalCollection());

  //# Update local storage entities
  App.reqres.setHandler("searchAddons:update:entities", items => API.saveLocal(items));

  //# Clear local storage entities
  return App.reqres.setHandler("searchAddons:update:defaults", () => API.clearLocal());
});
