/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("BrowserApp", function(BrowserApp, App, Backbone, Marionette, $, _) {

  const Cls = (BrowserApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "browser"           : "list",
        "browser/:media/:id"  : "view"
      };
    }
  });
  Cls.initClass();

  const API = {

    list() {
      return new BrowserApp.List.Controller;
    },

    view(media, id) {
      return new BrowserApp.List.Controller({
        media,
        id
      });
    }
  };


  return App.on("before:start", () => new BrowserApp.Router({
    controller: API}));
});


