@Kodi.module "ArtistApp", (ArtistApp, App, Backbone, Marionette, $, _) ->
	
  class ArtistApp.Router extends App.Router.Base
    appRoutes:
      "music/artists"   	: "list"
      "music"   	        : "list"
      "music/artist/:id"	: "view"

  API =

    list: ->
      new ArtistApp.List.Controller()

    view: (id) ->
      new ArtistApp.Show.Controller
        id: id

  App.on "before:start", ->
    new ArtistApp.Router
      controller: API