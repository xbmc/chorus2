@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->


  ## Playlist requires some player functionality but is also its
  ## own thing so it extends the player.
  class Api.PlayList extends Api.Player

    ## Play an item. If currently playing, insert it next, else clear playlist and add.
    play: (models) ->
      ## TODO: this doesnt work if playing...
#      stateObj = App.request "state:local"
#      if stateObj.isPlaying()
#        @insertAndPlay models, (stateObj.getPlaying('position') + 1)
#      else
      @clear =>
        @insertAndPlay models, 0

    ## Add a item to the end of the playlist
    add: (models) ->
      @playlistSize (size) =>
        @insert models, size

    ## Remove an item from the list
    remove: (position, callback) ->
      @getItems (collection) =>
        raw = collection.getRawCollection()
        ret = []
        for pos, item of raw
          if pos isnt position
            ret.push item
        @clear =>
          collection = @addItems ret
          @doCallback callback, collection

    ## Clear a playlist.
    clear: (callback) ->
      collection = App.execute "localplayer:clear:entities"
      @refreshPlaylistView()
      @doCallback callback, collection

    ## Insert a song at a position models can be a sing model or an array. Expects raw json (not collection)
    insert: (models, position = 0, callback) ->
      @getItems (collection) =>
        raw = collection.getRawCollection()
        if raw.length is 0
          ret = _.flatten( [models] )
        else
          ret = []
          for pos, item of raw
            if pos is position
              for model in _.flatten( [models] )
                ret.push model
            ret.push item
        @clear =>
          collection = @addItems ret
          @doCallback callback, collection

    ## Add items to the end of a list
    addItems: (items) ->
      App.request "localplayer:item:add:entities", items
      @refreshPlaylistView()

    ## Get items in a playlist
    getItems: (callback) ->
      collection = App.request "localplayer:get:entities"
      @doCallback callback, collection

    ## Insert a song at a position and play it
    insertAndPlay: (models, position = 0, callback) ->
      @insert models, position, (resp) =>
        @playEntity 'position', parseInt(position), {}, =>
          @doCallback callback, position

    ## Get the size of the current playlist
    playlistSize: (callback) ->
      @getItems (resp) =>
        @doCallback callback, resp.items.length

    ## Refresh playlist
    refreshPlaylistView: ->
      App.execute "playlist:refresh", 'local', 'audio'