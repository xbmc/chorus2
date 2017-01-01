@Kodi.module "ArtistApp.Show", (Show, App, Backbone, Marionette, $, _) ->


  API =

    bindTriggers: (view) ->
      App.listenTo view, 'artist:play', (item) ->
        App.execute 'artist:action', 'play', item
      App.listenTo view, 'artist:add', (item) ->
        App.execute 'artist:action', 'add', item
      App.listenTo view, 'artist:localadd', (item) ->
        App.execute 'artist:action', 'localadd', item
      App.listenTo view, 'artist:localplay', (item) ->
        App.execute 'artist:action', 'localplay', item
      App.listenTo view, 'artist:edit', (item) ->
        App.execute 'artist:edit', item.model

  class Show.Controller extends App.Controllers.Base

    ## The Artist page.
    initialize: (options) ->
      id = parseInt options.id
      artist = App.request "artist:entity", id

      ## Fetch the artist
      App.execute "when:entity:fetched", artist, =>
        ## Get the layout.
        @layout = @getLayoutView artist
        ## Ensure background removed when we leave.
        @listenTo @layout, "destroy", =>
          App.execute "images:fanart:set", 'none'
        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getMusic id
          @getDetailsLayoutView artist
        ## Add the layout to content.
        App.regionContent.show @layout

    ## Get the base layout
    getLayoutView: (artist) ->
      new Show.PageLayout
        model: artist

    ## Build the details layout.
    getDetailsLayoutView: (artist) ->
      headerLayout = new Show.HeaderLayout model: artist
      @listenTo headerLayout, "show", =>
        teaser = new Show.ArtistTeaser model: artist
        API.bindTriggers teaser
        detail = new Show.Details model: artist
        @listenTo detail, "show", =>
          API.bindTriggers detail
        headerLayout.regionSide.show teaser
        headerLayout.regionMeta.show detail
      @layout.regionHeader.show headerLayout

    ## Get a list of all the music for this artist parsed into albums.
    getMusic: (id) ->
      # Might take a while so show loader
      loading = App.request "loading:get:view", tr('Loading albums')
      @layout.regionContent.show loading
      # Set artist id for fetch
      options =
        filter: {artistid: id}
      # Get all the songs and parse them into separate album collections.
      songs = App.request "song:entities", options
      App.execute "when:entity:fetched", songs, =>
        songsCollections = App.request "song:albumparse:entities", songs
        albumsCollection = App.request "albums:withsongs:view", songsCollections
        @layout.regionContent.show albumsCollection

