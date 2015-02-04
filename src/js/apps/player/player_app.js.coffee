@Kodi.module "PlayerApp", (PlayerApp, App, Backbone, Marionette, $, _) ->

  API =

    getKodiPlayer: ->
      new PlayerApp.Show.Player()

    doPlayerCommand: (command, params, callback) ->
      App.request "command:kodi:player", command, params, callback

    initKodiPlayer: (player) ->

      App.listenTo player, "conrol:play", =>
        console.log 'play'
        @doPlayerCommand 'PlayPause', 'toggle'




  @onStart = (options) ->
    App.vent.on "shell:ready", (options) =>
      kodiPlayer = API.getKodiPlayer()
      App.regionPlayerKodi.show kodiPlayer
      API.initKodiPlayer kodiPlayer
