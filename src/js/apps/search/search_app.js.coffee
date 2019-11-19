@Kodi.module "SearchApp", (SearchApp, App, Backbone, Marionette, $, _) ->

  class SearchApp.Router extends App.Router.Base
    appRoutes:
      "search"        : "view"
      "search/:media/:query"  : "list"

  API =

    keyUpTimeout: 2000

    ## Search urls used for external searches
    externalSearchUrls:
      google     : 'https://www.google.com/webhp?#q=[QUERY]'
      imdb       : 'http://www.imdb.com/find?s=all&q=[QUERY]'
      tmdb       : 'https://www.themoviedb.org/search?query=[QUERY]'
      tvdb       : 'http://thetvdb.com/?searchseriesid=&tab=listseries&function=Search&string=[QUERY]'
      soundcloud : 'https://soundcloud.com/search?q=[QUERY]'
      youtube    : 'https://www.youtube.com/results?search_query=[QUERY]'

    list: (media, query) ->
      App.navigate "search/#{media}/#{query}"
      $('#search').val query
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


  ## Do an internal or external search
  App.commands.setHandler 'search:go', (type, query, provider = 'all') ->
    if type is 'internal'
      App.navigate "search/#{provider}/#{query}", {trigger: true}
    else if API.externalSearchUrls[provider]
      url = API.externalSearchUrls[provider].replace('[QUERY]', encodeURIComponent(query))
      window.open(url)


  App.on "before:start", ->
    new SearchApp.Router
      controller: API

  ## Bind to the search box.
  App.addInitializer ->
    App.vent.on "shell:ready", ->
      API.searchBind()

