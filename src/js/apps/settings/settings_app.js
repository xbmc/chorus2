/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp", function(SettingsApp, App, Backbone, Marionette, $, _) {

  const Cls = (SettingsApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "settings/web"    : "local",
        "settings/kodi"   : "kodi",
        "settings/kodi/:section" : "kodi",
        "settings/addons" : "addons",
        "settings/nav" : "navMain",
        "settings/search" : "search"
      };
    }
  });
  Cls.initClass();

  var API = {

    subNavId: 'settings/web',

    local() {
      return new SettingsApp.Show.Local.Controller();
    },

    addons() {
      return new SettingsApp.Show.Addons.Controller();
    },

    navMain() {
      return new SettingsApp.Show.navMain.Controller();
    },

    search() {
      return new SettingsApp.Show.Search.Controller();
    },

    kodi(section, category) {
      return new SettingsApp.Show.Kodi.Controller({
        section,
        category
      });
    },

    getSubNav() {
      const collection = App.request("settings:kodi:entities", {type: 'sections'});
      const sidebarView = new SettingsApp.Show.Sidebar();

      // On sidebar show.
      App.listenTo(sidebarView, "show", () => {

        // Get Kodi settings menu.
        App.execute("when:entity:fetched", collection, () => {
          const kodiSettingsView = App.request("navMain:collection:show", collection, t.gettext('Kodi settings'));
          return sidebarView.regionKodiNav.show(kodiSettingsView);
        });

        // Get Local/Web settings menu.
        const settingsNavView = App.request("navMain:children:show", API.subNavId, 'General');
        return sidebarView.regionLocalNav.show(settingsNavView);
      });

      return sidebarView;
    }
  };


  App.on("before:start", () => new SettingsApp.Router({
    controller: API}));

  return App.reqres.setHandler('settings:subnav', () => API.getSubNav());
});

