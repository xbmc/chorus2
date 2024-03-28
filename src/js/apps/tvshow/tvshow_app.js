/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp", function(TVShowApp, App, Backbone, Marionette, $, _) {

  const Cls = (TVShowApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "tvshows"                             : "list",
        "tvshow/:tvshowid"                    : "view",
        "tvshow/:tvshowid/:season"            : "season",
        "tvshow/:tvshowid/:season/:episodeid" : "episode"
      };
    }
  });
  Cls.initClass();

  var API = {

    list() {
      return new TVShowApp.List.Controller();
    },

    view(tvshowid) {
      return new TVShowApp.Show.Controller({
        id: tvshowid});
    },

    season(tvshowid, season) {
      return new TVShowApp.Season.Controller({
        id: tvshowid,
        season
      });
    },

    episode(tvshowid, season, episodeid) {
      return new TVShowApp.Episode.Controller({
        id: tvshowid,
        season,
        episodeid
      });
    },

    toggleWatched(model, season = 'all', op) {
      return API.getAllEpisodesCollection(model.get('tvshowid'), season, function(collection) {
        const videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
        return videoLib.toggleWatchedCollection(collection, op);
      });
    },

    toggleWatchedUiState($el, setChildren = true) {
      const op = $el.hasClass('is-watched') ? 'unwatched' : 'watched';
      const classOp = op === 'watched' ? 'addClass' : 'removeClass';
      const progress = op === 'watched' ? 100 : 0;
      $el[classOp]('is-watched');
      helpers.entities.setProgress($el, progress);
      const $layout = $el.closest('.tv-collection');
      // If on a TV show or season page we also need set progress and watched on child collection
      if (setChildren) {
        $layout.find('.region-content .card')[classOp]('is-watched');
        helpers.entities.setProgress($layout, progress);
      }
      // Update the unwatched episodes
      const unwatched = parseInt($layout.find('.episode-total').text()) - $layout.find('.region-content .is-watched').length;
      $layout.find('.episode-unwatched').text(unwatched);
      return $layout;
    },

    getAllEpisodesCollection(tvshowid, season, callback) {
      const collectionAll = App.request("episode:tvshow:entities", tvshowid, season);
      return App.execute("when:entity:fetched", collectionAll, () => {
        return callback(collectionAll);
      });
    },

    episodeAction(op, view) {
      const {
        model
      } = view;
      const playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      const files = App.request("command:kodi:controller", 'video', 'Files');
      const videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      // Action to do
      switch (op) {
        case 'play':
          return App.execute("input:resume", model, 'episodeid');
        case 'add':
          return playlist.add('episodeid', model.get('episodeid'));
        case 'localplay':
          return files.videoStream(model.get('file'), model.get('fanart'));
        case 'download':
          return files.downloadFile(model.get('file'));
        case 'toggleWatched':
          return videoLib.toggleWatched(model, 'auto');
        case 'gotoSeason':
          return App.navigate("#tvshow/" + model.get('tvshowid') + '/' + model.get('season'), {trigger: true});
        case 'refresh':
          return helpers.entities.refreshEntity(model, videoLib, 'refreshEpisode');
        default:
      }
    },
          //# nothing

    tvShowAction(op, view) {
      const {
        model
      } = view;
      const playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      const season = model.get('type') === 'season' ? model.get('season') : 'all';
      const videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      switch (op) {
        case 'play':
          return API.getAllEpisodesCollection(model.get('tvshowid'), season, collection => playlist.playCollection(collection));
        case 'add':
          return API.getAllEpisodesCollection(model.get('tvshowid'), season, collection => playlist.addCollection(collection));
        case 'watched':
          return API.toggleWatched(model, season, op);
        case 'unwatched':
          return API.toggleWatched(model, season, op);
        case 'edit':
          return App.execute('tvshow:edit', model);
        case 'refresh':
          return helpers.entities.refreshEntity(model, videoLib, 'refreshTVShow');
        case 'refreshEpisodes':
          return helpers.entities.refreshEntity(model, videoLib, 'refreshTVShow', {refreshepisodes: true});
        default:
      }
    }
  };
          //# nothing

  App.commands.setHandler('episode:action', (op, view) => API.episodeAction(op, view));

  App.commands.setHandler('tvshow:action', (op, view) => API.tvShowAction(op, view));

  App.reqres.setHandler('episode:action:items', () => ({
    actions: {watched: tr('Watched'), thumbs: tr('Thumbs up')},

    menu: {
      'add': tr('Queue in Kodi'),
      'divider-1': '',
      'download': tr('Download'),
      'localplay': tr('Play in browser'),
      'divider-2': '',
      'goto-season': tr('Go to season'),
      'divider-3': '',
      'edit': tr('Edit')
    }
  }));

  App.reqres.setHandler('tvshow:action:items', () => ({
    actions: {watched: tr('Watched'), thumbs: tr('Thumbs up')},
    menu: {add: tr('Queue in Kodi'), 'divider-': '', 'edit': tr('Edit')}
  }));

  App.commands.setHandler('tvshow:action:watched', function(parent, viewItem, setChildren = false) {
    let msg;
    const op = parent.$el.hasClass('is-watched') ? 'unwatched' : 'watched';
    if (viewItem.model.get('type') === 'season') {
      msg = tr('Set all episodes for this season as') + ' ' + tr(op);
    } else {
      msg = tr('Set all episodes for this TV show as') + ' ' + tr(op);
    }
    return App.execute("ui:modal:confirm", tr('Are you sure?'), msg, function() {
      API.toggleWatchedUiState(parent.$el, setChildren);
      return API.tvShowAction(op, viewItem);
    });
  });

  App.commands.setHandler('episode:action:watched', function(parent, viewItem) {
    API.toggleWatchedUiState(parent.$el, false);
    return API.episodeAction('toggleWatched', viewItem);
  });

  App.commands.setHandler('tvshow:edit', function(model) {
    const loadedModel = App.request("tvshow:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, () => {
      return new TVShowApp.EditShow.Controller({
        model: loadedModel});
    });
  });

  App.commands.setHandler('episode:edit', function(model) {
    const loadedModel = App.request("episode:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, () => {
      return new TVShowApp.EditEpisode.Controller({
        model: loadedModel});
    });
  });


  return App.on("before:start", () => new TVShowApp.Router({
    controller: API}));
});


