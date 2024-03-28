/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  return (Show.Controller = class Controller extends App.Controllers.Base {

    //# The search landing page.
    initialize(options) {
      this.landing = this.getLanding();
      return App.regionContent.show(this.landing);
    }


    //# Get the base layout
    getLanding() {
      return new Show.Landing();
    }
  });
});
