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
        $('#search-region').removeClass 'pre-search'
        val = $('#search').val()
        media = if helpers.url.arg(0) is 'search' then helpers.url.arg(1) else 'all'
        clearTimeout App.searchAllTimeout
        # If enter key
        if e.which is 13
          API.list media, val
        else
          $('#search-region').addClass 'pre-search'
          # Start search in @keyUpTimeout
          App.searchAllTimeout = setTimeout(( ->
            $('#search-region').removeClass 'pre-search'
            API.list media, val
          ), API.keyUpTimeout)


  App.on "before:start", ->
    new SearchApp.Router
      controller: API

  ## Bind to the search box.
  App.addInitializer ->
    App.vent.on "shell:ready", ->
      API.searchBind()

