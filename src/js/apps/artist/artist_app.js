/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ArtistApp", function(ArtistApp, App, Backbone, Marionette, $, _) {

  const Cls = (ArtistApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "music/artists"     : "list",
        "music/artist/:id"  : "view"
      };
    }
  });
  Cls.initClass();

  const API = {

    list() {
      return new ArtistApp.List.Controller();
    },

    view(id) {
      return new ArtistApp.Show.Controller({
        id});
    },

    action(op, view) {
      const {
        model
      } = view;
      const playlist = App.request("command:kodi:controller", 'audio', 'PlayList');
      switch (op) {
        case 'play':
          return App.execute("command:audio:play", 'artistid', model.get('artistid'));
        case 'add':
          return playlist.add('artistid', model.get('artistid'));
        case 'localadd':
          return App.execute("localplaylist:addentity", 'artistid', model.get('artistid'));
        case 'localplay':
          var localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
          return localPlaylist.play('artistid', model.get('artistid'));
        default:
      }
    }
  };
          //# nothing


  App.on("before:start", () => new ArtistApp.Router({
    controller: API}));

  App.commands.setHandler('artist:action', (op, model) => API.action(op, model));

  App.reqres.setHandler('artist:action:items', () => ({
    actions: {thumbs: tr('Thumbs up')},
    menu: {add: tr('Queue in Kodi'), 'divider-1': '', localadd: tr('Add to playlist'), localplay: tr('Play in browser'), 'divider-1': '', edit: tr('Edit')}
  }));

  return App.commands.setHandler('artist:edit', function(model) {
    const loadedModel = App.request("artist:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, () => {
      return new ArtistApp.Edit.Controller({
        model: loadedModel});
    });
  });
});
