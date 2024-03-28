/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp.MixCloud", function(MixCloud, App, Backbone, Marionette, $, _) {

  const API = {

    addonId: 'plugin.audio.mixcloud',

    searchAddon: {
      id: this.addonId,
      url: 'plugin://plugin.audio.mixcloud/?mode=30&key=cloudcast&offset=0&query=[QUERY]',
      title: 'MixCloud',
      media: 'music'
    }
  };

  //# Provide search settings
  return App.reqres.setHandler("addon:search:settings:" + API.addonId, () => API.searchAddon);
});
