@Kodi.module "BrowserApp", (BrowserApp, App, Backbone, Marionette, $, _) ->

  class BrowserApp.Router extends App.Router.Base
    appRoutes:
      "browser"   	      : "list"
      "browser/:type/:id"	: "view"

  API =

    list: ->
      new BrowserApp.List.Controller

    view: (type, id) ->
      new BrowserApp.List.Controller
        type: id
        id: id


  App.on "before:start", ->
    new BrowserApp.Router
      controller: API


