/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AlbumApp", function(AlbumApp, App, Backbone, Marionette, $, _) {

  const Cls = (AlbumApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "music/albums"      : "list",
        "music/album/:id"   : "view"
      };
    }
  });
  Cls.initClass();

  const API = {

    list() {
      return new AlbumApp.List.Controller();
    },

    view(id) {
      return new AlbumApp.Show.Controller({
        id});
    },

    action(op, view) {
      const {
        model
      } = view;
      const playlist = App.request("command:kodi:controller", 'audio', 'PlayList');
      switch (op) {
        case 'play':
          return App.execute("command:audio:play", 'albumid', model.get('albumid'));
        case 'add':
          return playlist.add('albumid', model.get('albumid'));
        case 'localadd':
          return App.execute("localplaylist:addentity", 'albumid', model.get('albumid'));
        case 'localplay':
          var localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
          return localPlaylist.play('albumid', model.get('albumid'));
        default:
      }
    }
  };
        //# nothing


  App.on("before:start", () => new AlbumApp.Router({
    controller: API}));

  App.commands.setHandler('album:action', (op, model) => API.action(op, model));

  App.reqres.setHandler('album:action:items', () => ({
    actions: {thumbs: 'Thumbs up'},
    menu: {add: tr('Queue in Kodi'), 'divider-1': '', localadd: tr('Add to playlist'), localplay: tr('Play in browser'), 'divider-2': '', edit: tr('Edit')}
  }));

  return App.commands.setHandler('album:edit', function(model) {
    const loadedModel = App.request("album:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, () => {
      return new AlbumApp.Edit.Controller({
        model: loadedModel});
    });
  });
});
