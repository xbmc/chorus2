/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ThumbsApp", function(ThumbsApp, App, Backbone, Marionette, $, _) {

  const Cls = (ThumbsApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes =
        {"thumbsup"        : "list"};
    }
  });
  Cls.initClass();

  const API = {
    list() {
      return new ThumbsApp.List.Controller();
    }
  };

  return App.on("before:start", () => new ThumbsApp.Router({
    controller: API}));
});

