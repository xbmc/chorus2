@Kodi.module "LandingApp", (LandingApp, App, Backbone, Marionette, $, _) ->

  class LandingApp.Router extends App.Router.Base
    appRoutes:
      "music"          : "list"
      "movies/recent"  : "list"
      "tvshows/recent" : "list"

  API =

    ## This defines what we will see on each landing page
    ## Example of a complex filter using rules
    ## {"and": [{'operator': 'is', 'field': 'playcount', 'value': '0'}, {'operator': 'is', 'field': 'year', 'value': '2015'}]}
    settings:
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

    list: () ->
      type = helpers.url.arg 0
      settings = API.settings[type]
      new LandingApp.Show.Controller
        settings: settings


  ## Register controller
  App.on "before:start", ->
    new LandingApp.Router
      controller: API
