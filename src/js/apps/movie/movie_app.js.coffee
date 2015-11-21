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
          App.execute "command:video:play", model, 'movieid'
        when 'add'
          playlist.add 'movieid', model.get('movieid')
        when 'localplay'
          files.videoStream model.get('file'), model.get('fanart')
        when 'download'
          files.downloadFile model.get('file')
        when 'toggleWatched'
          videoLib.toggleWatched model
        when 'edit'
          App.execute 'movie:edit', model
        else
        ## nothing


  App.reqres.setHandler 'movie:action:items', ->
    {
    actions: {watched: 'Watched', thumbs: 'Thumbs up'}
    menu: {add: 'Add to Kodi playlist', edit: 'Edit', divider: '', download: 'Download', localplay: 'Play in browser'}
    }

  App.commands.setHandler 'movie:action', (op, view) ->
    API.action op, view

  App.commands.setHandler 'movie:edit', (model) ->
    loadedModel = App.request "movie:entity", model.get('id')
    App.execute "when:entity:fetched", loadedModel, =>
      new MovieApp.Edit.Controller
        model: loadedModel


  App.on "before:start", ->
    new MovieApp.Router
      controller: API