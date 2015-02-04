@Kodi.module "AlbumApp", (AlbumApp, App, Backbone, Marionette, $, _) ->

  class AlbumApp.Router extends App.Router.Base
    appRoutes:
      "music/albums"      : "list"
      "music/album/:id"   : "view"

  API =

    list: ->
      new AlbumApp.List.Controller()

    view: (id) ->
      new AlbumApp.Show.Controller
        id: id


  App.on "before:start", ->
    new AlbumApp.Router
      controller: API
      