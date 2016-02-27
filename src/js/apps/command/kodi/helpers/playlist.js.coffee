@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Playlist requires some player functionality but is also its
  ## own thing so it extends the player.
  class Api.PlayList extends Api.Player

    commandNameSpace: 'Playlist'

    ## Play an item. If currently playing, insert it next, else clear playlist and add.
    play: (type, value) ->
      stateObj = App.request "state:kodi"
      if stateObj.isPlaying()
        @insertAndPlay type, value, (stateObj.getPlaying('position') + 1)
      else
        @clear =>
          @insertAndPlay type, value, 0

    ## Play a collection of models
    playCollection: (collection, position = 0) ->
      @clear =>
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
          @playEntity 'position', parseInt(position), {}, =>
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
        @doCallback callback, resp

    ## Insert a song at a position and play it
    insertAndPlay: (type, value, position = 0, callback) ->
      @insert type, value, position, (resp) =>
        @playEntity 'position', parseInt(position), {}, =>
          @doCallback callback, resp

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

