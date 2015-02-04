@Kodi.module "MovieApp", (MovieApp, App, Backbone, Marionette, $, _) ->

  class MovieApp.Router extends App.Router.Base
    appRoutes:
      "movies"   	: "list"
      "movie/:id"	: "view"

  API =

    list: ->
      new MovieApp.List.Controller()

    view: (id) ->
      new MovieApp.Show.Controller
        id: id

  App.on "before:start", ->
    new MovieApp.Router
      controller: API