@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->


  ## Base commander with shared functionality.
  class Api.Commander extends Api.Base

    playerActive: 0 ## default to audio
    playerName: 'music'
    playerForced: false ## If false will check active player before a command

    ## Applies to player and playlists.
    playerIds:
      audio: 0
      video: 1

    setPlayer: (player) ->
      if player is 'audio' or player is 'video'
        @playerActive = @playerIds[player]
        @playerName = player
        @playerForced = true

    getPlayer: ->
      @playerActive

    getPlayerName: ->
      @playerName

    ## get the player name via the id (eg return audio, video)
    playerIdToName: (playerId) ->
      playerName
      for name, id of @playerIds when id is playerId
        playerName = name
      playerName


    ## Namespace should be added in each extending class
    commandNameSpace: 'JSONRPC'

    ## Namespace can be overriden when called
    getCommand: (command, namespace = @commandNameSpace) ->
      namespace + '.' + command

    ## Send a command
    sendCommand: (command, params, callback) ->
      @singleCommand @getCommand(command), params, (resp) =>
        @doCallback callback, resp


  ## Player commander.
  class Api.Player extends Api.Commander

    commandNameSpace: 'Player'
    playlistApi: {}

    initialize: (media = 'audio') ->
      @setPlayer media
      @playlistApi = App.request "playlist:kodi:entity:api"

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
          @playerName = @playerIdToName(@playerActive)
          @triggerMethod "player:ready", @playerActive
          @doCallback callback, @playerActive
        else
          @doCallback callback, @playerActive

    sendCommand: (command, params = [], callback) ->
      @getParams params, (playerParams) =>
        @singleCommand @getCommand(command), playerParams, (resp) =>
          @doCallback callback, resp

    playEntity: (type, value, options = {}, callback) ->
      params = []
      data = @paramObj(type, value)
      if type is 'position'
        data.playlistid = @getPlayer()
      params.push data
      if options.length > 0
        params.push options
      @singleCommand @getCommand('Open', 'Player'), params, (resp) =>
        if not App.request 'sockets:active'
          # App.request 'player:kodi:timer', 'start'
          App.request 'state:kodi:update'
        @doCallback callback, resp

    getPlaying: (callback) ->
      obj = {active: false, properties: false, item: false}
      @singleCommand @getCommand('GetActivePlayers'), {}, (resp) =>
        if resp.length > 0
          obj.active = resp[0] ## Only use the first active player (cant think of 2 running at the same time?)
          commands = []
          itemFields = helpers.entities.getFields(@playlistApi.fields, 'full')
          playerFields = ["playlistid", "speed", "position", "totaltime", "time", "percentage", "shuffled", "repeat", "canrepeat", "canshuffle", "canseek", "partymode"]
          commands.push {method: @getCommand('GetProperties'), params: [obj.active.playerid, playerFields]}
          commands.push {method: @getCommand('GetItem'), params: [obj.active.playerid, itemFields]}
          @multipleCommands commands, (playing) =>
            obj.properties = playing[0]
            obj.item = playing[1].item
            @doCallback callback, obj
        else
          @doCallback callback, false ## nothing playing
