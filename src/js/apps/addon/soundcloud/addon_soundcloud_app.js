// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp.SoundCloud", function(Soundcloud, App, Backbone, Marionette, $, _) {

  const API = {

    addonId: 'plugin.audio.soundcloud',

    searchAddon: {
      id: this.addonId,
      url: 'plugin://plugin.audio.soundcloud/search/?query=[QUERY]',
      title: 'SoundCloud',
      media: 'music'
    }
  };

  //# Provide search settings
  return App.reqres.setHandler("addon:search:settings:" + API.addonId, () => API.searchAddon);
});
