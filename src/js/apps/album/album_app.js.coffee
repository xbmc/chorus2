@Kodi.module "AlbumApp", (AlbumApp, App, Backbone, Marionette, $, _) ->

  class AlbumApp.Router extends Marionette.AppRouter
    appRoutes:
      "music/albums"      : "list"
      "music/album/:id"   : "view"

  API =

    list: ->
      new AlbumApp.List.Controller()

    view: (id) ->
      new AlbumApp.Show.Controller
        id: id


  App.addInitializer ->
    new AlbumApp.Router
      controller: API
      