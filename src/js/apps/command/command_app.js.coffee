@Kodi.module "CommandApp", (CommandApp, App, Backbone, Marionette, $, _) ->

  API =
    ## Return current playlist controller.
    currentAudioPlaylistController: ->
      stateObj = App.request "state:current"
      App.request "command:" + stateObj.getPlayer() + ":controller", 'audio', 'PlayList'


  ###
    Kodi.
  ###

  ## Kodi: Execute a command
  App.reqres.setHandler "command:kodi:player", (method, params, callback) ->
    commander = new CommandApp.Kodi.Player('auto')
    commander.sendCommand method, params, callback

  ## Kodi: Get a controller for a specific player type and media
  App.reqres.setHandler "command:kodi:controller", (media = 'auto', controller) ->
    new CommandApp.Kodi[controller](media)

  ###
    Local.
  ###

  ## Local: Execute a command
  App.reqres.setHandler "command:local:player", (method, params, callback) ->
    commander = new CommandApp.Local.Player('audio')
    commander.sendCommand method, params, callback

  ## Local: Get a controller for a specific player type and media
  App.reqres.setHandler "command:local:controller", (media = 'auto', controller) ->
    new CommandApp.Local[controller](media)

  ###
    Wrappers single command for playing in kodi and local.
  ###

  ## Play Audio in kodi or local depending on active player.
  App.commands.setHandler "command:audio:play", (type, value) ->
    API.currentAudioPlaylistController().play type, value

  ## Queue Audio in kodi or local depending on active player.
  App.commands.setHandler "command:audio:add", (type, value) ->
    API.currentAudioPlaylistController().add type, value

  ## Startup tasks.
  App.addInitializer ->
