@Kodi.module "SongApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    ## Render the song view and attach to triggers
    getSongsView: (songs) ->
      @songsView = new List.Songs
        collection: songs

      ## Trigers/Actions on a song
      App.listenTo @songsView, 'childview:song:play', (list, item) =>
        @playSong item.model.get('songid')

      App.listenTo @songsView, 'childview:song:add', (list, item) =>
        @addSong item.model.get('songid')

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



  ## handler for other modules to get a songs view.
  App.reqres.setHandler "song:list:view", (songs) ->
    API.getSongsView songs