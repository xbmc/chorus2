@Kodi.module "ArtistApp", (ArtistApp, App, Backbone, Marionette, $, _) ->
	
  class ArtistApp.Router extends App.Router.Base
    appRoutes:
      "music/artists"   	: "list"
      "music/artist/:id"	: "view"

  API =

    list: ->
      new ArtistApp.List.Controller()

    view: (id) ->
      new ArtistApp.Show.Controller
        id: id

    action: (op, model) ->
      playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      switch op
        when 'play'
          playlist.play 'artistid', model.get('artistid')
        when 'add'
          playlist.add 'artistid', model.get('artistid')
        else
          ## nothing


  App.on "before:start", ->
    new ArtistApp.Router
      controller: API

  App.commands.setHandler 'artist:action', (op, model) ->
    API.action op, model
