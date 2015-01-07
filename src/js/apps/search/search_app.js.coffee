@Kodi.module "SearchApp", (SearchApp, App, Backbone, Marionette, $, _) ->

  class SearchApp.Router extends App.Router.Base
    appRoutes:
      "search"   	    : "view"
      "search/:query"	: "list"

  API =

    list: (query) ->
      new SearchApp.List.Controller
        query: query

    view: ->
      ## Show the search form (for mobile)


  App.on "before:start", ->
    new SearchApp.Router
      controller: API

