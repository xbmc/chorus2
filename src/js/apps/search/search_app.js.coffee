@Kodi.module "SearchApp", (SearchApp, App, Backbone, Marionette, $, _) ->

  class SearchApp.Router extends App.Router.Base
    appRoutes:
      "search"   	    : "view"
      "search/:media/:query"	: "list"

  API =

    keyUpTimeout: 2000

    list: (media, query) ->
      App.navigate "search/#{media}/#{query}"
      $search = $('#search')
      if $search.val() is ''
        $search.val query
      new SearchApp.List.Controller
        query: query
        media: media

    view: ->
      ## Show the search form (for mobile)
      new SearchApp.Show.Controller();

    searchBind: ->
      $('#search').on 'keyup', (e) ->
        val = $('#search').val()
        clearTimeout App.searchAllTimeout
        if e.which is 13
          API.list 'all', val
        else
          App.searchAllTimeout = setTimeout(( ->
            API.list 'all', val
          ), API.keyUpTimeout)


  App.on "before:start", ->
    new SearchApp.Router
      controller: API

  ## Bind to the search box.
  App.addInitializer ->
    App.vent.on "shell:ready", ->
      API.searchBind()

