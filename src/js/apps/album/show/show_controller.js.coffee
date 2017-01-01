@Kodi.module "AlbumApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'album:play', (item) ->
        App.execute 'album:action', 'play', item
      App.listenTo view, 'album:add', (item) ->
        App.execute 'album:action', 'add', item
      App.listenTo view, 'album:localadd', (item) ->
        App.execute 'album:action', 'localadd', item
      App.listenTo view, 'album:localplay', (item) ->
        App.execute 'album:action', 'localplay', item
      App.listenTo view, 'album:edit', (item) ->
        App.execute 'album:edit', item.model

    ## Return a set of albums with songs.
    ## Songs is expected to be an array of song collections
    ## keyed by albumid. The only thing that should be calling this is artists.
    getAlbumsFromSongs: (songs) ->
      albumsCollectionView = new Show.WithSongsCollection()
      ## What happens when we add a child to this mofo
      albumsCollectionView.on "add:child", (albumView) =>
        App.execute "when:entity:fetched", album, =>
          model = albumView.model
          ## Add the teaser.
          teaser = new Show.AlbumTeaser model: model
          API.bindTriggers teaser
          albumView.regionMeta.show teaser
          ## Add the songs.
          songSet = _.findWhere songs, {albumid: model.get('albumid')}
          songView = App.request "song:list:view", songSet.songs
          albumView.regionSongs.show songView
      ## Loop over albums/song collections
      for albumSet in songs
        ## Get the album.
        album = App.request "album:entity", albumSet.albumid, success: (album) ->
          albumsCollectionView.addChild album, Show.WithSongsLayout
      ## Return the collection view
      albumsCollectionView


  ## When viewing a full page we call the controller
  class Show.Controller extends App.Controllers.Base

    ## The Album page.
    initialize: (options) ->
      id = parseInt options.id
      album = App.request "album:entity", id
      ## Fetch the artist
      App.execute "when:entity:fetched", album, =>
        ## Get the layout.
        @layout = @getLayoutView album
        ## Ensure background removed when we leave.
        @listenTo @layout, "destroy", =>
          App.execute "images:fanart:set", 'none'
        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getMusic id
          @getDetailsLayoutView album
        ## Add the layout to content.
        App.regionContent.show @layout

    ## Get the base layout
    getLayoutView: (album) ->
      new Show.PageLayout
        model: album

    ## Build the details layout.
    getDetailsLayoutView: (album) ->
      headerLayout = new Show.HeaderLayout model: album
      @listenTo headerLayout, "show", =>
        teaser = new Show.AlbumDetailTeaser model: album
        API.bindTriggers teaser
        detail = new Show.Details model: album
        @listenTo detail, "show", =>
          API.bindTriggers detail
        headerLayout.regionSide.show teaser
        headerLayout.regionMeta.show detail
      @layout.regionHeader.show headerLayout


    ## Get a list of all the music for this artist parsed into albums.
    getMusic: (id) ->
      options =
        filter: {albumid: id}
      ## Get all the songs and parse them into sepetate album collections.
      songs = App.request "song:entities", options
      App.execute "when:entity:fetched", songs, =>
        albumView = new Show.WithSongsLayout()
        songView = App.request "song:list:view", songs
        @listenTo albumView, "show", =>
          albumView.regionSongs.show songView
        @layout.regionContent.show albumView


  ## Return a set of albums with songs.
  App.reqres.setHandler "albums:withsongs:view", (songs) ->
    API.getAlbumsFromSongs songs

