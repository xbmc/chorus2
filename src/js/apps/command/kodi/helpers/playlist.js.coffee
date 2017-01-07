@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Playlist requires some player functionality but is also its
  ## own thing so it extends the player.
  class Api.PlayList extends Api.Player

    commandNameSpace: 'Playlist'

    ## Play an item. Rules:
    ## - If in the playlist already, play that item
    ## - If currently playing, insert it next and play
    ## - If not playing clear playlist, add and play
    ## - If resume > 0 will resume from that point
    play: (type, value, model, resume = 0, callback) ->
      # Get items in the playlist
      @getItems (currentPlaylist) =>
        # If item is already in th playlist, play that
        plItem = {type: type.replace('id', ''), id: value}
        inPlaylist = if currentPlaylist.items then _.findWhere(currentPlaylist.items, plItem) else false
        if inPlaylist
          @playPosition inPlaylist.position, resume, callback
        else
          # Item needs to be added to playlist
          stateObj = App.request "state:kodi"
          ## If playing, queue up next.
          if stateObj.isPlaying(@getPlayerName())
            pos = if currentPlaylist.items then (stateObj.getPlaying('position') + 1) else 0
            @insertAndPlay type, value, pos, resume, callback
          else
            @clear =>
              @insertAndPlay type, value, 0, resume, callback

    ## Add a collection of models wrapper, will clear if not playing
    addCollection: (collection, position = 0, callback) ->
      stateObj = App.request "state:kodi"
      ## If playing, queue up next.
      if stateObj.isPlaying(@getPlayerName())
        position = (stateObj.getPlaying('position') + 1)
        @addCollectionItems collection, position, callback
      else
        @clear =>
          @addCollectionItems collection, position, callback
      position

    ## Add a collection of models
    addCollectionItems: (collection, position = 0, callback) ->
      App.execute "notification:show", t.gettext("Adding items to the queue")
      models = collection.getRawCollection()
      player = @getPlayer()
      commands = []
      ## build a set of commands so we can add all the models with one request.
      for i, model of models
        pos = parseInt(position) + parseInt(i)
        type = if model.type is 'file' then 'file' else model.type + 'id'
        params = [player, pos, @paramObj(type, model[type])]
        commands.push {method: @getCommand('Insert'), params: params}
      @multipleCommands commands, (resp) =>
        @doCallback callback, resp
        @refreshPlaylistView()

    # Add a collection of models.
    playCollection: (collection, position = 0) ->
      pos = @addCollection collection, position, (resp) =>
        @playEntity 'position', parseInt(pos), {}, =>
        @refreshPlaylistView()

    ## Add a item to the end of the playlist
    add: (type, value) ->
      @playlistSize (size) =>
        @insert type, value, size

    ## Remove an item from the list
    remove: (position, callback) ->
      @singleCommand @getCommand('Remove'), [@getPlayer(), parseInt(position)], (resp) =>
        @refreshPlaylistView()
        @doCallback callback, resp

    ## Clear a playlist.
    clear: (callback) ->
      @singleCommand @getCommand('Clear'), [@getPlayer()], (resp) =>
        @doCallback callback, resp

    ## Insert a song at a position
    insert: (type, value, position = 0, callback) ->
      @singleCommand @getCommand('Insert'), [@getPlayer(), parseInt(position), @paramObj(type,value)], (resp) =>
        @refreshPlaylistView()
        @doCallback callback, resp

    ## Get items in a playlist
    getItems: (callback) ->
      @singleCommand @getCommand('GetItems'), [@getPlayer(), ['title']], (resp) =>
        @doCallback callback, @parseItems(resp)

    ## Add position to each item in the playlist
    parseItems: (resp) ->
      if resp.items
        resp.items = _.map resp.items, (item, idx) ->
          item.position = parseInt(idx)
          item
      resp

    ## Insert a song at a position and play it
    insertAndPlay: (type, value, position = 0, resume = 0, callback) ->
      @insert type, value, position, (resp) =>
        @playPosition position, resume, callback

    ## Play a position in the playlist with optional resume
    playPosition: (position = 0, resume = 0, callback) ->
      @playEntity 'position', parseInt(position), {}, =>
        if resume > 0
          # Seek to resume point if not 0. Setting option {resume: true} does not work :(
          App.execute "player:kodi:progress:update", resume
        @doCallback callback

    ## Get the size of the current playlist
    playlistSize: (callback) ->
      @getItems (resp) =>
        position = if resp.items? then  resp.items.length else 0
        @doCallback callback, position

    ## Refresh playlist
    refreshPlaylistView: ->
      wsActive = App.request "sockets:active"
      if not wsActive
        App.execute "playlist:refresh", 'kodi', @playerName

    ## Move Item
    moveItem: (media, id, position1, position2, callback) ->
      idProp = if media is 'file' then 'file' else media + 'id'
      @singleCommand @getCommand('Remove'), [@getPlayer(), parseInt(position1)], (resp) =>
        @insert idProp, id, position2, =>
          @doCallback callback, position2

