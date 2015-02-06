@Kodi.module "PlaylistApp", (PlaylistApp, App, Backbone, Marionette, $, _) ->
	
  class PlaylistApp.Router extends App.Router.Base
    appRoutes:
      "playlist"   	: "list"

  API =

    list: ->
      ## Do something??

    type: 'kodi'
    media: 'audio'

    setContext: (type = 'kodi', media = 'audio') ->
      @type = type
      @media = media

    getController: ->
      App.request "command:#{@type}:controller", @media, 'PlayList'

    getPlaylistItems: ->
      App.request "playlist:#{@type}:entities", @media


  App.reqres.setHandler "playlist:list", (type, media) ->
    API.setContext(type, media)
    API.getPlaylistItems()


  App.on "before:start", ->
    new PlaylistApp.Router
      controller: API


  App.addInitializer ->
    controller = new PlaylistApp.List.Controller()

    ## Triggers for other modules to refresh th playlist
    App.commands.setHandler "playlist:refresh", (type, media) ->
      controller.renderList type, media



 