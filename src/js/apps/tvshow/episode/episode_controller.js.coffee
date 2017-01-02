@Kodi.module "TVShowApp.Episode", (Episode, App, Backbone, Marionette, $, _) ->

  API =

    ## Includes triggers for lists.
    getEpisodeList: (collection) ->
      view = new Episode.Episodes
        collection: collection
      App.listenTo view, 'childview:episode:play', (parent, viewItem) ->
        App.execute 'episode:action', 'play', viewItem
      App.listenTo view, 'childview:episode:add', (parent, viewItem) ->
        App.execute 'episode:action', 'add', viewItem
      App.listenTo view, 'childview:episode:localplay', (parent, viewItem) ->
        App.execute 'episode:action', 'localplay', viewItem
      App.listenTo view, 'childview:episode:download', (parent, viewItem) ->
        App.execute 'episode:action', 'download', viewItem
      App.listenTo view, 'childview:episode:watched', (parent, viewItem) ->
        App.execute 'episode:action:watched', parent, viewItem
      App.listenTo view, 'childview:episode:goto:season', (parent, viewItem) ->
        App.execute 'episode:action', 'gotoSeason', viewItem
      App.listenTo view, 'childview:episode:edit', (parent, viewItem) ->
        App.execute 'episode:edit', viewItem.model
      view

    ## triggers for full view.
    bindTriggers: (view) ->
      App.listenTo view, 'episode:play', (viewItem) ->
        App.execute 'episode:action', 'play', viewItem
      App.listenTo view, 'episode:add', (viewItem) ->
        App.execute 'episode:action', 'add', viewItem
      App.listenTo view, 'episode:localplay', (viewItem) ->
        App.execute 'episode:action', 'localplay', viewItem
      App.listenTo view, 'episode:download', (viewItem) ->
        App.execute 'episode:action', 'download', viewItem
      App.listenTo view, 'toggle:watched', (viewItem) ->
        App.execute 'episode:action:watched', viewItem.view, viewItem.view
      App.listenTo view, 'episode:edit', (viewItem) ->
        App.execute 'episode:edit', viewItem.model


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
        ## Get the layout.
        @layout = @getLayoutView episode

        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getDetailsLayoutView episode
          @getContentView episode

        ## Add the layout to content.
        App.regionContent.show @layout

    getLayoutView: (episode) ->
      new Episode.PageLayout
        model: episode

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
      @contentLayout = new Episode.Content model: episode
      App.listenTo @contentLayout, 'show', =>
        if episode.get('cast').length > 0
          @contentLayout.regionCast.show @getCast(episode)
        @getSeason episode
      @layout.regionContent.show @contentLayout

    getCast: (episode) ->
      App.request 'cast:list:view', episode.get('cast'), 'tvshows'

    getSeason: (episode) ->
      collection = App.request "episode:tvshow:entities", episode.get('tvshowid'), episode.get('season')
      App.execute "when:entity:fetched", collection, =>
        collection.sortCollection('episode', 'asc')
        view = App.request "episode:list:view", collection
        @contentLayout.regionSeason.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "episode:list:view", (collection) ->
    API.getEpisodeList collection