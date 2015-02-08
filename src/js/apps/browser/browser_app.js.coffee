@Kodi.module "BrowserApp", (BrowserApp, App, Backbone, Marionette, $, _) ->

  class BrowserApp.Router extends App.Router.Base
    appRoutes:
      "browser"   	      : "list"
      "browser/:media/:id"	: "view"

  API =

    list: ->
      new BrowserApp.List.Controller

    view: (media, id) ->
      new BrowserApp.List.Controller
        media: media
        id: id


  App.on "before:start", ->
    new BrowserApp.Router
      controller: API


