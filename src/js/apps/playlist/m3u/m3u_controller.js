// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp.M3u", function(M3u, App, Backbone, Marionette, $, _) {

  return M3u.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {
      const List = this.getList(options.collection);
      return App.regionOffscreen.show(List);
    }

    //# Get the list
    getList(collection) {
      return new M3u.List({
        collection});
    }
  };
});
