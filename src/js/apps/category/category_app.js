@Kodi.module "CategoryApp", (CategoryApp, App, Backbone, Marionette, $, _) ->

  ## This is a generic app for category listings (eg Genres)

  class CategoryApp.Router extends App.Router.Base
    appRoutes:
      "music/genres"   : "musicGenres"


  API =

    musicGenres: ->
      new CategoryApp.List.Controller
        entityKey: 'genre:entities'
        media: 'audio'
        subNavParent: 'music'



  App.on "before:start", ->
    new CategoryApp.Router
      controller: API

