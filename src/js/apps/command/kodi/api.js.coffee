@Kodi.module "Command.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Base commander with shared functionality.
  class Api.Commander extends App.Command.Kodi.Base

    playerActive: 0 ## default to audio
    playerForced: false ## If false will check active player before a command

    ## Applies to player and playlists.
    playerIds:
      audio: 0
      video: 1

    setPlayer: (player) ->
      if player is 'audio' or player is 'video'
        @activePlayer = @playerIds[player]
        @playerForced = true

    getPlayer: ->
      @activePlayer


  ## Player commander.
  class Api.Player extends Api.Commander

    commandNameSpace: 'Player.'

    initialize: (player = 'audio') ->
      @setPlayer player

    getCommand: (command) ->
      @commandNameSpace + command

    getParams: (params = [], callback) ->
      if @playerForced
        defaultParams = [@playerActive]
        @doCallback callback, defaultParams.concat(params)
      else
        @getActivePlayers (activeId) =>
          defaultParams = [activeId]
          @doCallback callback, defaultParams.concat(params)

    getActivePlayers: (callback) ->
      @singleCommand @getCommand("GetActivePlayers"), {}, (resp) =>
        if resp.length > 0
          @playerActive = resp[0].playerid
          @triggerMethod "player:ready", @playerActive
          @doCallback callback, @playerActive
        else
          @doCallback callback, @playerActive

    sendCommand: (command, params = [], callback) ->
      @getParams params, (playerParams) =>
        @singleCommand @getCommand(command), playerParams, (resp) =>
          @doCallback callback, resp


