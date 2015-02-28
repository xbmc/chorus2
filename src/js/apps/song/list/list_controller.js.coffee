@Kodi.module "SongApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    ## Render the song view and attach to triggers
    getSongsView: (songs, verbose = false) ->
      @songsView = new List.Songs
        collection: songs
        verbose: verbose

      ## Trigers/Actions on a song
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
        @musicVideo item.model

      ## Potentially one of the songs could be playing so trigger a content state update
      App.listenTo @songsView, "show", ->
        App.vent.trigger "state:content:updated"

      @songsView

    ## Play a tune
    playSong: (songId) ->
      playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      playlist.play 'songid', songId

    ## Add a song to the list
    addSong: (songId) ->
      playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      playlist.add 'songid', songId

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

    ## Search youtube for a music video
    musicVideo: (model) ->
      query = model.get('label') + ' ' + model.get('artist')
      App.execute "youtube:search:view", query, (view) ->
        $footer = $('<a>', {class: 'btn btn-primary', href: 'https://www.youtube.com/results?search_query=' + query, target: '_blank'})
        $footer.html('More videos')
        App.execute "ui:modal:show", query, view.render().$el, $footer

  ## handler for other modules to get a songs view.
  App.reqres.setHandler "song:list:view", (songs, verbose = false) ->
    API.getSongsView songs, verbose