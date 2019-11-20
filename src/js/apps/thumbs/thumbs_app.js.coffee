@Kodi.module "ThumbsApp", (ThumbsApp, App, Backbone, Marionette, $, _) ->

  class ThumbsApp.Router extends App.Router.Base
    appRoutes:
      "thumbsup"        : "list"

  API =
    list: ->
      new ThumbsApp.List.Controller()

  App.on "before:start", ->
    new ThumbsApp.Router
      controller: API

