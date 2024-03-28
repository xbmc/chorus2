/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MusicVideoApp", function(MusicVideoApp, App, Backbone, Marionette, $, _) {

  const Cls = (MusicVideoApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "music/videos"      : "list",
        "music/video/:id"   : "view"
      };
    }
  });
  Cls.initClass();

  const API = {

    list() {
      return new MusicVideoApp.List.Controller();
    },

    view(id) {
      return new MusicVideoApp.Show.Controller({
        id});
    },

    action(op, view) {
      const {
        model
      } = view;
      const playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      const files = App.request("command:kodi:controller", 'video', 'Files');
      const videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      // Action to do
      switch (op) {
        case 'play':
          return App.execute("input:resume", model, 'musicvideoid');
        case 'add':
          return playlist.add('musicvideoid', model.get('musicvideoid'));
        case 'localplay':
          return files.videoStream(model.get('file'), model.get('fanart'));
        case 'download':
          return files.downloadFile(model.get('file'));
        case 'refresh':
          return helpers.entities.refreshEntity(model, videoLib, 'refreshMusicVideo');
        default:
      }
    }
  };
          //# nothing


  App.on("before:start", () => new MusicVideoApp.Router({
    controller: API}));

  App.commands.setHandler('musicvideo:action', (op, model) => API.action(op, model));

  App.reqres.setHandler('musicvideo:action:items', () => ({
    actions: {thumbs: tr('Thumbs up')},

    menu: {
      'add': tr('Queue in Kodi'),
      'divider-1': '',
      'download': tr('Download'),
      'stream': tr('Play in browser'),
      'divider-2': '',
      'edit': tr('Edit')
    }
  }));

  return App.commands.setHandler('musicvideo:edit', function(model) {
    const loadedModel = App.request("musicvideo:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, () => {
      return new MusicVideoApp.Edit.Controller({
        model: loadedModel});
    });
  });
});
