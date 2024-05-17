// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CategoryApp", function(CategoryApp, App, Backbone, Marionette, $, _) {

  //# This is a generic app for category listings (eg Genres)

  const Cls = (CategoryApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes =
        {"music/genres"   : "musicGenres"};
    }
  });
  Cls.initClass();


  const API = {

    musicGenres() {
      return new CategoryApp.List.Controller({
        entityKey: 'genre:entities',
        media: 'audio',
        subNavParent: 'music'
      });
    }
  };



  return App.on("before:start", () => new CategoryApp.Router({
    controller: API}));
});

