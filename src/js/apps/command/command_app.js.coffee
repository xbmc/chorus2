@Kodi.module "CommandApp", (CommandApp, App, Backbone, Marionette, $, _) ->

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
    commander = new CommandApp.Kodi.Player('audio')
    commander.sendCommand method, params, callback

  ## Local: Get a controller for a specific player type and media
  App.reqres.setHandler "command:local:controller", (media = 'auto', controller) ->
    new CommandApp.Local[controller](media)


  ## Startup tasks.
  App.addInitializer ->
