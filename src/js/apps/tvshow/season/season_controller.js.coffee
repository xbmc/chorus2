@Kodi.module "TVShowApp.Season", (Season, App, Backbone, Marionette, $, _) ->

  API =

    getSeasonList: (collection) ->
      view = new Season.Seasons
        collection: collection
      view

    bindTriggers: (view) ->
      App.listenTo view, 'season:play', (view) ->
        App.execute 'tvshow:action', 'play', view
      App.listenTo view, 'season:add', (view) ->
        App.execute 'tvshow:action', 'add', view
      App.listenTo view, 'toggle:watched', (view) ->
        App.execute 'tvshow:action:watched', view.view, view.view, true

    mergeSeasonDetails: (tvshow, season, seasons) ->
      mergeAttributes = ['season', 'thumbnail', 'episode', 'unwatched', 'playcount', 'progress', 'watchedepisodes']
      attributes = {seasons: seasons, type: 'season'}
      for prop in mergeAttributes
        attributes[prop] = season.get(prop)
      tvshow.set(attributes)
      tvshow


  ## Main controller
  class Season.Controller extends App.Controllers.Base

    ## The TVShow page.
    initialize: (options) ->
      id = parseInt options.id
      seasonId = parseInt options.season

      ## Fetch the tvshow
      tvshow = App.request "tvshow:entity", id
      App.execute "when:entity:fetched", tvshow, =>

        ## Fetch the seasons
        seasons = App.request "season:entities", tvshow.get('id')
        App.execute "when:entity:fetched", seasons, =>
          ## Merge current season
          season = seasons.findWhere({season: seasonId})
          tvshow = API.mergeSeasonDetails tvshow, season, seasons

          ## Get the layout.
          @layout = @getLayoutView tvshow

          ## Listen to the show of our layout.
          @listenTo @layout, "show", =>
            @getDetailsLayoutView tvshow
            @getEpisodes tvshow, seasonId

          ## Add the layout to content.
          App.regionContent.show @layout

    getLayoutView: (tvshow) ->
      new Season.PageLayout
        model: tvshow

    ## Build the details layout.
    getDetailsLayoutView: (tvshow) ->
        headerLayout = new Season.HeaderLayout model: tvshow
        @listenTo headerLayout, "show", =>
          teaser = new Season.SeasonDetailTeaser model: tvshow
          detail = new Season.Details model: tvshow
          API.bindTriggers detail
          headerLayout.regionSide.show teaser
          headerLayout.regionMeta.show detail
        @layout.regionHeader.show headerLayout

    ## Get the episodes
    getEpisodes: (tvshow, seasonId) ->
      collection = App.request "episode:entities", tvshow.get('tvshowid'), seasonId
      App.execute "when:entity:fetched", collection, =>
        collection.sortCollection('episode', 'asc')
        view = App.request "episode:list:view", collection
        @layout.regionContent.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "season:list:view", (collection) ->
    API.getSeasonList collection