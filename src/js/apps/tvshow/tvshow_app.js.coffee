@Kodi.module "TVShowApp", (TVShowApp, App, Backbone, Marionette, $, _) ->
	
  class TVShowApp.Router extends App.Router.Base
    appRoutes:
      "tvshows"   	                        : "list"
      "tvshow/:tvshowid"	                  : "view"
      "tvshow/:tvshowid/:season"	          : "season"
      "tvshow/:tvshowid/:season/:episodeid"	: "episode"

  API =

    list: ->
      new TVShowApp.List.Controller

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
      switch op
        when 'play'
          playlist.play 'episodeid', model.get('episodeid')
        when 'add'
          playlist.add 'episodeid', model.get('episodeid')
        when 'stream'
          files.videoStream model.get('file')
        when 'download'
          files.downloadFile model.get('file')
        else
        ## nothing


  App.commands.setHandler 'episode:action', (op, view) ->
    API.episodeAction op, view

  App.on "before:start", ->
    new TVShowApp.Router
      controller: API


