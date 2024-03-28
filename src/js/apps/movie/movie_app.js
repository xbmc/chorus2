/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MovieApp", function(MovieApp, App, Backbone, Marionette, $, _) {

  const Cls = (MovieApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "movies"    : "list",
        "movie/:id" : "view"
      };
    }
  });
  Cls.initClass();

  const API = {

    list() {
      return new MovieApp.List.Controller();
    },

    view(id) {
      return new MovieApp.Show.Controller({
        id});
    },

    action(op, view) {
      const {
        model
      } = view;
      const playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      const files = App.request("command:kodi:controller", 'video', 'Files');
      const videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      switch (op) {
        case 'play':
          return App.execute("input:resume", model, 'movieid');
        case 'add':
          return playlist.add('movieid', model.get('movieid'));
        case 'localplay':
          return files.videoStream(model.get('file'), model.get('fanart'));
        case 'download':
          return files.downloadFile(model.get('file'));
        case 'toggleWatched':
          return videoLib.toggleWatched(model, 'auto');
        case 'edit':
          return App.execute('movie:edit', model);
        case 'refresh':
          return helpers.entities.refreshEntity(model, videoLib, 'refreshMovie');
        default:
      }
    }
  };
        //# nothing


  App.reqres.setHandler('movie:action:items', () => ({
    actions: {watched: tr('Watched'), thumbs: tr('Thumbs up')},
    menu: {add: tr('Queue in Kodi'), 'divider-1': '', download: tr('Download'), localplay: tr('Play in browser'), 'divider-2': '', edit: tr('Edit')}
  }));

  App.commands.setHandler('movie:action', (op, view) => API.action(op, view));

  App.commands.setHandler('movie:action:watched', function(parent, viewItem) {
    const op = parent.$el.hasClass('is-watched') ? 'unwatched' : 'watched';
    const progress = op === 'watched' ? 100 : 0;
    parent.$el.toggleClass('is-watched');
    helpers.entities.setProgress(parent.$el, progress);
    helpers.entities.setProgress(parent.$el.closest('.movie-show').find('.region-content-wrapper'), progress);
    return API.action('toggleWatched', viewItem);
  });

  App.commands.setHandler('movie:edit', function(model) {
    const loadedModel = App.request("movie:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, () => {
      return new MovieApp.Edit.Controller({
        model: loadedModel});
    });
  });


  return App.on("before:start", () => new MovieApp.Router({
    controller: API}));
});
