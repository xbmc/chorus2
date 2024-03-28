/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp", function(PlaylistApp, App, Backbone, Marionette, $, _) {

  const Cls = (PlaylistApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes =
        {"playlist"    : "list"};
    }
  });
  Cls.initClass();

  const API = {

    list() {
      //# Show the search form (for mobile)
      return new PlaylistApp.Show.Controller();
    },

    export(collection) {
      return new PlaylistApp.M3u.Controller({
        collection});
    },

    type: 'kodi',
    media: 'audio',

    setContext(type = 'kodi', media = 'audio') {
      this.type = type;
      return this.media = media;
    },

    getController() {
      return App.request(`command:${this.type}:controller`, this.media, 'PlayList');
    },

    getPlaylistItems() {
      return App.request(`playlist:${this.type}:entities`, this.media);
    }
  };


  App.reqres.setHandler("playlist:list", function(type, media) {
    API.setContext(type, media);
    return API.getPlaylistItems();
  });

  App.commands.setHandler("playlist:export", collection => API.export(collection));



  App.on("before:start", () => new PlaylistApp.Router({
    controller: API}));


  return App.addInitializer(function() {
    const controller = new PlaylistApp.List.Controller();

    //# Triggers for other modules to refresh th playlist
    App.commands.setHandler("playlist:refresh", (type, media) => controller.renderList(type, media));

    // Trigger on item changed
    return App.vent.on("state:kodi:playing:updated", stateObj => controller.focusPlaying(stateObj.getState('player'), stateObj.getPlaying()));
  });
});

