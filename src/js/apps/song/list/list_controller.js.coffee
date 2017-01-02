@Kodi.module "SongApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    ## Render the song view and attach to triggers
    getSongsView: (songs, verbose = false) ->
      @songsView = new List.Songs
        collection: songs
        verbose: verbose

      ## Triggers/Actions on a song
      App.listenTo @songsView, 'childview:song:play', (list, item) =>
        @playSong item.model.get('songid')
      App.listenTo @songsView, 'childview:song:add', (list, item) =>
        @addSong item.model.get('songid')
      App.listenTo @songsView, 'childview:song:localadd', (list, item) =>
        @localAddSong item.model.get('songid')
      App.listenTo @songsView, 'childview:song:localplay', (list, item) =>
        @localPlaySong item.model
      App.listenTo @songsView, 'childview:song:download', (list, item) =>
        @downloadSong item.model
      App.listenTo @songsView, 'childview:song:musicvideo', (list, item) =>
        App.execute "youtube:search:popup", item.model.get('label') + ' ' + item.model.get('artist')
      App.listenTo @songsView, 'childview:song:edit', (parent, item) ->
        App.execute 'song:edit', item.model

      ## Potentially one of the songs could be playing so trigger a content state update
      App.listenTo @songsView, "show", ->
        App.vent.trigger "state:content:updated"

      @songsView

    ## Play a tune
    playSong: (songId) ->
      App.execute "command:audio:play", 'songid', songId

    ## Add a song to the list
    addSong: (songId) ->
      App.execute "command:audio:add", 'songid', songId
      # playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      # playlist.add 'songid', songId

    ## Add the song to a local playlist
    localAddSong: (songId) ->
      App.execute "localplaylist:addentity", 'songid', songId

    ## play the song locally
    localPlaySong: (model) ->
      localPlaylist = App.request "command:local:controller", 'audio', 'PlayList'
      localPlaylist.play model.attributes

    ## Download the song
    downloadSong: (model) ->
      files = App.request "command:kodi:controller", 'video', 'Files'
      files.downloadFile model.get('file')

  ## handler for other modules to get a songs view.
  App.reqres.setHandler "song:list:view", (songs, verbose = false) ->
    API.getSongsView songs, verbose
