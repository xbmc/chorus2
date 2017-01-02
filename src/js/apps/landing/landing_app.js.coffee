@Kodi.module "LandingApp", (LandingApp, App, Backbone, Marionette, $, _) ->

  class LandingApp.Router extends App.Router.Base
    appRoutes:
      "music"               : "landingPage"
      "movies/recent"       : "landingPage"
      "tvshows/recent"      : "landingPage"
      "music/genre/:filter" : "filteredPage"

  API =

    ## This defines what we will see on each landing page
    ## Example of a complex filter using rules
    ## {"and": [{'operator': 'is', 'field': 'playcount', 'value': '0'}, {'operator': 'is', 'field': 'year', 'value': '2015'}]}
    landingSettings:
      music:
        subnavId: 'music'
        sections: [
          {
            title: 'Recently added albums'
            entity: 'album'
            sort: 'dateadded'
            order: 'descending'
            limit: 14
            moreLink: 'music/albums?sort=dateadded&order=desc'
          }
          {
            title: 'Recently played albums'
            entity: 'album'
            sort: 'lastplayed'
            order: 'descending'
            limit: 14
          }
          {
            title: 'Random albums'
            entity: 'album'
            sort: 'random'
            order: 'descending'
            limit: 14
            moreLink: 'music/albums?sort=random'
          }
        ]
      movies:
        subnavId: 'movies/recent'
        sections: [
          {
            title: 'Continue watching'
            entity: 'movie'
            sort: 'lastplayed'
            order: 'descending'
            limit: 14,
            filter: {'operator': 'true', 'field': 'inprogress', 'value': ''}
            moreLink: 'movies?sort=dateadded&order=desc&inprogress=in progress'
          }
          {
            title: 'Recently added'
            entity: 'movie'
            sort: 'dateadded'
            order: 'descending'
            limit: 14
            filter: {'operator': 'is', 'field': 'playcount', 'value': '0'}
            moreLink: 'movies?sort=dateadded&order=desc&unwatched=unwatched'
          }
          {
            title: 'Random movies'
            entity: 'movie'
            sort: 'random'
            order: 'descending'
            limit: 14
            moreLink: 'movies?sort=random'
          }
        ]
      tvshows:
        subnavId: 'tvshows/recent'
        sections: [
          {
            title: 'Continue watching'
            entity: 'tvshow'
            sort: 'lastplayed'
            order: 'descending'
            limit: 14
            filter: {'operator': 'true', 'field': 'inprogress', 'value': ''}
            moreLink: 'tvshows?sort=dateadded&order=desc&inprogress=in progress'
          }
          {
            title: 'Recently added'
            entity: 'episode'
            sort: 'dateadded'
            order: 'descending'
            limit: 12
            filter: {'operator': 'is', 'field': 'playcount', 'value': '0'}
          }
        ]

    ## Filtered sections require an argument passed and are used for pages such as genere
    ## Key name should be "arg0 + arg1", filter should be "arg2"
    ## Filter gets replaced in sections[i].filter.value and prepended to moreLink
    filteredSettings:
      musicgenre:
        subnavId: 'music'
        sections: [
          {
            title: '%1$s Artists'
            entity: 'artist'
            sort: 'title'
            order: 'ascending'
            limit: 500
            filter: {'operator': 'is', 'field': 'genre', 'value': '[FILTER]'}
          }
          {
            title: '%1$s Albums'
            entity: 'album'
            sort: 'title'
            order: 'ascending'
            limit: 500
            filter: {'operator': 'is', 'field': 'genre', 'value': '[FILTER]'}
          }
          {
            title: '%1$s Songs'
            entity: 'song'
            sort: 'title'
            order: 'ascending'
            limit: 1000
            filter: {'operator': 'is', 'field': 'genre', 'value': '[FILTER]'}
          }
        ]


    landingPage: () ->
      type = helpers.url.arg 0
      settings = API.landingSettings[type]
      new LandingApp.Show.Controller
        settings: settings
        filter: false

    filteredPage: (filter) ->
      type = helpers.url.arg(0) + helpers.url.arg(1)
      settings = API.filteredSettings[type]
      new LandingApp.Show.Controller
        settings: settings
        filter: decodeURIComponent(filter)


  ## Register controller
  App.on "before:start", ->
    new LandingApp.Router
      controller: API
