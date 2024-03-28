// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PVR", function(PVR, App, Backbone, Marionette, $, _) {

  const Cls = (PVR.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "pvr/tv"          : "tv",
        "pvr/radio"       : "radio",
        "pvr/recordings"  : "recordings"
      };
    }
  });
  Cls.initClass();

  const API = {

    tv() {
      return new PVR.ChannelList.Controller({
        group: 'alltv'});
    },

    radio() {
      return new PVR.ChannelList.Controller({
        group: 'allradio'});
    },

    recordings() {
      return new PVR.RecordingList.Controller();
    }
  };


  return App.on("before:start", () => new PVR.Router({
    controller: API}));
});

