@Kodi.module "CommandApp", (CommandApp, App, Backbone, Marionette, $, _) ->

  API =
    # Return current playlist controller.
    currentAudioPlaylistController: ->
      stateObj = App.request "state:current"
      App.request "command:" + stateObj.getPlayer() + ":controller", 'audio', 'PlayList'

    # Return current playlist controller.
    currentVideoPlayerController: ->
      stateObj = App.request "state:current"
      # Switch method depending on player
      method =  if stateObj.getPlayer() is 'local' then 'VideoPlayer' else 'PlayList'
      App.request "command:" + stateObj.getPlayer() + ":controller", 'video', method

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

  ## Play Video in kodi or local depending on active player.
  App.commands.setHandler "command:video:play", (model, type, resume = 0, callback) ->
    value = model.get(type)
    API.currentVideoPlayerController().play type, value, model, resume, (resp) ->
      # Problem: Home OSD to display when you 'add to playlist and play' when it is not empty
      # This might cause other issues but tested ok for me, so hack implemented!
      # TODO: Investigate, feels like a Kodi bug, but maybe not also.
      stateObj = App.request "state:current"
      if stateObj.getPlayer() is 'kodi'
        # If player is kodi, force full screen to full. This hides the home OSD.
        kodiVideo = App.request "command:kodi:controller", 'video', 'GUI'
        kodiVideo.setFullScreen true, callback

  ## Startup tasks.
  App.addInitializer ->
