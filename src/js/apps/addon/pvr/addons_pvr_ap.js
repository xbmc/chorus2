// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp.Pvr", function(Pvr, App, Backbone, Marionette, $, _) {

  const API = {

    isEnabled() {
      return App.request("addon:isEnabled", {type: 'kodi.pvrclient'});
    }
  };

  //# Is a pvr client enabled (used for menu visibility).
  return App.reqres.setHandler("addon:pvr:enabled", () => API.isEnabled());
});
