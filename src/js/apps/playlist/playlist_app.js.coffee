@Kodi.module "PlaylistApp", (PlaylistApp, App, Backbone, Marionette, $, _) ->

  class PlaylistApp.Router extends App.Router.Base
    appRoutes:
      "playlist"   	: "list"

  API =

    list: ->
      ## Show the search form (for mobile)
      new PlaylistApp.Show.Controller();

    export: (collection) ->
      new PlaylistApp.M3u.Controller
        collection: collection

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

  App.commands.setHandler "playlist:export", (collection) ->
    API.export collection



  App.on "before:start", ->
    new PlaylistApp.Router
      controller: API


  App.addInitializer ->
    controller = new PlaylistApp.List.Controller()

    ## Triggers for other modules to refresh th playlist
    App.commands.setHandler "playlist:refresh", (type, media) ->
      controller.renderList type, media

    # Trigger on item changed
    App.vent.on "state:kodi:playing:updated", (stateObj) ->
      controller.focusPlaying stateObj.getState('player'), stateObj.getPlaying()

