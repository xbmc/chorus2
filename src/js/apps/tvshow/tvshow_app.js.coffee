@Kodi.module "TVShowApp", (TVShowApp, App, Backbone, Marionette, $, _) ->
	
  class TVShowApp.Router extends App.Router.Base
    appRoutes:
      "tvshows/recent"   	                  : "landing"
      "tvshows"   	                        : "list"
      "tvshow/:tvshowid"	                  : "view"
      "tvshow/:tvshowid/:season"	          : "season"
      "tvshow/:tvshowid/:season/:episodeid"	: "episode"

  API =

    landing: ->
      new TVShowApp.Landing.Controller()

    list: ->
      new TVShowApp.List.Controller()

    view: (tvshowid) ->
      new TVShowApp.Show.Controller
        id: tvshowid

    season: (tvshowid, season) ->
      new TVShowApp.Season.Controller
        id: tvshowid
        season: season

    episode: (tvshowid, season, episodeid) ->
      new TVShowApp.Episode.Controller
        id: tvshowid
        season: season
        episodeid: episodeid

    toggleWatched: (model, season = 'all', op) ->
      API.getAllEpisodesCollection model.get('tvshowid'), season, (collection) ->
        videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
        videoLib.toggleWatchedCollection collection, op

    toggleWatchedUiState: ($el, setChildren = true) ->
      op = if $el.hasClass('is-watched') then 'unwatched' else 'watched'
      classOp = if op is 'watched' then 'addClass' else 'removeClass'
      progress = if op is 'watched' then 100 else 0
      $el[classOp]('is-watched')
      helpers.entities.setProgress($el, progress)
      helpers.entities.setProgress($el.closest('.episode-show'), progress)
      $layout = $el.closest('.tv-collection')
      # If on a TV show or season page we also need set progress and watched on child collection
      if setChildren
        $layout.find('.region-content .card')[classOp]('is-watched')
        helpers.entities.setProgress($layout, progress)
      # Update the unwatched episodes
      unwatched = parseInt($layout.find('.episode-total').text()) - $layout.find('.region-content .is-watched').length
      $layout.find('.episode-unwatched').html(unwatched)
      $layout

    getAllEpisodesCollection: (tvshowid, season, callback) ->
      collectionAll = App.request "episode:entities", tvshowid, season
      App.execute "when:entity:fetched", collectionAll, =>
        callback collectionAll

    episodeAction: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'video', 'PlayList'
      files = App.request "command:kodi:controller", 'video', 'Files'
      videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      # Action to do
      switch op
        when 'play'
          App.execute "input:resume", model, 'episodeid'
        when 'add'
          playlist.add 'episodeid', model.get('episodeid')
        when 'localplay'
          files.videoStream model.get('file'), model.get('fanart')
        when 'download'
          files.downloadFile model.get('file')
        when 'toggleWatched'
          videoLib.toggleWatched model, 'auto'
        else
          ## nothing

    tvShowAction: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'video', 'PlayList'
      season = if model.get('type') is 'season' then model.get('season') else 'all'
      switch op
        when 'play'
          API.getAllEpisodesCollection model.get('tvshowid'), season, (collection) ->
            playlist.playCollection collection
        when 'add'
          API.getAllEpisodesCollection model.get('tvshowid'), season, (collection) ->
            playlist.addCollection collection
        when 'watched'
          API.toggleWatched model, season, op
        when 'unwatched'
          API.toggleWatched model, season, op
        when 'edit'
          App.execute 'tvshow:edit', model
        else
          ## nothing

  App.commands.setHandler 'episode:action', (op, view) ->
    API.episodeAction op, view

  App.commands.setHandler 'tvshow:action', (op, view) ->
    API.tvShowAction op, view

  App.reqres.setHandler 'tvshow:action:items', ->
    {
      actions: {watched: 'Watched', thumbs: 'Thumbs up'}
      menu: {add: 'Add to Kodi playlist'}
    }

  App.commands.setHandler 'tvshow:action:watched', (parent, viewItem, setChildren = false) ->
    op = if parent.$el.hasClass('is-watched') then 'unwatched' else 'watched'
    if viewItem.model.get('type') is 'season'
      msg = t.gettext('Set all episodes for this season as') + ' ' + t.gettext(op)
    else
      msg = t.gettext('Set all episodes for this TV show as') + ' ' + t.gettext(op)
    App.execute "ui:modal:confirm", t.gettext('Are you sure?'), msg, () ->
      API.toggleWatchedUiState parent.$el, setChildren
      API.tvShowAction op, viewItem

  App.commands.setHandler 'episode:action:watched', (parent, viewItem) ->
    API.toggleWatchedUiState parent.$el, false
    API.episodeAction 'toggleWatched', viewItem

  App.on "before:start", ->
    new TVShowApp.Router
      controller: API


