/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp.Radio", function(Radio, App, Backbone, Marionette, $, _) {

  const API = {

    addonId: 'plugin.audio.radio_de',

    searchAddon: {
      id: this.addonId,
      url: 'plugin://plugin.audio.radio_de/stations/search/[QUERY]',
      title: 'Radio',
      media: 'music'
    }
  };


  //# Provide search settings
  return App.reqres.setHandler("addon:search:settings:" + API.addonId, () => API.searchAddon);
});
