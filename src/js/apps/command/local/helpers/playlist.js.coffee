@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->


  ## Playlist requires some player functionality but is also its
  ## own thing so it extends the player.
  class Api.PlayList extends Api.Player

    ## Play an item.
    play: (type, value) ->
      @getSongs type, value, (songs) =>
        @playCollection songs

    ## Queue an item.
    add: (type, value) ->
      @getSongs type, value, (songs) =>
        @addCollection songs

    ## Play a collection of song models.
    playCollection: (models) ->
      if not _.isArray models
        models = models.getRawCollection()
      ## TODO: Add logic for if something is alreadly playing (like kodi controller)
      @clear =>
        @insertAndPlay models, 0

    ## Add a item to the end of the playlist
    addCollection: (models) ->
      @playlistSize (size) =>
        @insert models, size

    ## Remove an item from the list
    remove: (position, callback) ->
      @getItems (collection) =>
        raw = collection.getRawCollection()
        ret = []
        for pos, item of raw
          if parseInt(pos) isnt parseInt(position)
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
          ## Empty list
          ret = _.flatten( [models] )
        else if parseInt(position) >= raw.length
          ## Adding to the end of a list
          ret = raw
          for model in _.flatten( [models] )
            ret.push model
        else
          ## Insert in the middle of a list
          ret = []
          for pos, item of raw
            if parseInt(pos) is parseInt(position)
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

    ## Get the songs in a collection based on type type/value.
    getSongs: (type, value, callback) ->
      ## If a single song.
      if type is 'songid'
        App.request "song:byid:entities", [value], (songs) =>
          @doCallback callback, songs.getRawCollection()
      else
        ## Else it's a filtered collection (artist, album, etc)
        songs = App.request "song:filtered:entities", {filter: helpers.global.paramObj(type, value)}
        App.execute "when:entity:fetched", songs, =>
          @doCallback callback, songs.getRawCollection()

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
        @doCallback callback, resp.length

    ## Refresh playlist
    refreshPlaylistView: ->
      App.execute "playlist:refresh", 'local', 'audio'

    ## Move Item
    moveItem: (media, id, position1, position2, callback) ->
      @getItems (collection) =>
        raw = collection.getRawCollection()
        item = raw[position1]
        @remove position1, =>
          @insert item, position2, =>
            @doCallback callback, position2
