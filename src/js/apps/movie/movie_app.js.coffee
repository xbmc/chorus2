@Kodi.module "MovieApp", (MovieApp, App, Backbone, Marionette, $, _) ->

  class MovieApp.Router extends App.Router.Base
    appRoutes:
      "movies/recent"   	: "landing"
      "movies"   	: "list"
      "movie/:id"	: "view"

  API =

    landing: ->
      new MovieApp.Landing.Controller()

    list: ->
      new MovieApp.List.Controller()

    view: (id) ->
      new MovieApp.Show.Controller
        id: id

    action: (op, view) ->
      model = view.model
      playlist = App.request "command:kodi:controller", 'video', 'PlayList'
      files = App.request "command:kodi:controller", 'video', 'Files'
      videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      switch op
        when 'play'
          playlist.play 'movieid', model.get('movieid')
        when 'add'
          playlist.add 'movieid', model.get('movieid')
        when 'localplay'
          files.videoStream model.get('file')
        when 'download'
          files.downloadFile model.get('file')
        when 'toggleWatched'
          videoLib.toggleWatched model
        else
        ## nothing


  App.commands.setHandler 'movie:action', (op, view) ->
    API.action op, view


  App.on "before:start", ->
    new MovieApp.Router
      controller: API