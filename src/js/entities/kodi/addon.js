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

  var API = {

    availableProviders: ['video', 'audio', 'executable'],

    fields: {
      minimal: ['addonid', 'name', 'type', 'thumbnail', 'label'],
      small: ['author', 'broken', 'description', 'version', 'enabled', 'extrainfo', 'summary'],
      full: ['fanart', 'path']
    },

    //# Fetch an entity collection.
    getCollection(type, callback) {
      const addonController = App.request("command:kodi:controller", 'auto', 'AddOn');
      return addonController.getEnabledAddons(true, function(addons) {
        const collection = new KodiEntities.AddonCollection(API.parseAddons(addons, type));
        return callback(collection);
      });
    },

    //# Parse the addons, adding a provides property and setup other properties we'll need
    parseAddons(addons, type) {
      const ret = [];
      for (var i in addons) {
        var addon = addons[i];
        addon.provides = [];
        addon.label = addon.name;
        addon = App.request("images:path:entity", addon);
        for (var extra of addon.extrainfo) {
          // We use the extrainfo to filter to only addons that provide content
          if (_.isObject(extra) && (extra.key === 'provides') && extra.value && helpers.global.inArray(extra.value, API.availableProviders)) {
            addon.provides.push(extra.value);
          }
        }
        // If addon provides and filter matches, add to collection
        if ((addon.provides.length > 0) && (helpers.global.inArray(type, addon.provides) || (type === 'all'))) {
          addon.providesDefault = _.first(addon.provides);
          addon.subtitle = tr(addon.providesDefault);
          ret.push(API.parsePath(addon));
        }
      }
      return ret;
    },

    //# Create a path for the addon depending on its function
    parsePath(addon) {
      if (helpers.global.inArray('executable', addon.provides)) {
        addon.url = 'addon/execute/' + addon.addonid;
      } else {
        const media = addon.providesDefault.replace('audio', 'music');
        addon.url = 'browser/' + media + '/' + encodeURIComponent('plugin://' + addon.addonid + '/');
      }
      return addon;
    }
  };


  /*
   Models and collections.
  */

  //# Single Addon model.
  let Cls = (KodiEntities.Addon = class Addon extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.idAttribute = "addonid";
    }
    defaults() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), {});
    }
  });
  Cls.initClass();

  //# Addon collection
  Cls = (KodiEntities.AddonCollection = class AddonCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Addon;
    }
  });
  Cls.initClass();


  /*
   Request Handlers.
  */

  //# Get a addon collection, optionally filtered by provider type
  return App.reqres.setHandler("addon:entities", (type = 'all', callback) => API.getCollection(type, callback));
});
