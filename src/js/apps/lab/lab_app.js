/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Lab App handles new experimental features.
//
// Each sub module should have its own folder with controller, view, etc.
// Global Lab features here.
//
// @param [Object] This app object
// @param [Object] The full application object
// @param [Object] Backbone
// @param [Object] Marionette
// @param [Object] jQuery
// @param [Object] lodash (underscore)
//
this.Kodi.module("LabApp", function(LabApp, App, Backbone, Marionette, $, _) {

  // Create our LabApp router.
  const Cls = (LabApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "lab" : "labLanding",
        "lab/api-browser"         : "apiBrowser",
        "lab/api-browser/:method" : "apiBrowser",
        "lab/screenshot"          : "screenShot",
        "lab/icon-browser"        : "iconBrowser"
      };
    }
  });
  Cls.initClass();

  // Lab API controller.
  const API = {

    labLanding() {
      const view = new LabApp.lab.labItems({
        collection: new App.Entities.NavMainCollection(this.labItems())});
      return App.regionContent.show(view);
    },

    // TODO Make dynamic, some sort of hook or registry.
    labItems() {
      return [
        {
          title: 'API browser',
          description: 'Execute any API command.',
          path: 'lab/api-browser'
        },
        {
          title: 'Screenshot',
          description: 'Take a screenshot of Kodi right now.',
          path: 'lab/screenshot'
        },
        {
          title: 'Icon browser',
          description: 'View all the icons available to Chorus.',
          path: 'lab/icon-browser'
        }
      ];
    },

    // Open the api explorer.
    apiBrowser(method = false){
      return new LabApp.apiBrowser.Controller({
        method});
    },

    screenShot() {
      App.execute("input:action", 'screenshot');
      App.execute("notification:show", t.gettext("Screenshot saved to your screenshots folder"));
      return App.navigate("#lab", {trigger: true});
    },

    iconBrowser() {
      return $.getJSON('lib/icons/mdi.json', mdiIcons => {
        return $.getJSON('lib/icons/icomoon.json', customIcons => {
          console.log(mdiIcons, customIcons);
          const view = new LabApp.IconBrowser.IconsPage({
            materialIcons: mdiIcons,
            customIcons
          });
          return App.regionContent.show(view);
        });
      });
    }
  };

  return App.on("before:start", () => new LabApp.Router({
    controller: API}));
});
