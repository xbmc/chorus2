@Kodi.module "TVShowApp.Episode", (Episode, App, Backbone, Marionette, $, _) ->

  API =

    getEpisodeList: (collection) ->
      view = new Episode.Episodes
        collection: collection
      App.listenTo view, 'childview:episode:play', (list, item) ->
        playlist = App.request "command:kodi:controller", 'video', 'PlayList'
        ## playlist.play 'tvshowid', item.model.get('tvshowid')
      view

    bindTriggers: (view) ->
      App.listenTo view, 'episode:play', (viewItem) ->
        App.execute 'episode:action', 'play', viewItem
      App.listenTo view, 'episode:add', (viewItem) ->
        App.execute 'episode:action', 'add', viewItem
      App.listenTo view, 'episode:stream', (viewItem) ->
        App.execute 'episode:action', 'stream', viewItem
      App.listenTo view, 'episode:download', (viewItem) ->
        console.log viewItem
        App.execute 'episode:action', 'download', viewItem

  ## Main controller
  class Episode.Controller extends App.Controllers.Base

    ## The TVShow page.
    initialize: (options) ->
      id = parseInt options.id
      seasonId = parseInt options.season
      episodeId = parseInt options.episodeid

      ## Fetch the tvshow
      episode = App.request "episode:entity", episodeId
      App.execute "when:entity:fetched", episode, =>
        console.log episode
        ## Get the layout.
        @layout = @getLayoutView episode

        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getDetailsLayoutView episode
          @getContentView episode

        ## Add the layout to content.
        App.regionContent.show @layout

    getLayoutView: (tvshow) ->
      new Episode.PageLayout
        tvshow: tvshow


    ## Build the details layout.
    getDetailsLayoutView: (episode) ->
      headerLayout = new Episode.HeaderLayout model: episode
      @listenTo headerLayout, "show", =>
        teaser = new Episode.EpisodeDetailTeaser model: episode
        detail = new Episode.Details model: episode
        API.bindTriggers detail
        headerLayout.regionSide.show teaser
        headerLayout.regionMeta.show detail
      @layout.regionHeader.show headerLayout

    getContentView: (episode) ->
      contentLayout = new Episode.Content model: episode
      @layout.regionContent.show contentLayout

  ## handler for other modules to get a list view.
  App.reqres.setHandler "episode:list:view", (collection) ->
    collection.sortCollection('episode', 'asc')
    API.getEpisodeList collection