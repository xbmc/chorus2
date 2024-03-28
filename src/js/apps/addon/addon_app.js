/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp", function(AddonApp, App, Backbone, Marionette, $, _) {

  const Cls = (AddonApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "addons/:type"            : "list",
        "addon/execute/:id" : "execute"
      };
    }
  });
  Cls.initClass();

  var API = {

    // Get list page
    list(type) {
      return new AddonApp.List.Controller({
        type});
    },

    // Execute addon
    execute(id) {
      API.addonController().executeAddon(id, helpers.url.params(), () => Kodi.execute("notification:show", tr('Executed addon')));
      return App.navigate("addons/executable", {trigger: true});
    },

    // Get the addon controller
    addonController() {
      return App.request("command:kodi:controller", 'auto', 'AddOn');
    },

    // Get all enabled addons
    getEnabledAddons(callback) {
      let addons = [];
      // If loaded, return from static
      if (config.getLocal("addOnsLoaded", false) === true) {
        addons = config.getLocal("addOnsEnabled", []);
        if (callback) {
          callback(addons);
        }
      } else {
        // Not loaded, lookup and set to static
        this.addonController().getEnabledAddons(true, function(addons) {
          config.setLocal("addOnsEnabled", addons);
          config.setLocal("addOnsLoaded", true);
          config.set('app', "addOnsSearchSettings", API.getSearchSettings(addons));
          if (callback) {
            return callback(addons);
          }
        });
      }
      return addons;
    },

    //# Get search settings
    getSearchSettings(addons) {
      const searchSettings = [];
      for (var addon of addons) {
        var searchSetting = App.request("addon:search:settings:" + addon.addonid);
        if (searchSetting) {
          if (!_.isArray(searchSetting)) {
            searchSetting = [searchSetting];
          }
          for (var i in searchSetting) {
            var set = searchSetting[i];
            set.id = addon.addonid + '.' + i;
            searchSettings.push(set);
          }
        }
      }
      return searchSettings;
    },

    // Given a filter check if addon is enabled, if addons not loaded returns false.
    isAddOnEnabled(filter = {}, callback) {
      const addons = this.getEnabledAddons(callback);
      return _.findWhere(addons, filter);
    }
  };


  App.on("before:start", function() {
    new AddonApp.Router({
      controller: API});
    // Store enabled addons.
    return API.getEnabledAddons(resp => App.vent.trigger("navMain:refresh"));
  });
      // Addons loaded to cache, hopefully before required


  // Request is addon enabled.
  App.reqres.setHandler('addon:isEnabled', (filter, callback) => API.isAddOnEnabled(filter, function(enabled) { if (callback) { return callback(enabled); } }));

  // Request is addon enabled.
  App.reqres.setHandler('addon:enabled:addons', callback => API.getEnabledAddons(function(addons) { if (callback) { return callback(addons); } }));

  // Request excluded breadcrumb paths
  App.reqres.setHandler('addon:excludedPaths', function(addonId) {
    let excludedPaths;
    if (addonId != null) {
      excludedPaths = App.request("addon:excludedPaths:" + addonId);
    }
    if ((excludedPaths == null)) {
      excludedPaths = [];
    }
    return excludedPaths;
  });

  // Request excluded breadcrumb paths
  return App.reqres.setHandler('addon:search:enabled', function() {
    let settings = config.get('app', "addOnsSearchSettings", []);
    settings = settings.concat(App.request('searchAddons:entities').toJSON());
    return settings;
  });
});
