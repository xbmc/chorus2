@Kodi.module "LandingApp", (LandingApp, App, Backbone, Marionette, $, _) ->

  class LandingApp.Router extends App.Router.Base
    appRoutes:
      "music"          : "list"
      "movies/recent"  : "list"
      "tvshows/recent" : "list"

  API =

    ## This defines what we will see on each landing page
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
          }
        ]
      movies:
        subnavId: 'movies/recent'
        sections: [
          {
            title: 'Recently added movies'
            entity: 'movie'
            sort: 'dateadded'
            order: 'descending'
            limit: 14
          }
          {
            title: 'Random movies'
            entity: 'movie'
            sort: 'random'
            order: 'descending'
            limit: 14
          }
        ]
      tvshows:
        subnavId: 'tvshows/recent'
        sections: [
          {
            title: 'Recently added episodes'
            entity: 'episode'
            sort: 'dateadded'
            order: 'descending'
            limit: 14
          }
          {
            title: 'Recently watched TV Shows'
            entity: 'tvshow'
            sort: 'lastplayed'
            order: 'descending'
            limit: 14
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
