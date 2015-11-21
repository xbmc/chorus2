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

    episodeAction: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'video', 'PlayList'
      files = App.request "command:kodi:controller", 'video', 'Files'
      videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      switch op
        when 'play'
          App.execute "command:video:play", model, 'episodeid'
        when 'add'
          playlist.add 'episodeid', model.get('episodeid')
        when 'localplay'
          files.videoStream model.get('file'), model.get('fanart')
        when 'download'
          files.downloadFile model.get('file')
        when 'toggleWatched'
          videoLib.toggleWatched model
        else
        ## nothing


  App.commands.setHandler 'episode:action', (op, view) ->
    API.episodeAction op, view

  App.on "before:start", ->
    new TVShowApp.Router
      controller: API


