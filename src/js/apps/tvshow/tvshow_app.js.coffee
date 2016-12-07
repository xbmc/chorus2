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

    getAllEpisodesCollection: (tvshowid, season, callback) ->
      collectionAll = App.request "episode:entities", tvshowid, 'all'
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
      files = App.request "command:kodi:controller", 'video', 'Files'
      switch op
        when 'play'
          API.getAllEpisodesCollection model.get('tvshowid'), 'all', (collection) ->
            playlist.playCollection collection
        when 'add'
          API.getAllEpisodesCollection model.get('tvshowid'), 'all', (collection) ->
            playlist.addCollection collection
        when 'watched'
          API.toggleWatched model, 'all', op
        when 'unwatched'
          API.toggleWatched model, 'all', op
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


  App.on "before:start", ->
    new TVShowApp.Router
      controller: API


