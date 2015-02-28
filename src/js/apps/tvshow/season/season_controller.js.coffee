@Kodi.module "TVShowApp.Season", (Season, App, Backbone, Marionette, $, _) ->

  API =

    getSeasonList: (collection) ->
      view = new Season.Seasons
        collection: collection
      App.listenTo view, 'childview:season:play', (list, item) ->
        playlist = App.request "command:kodi:controller", 'video', 'PlayList'
        ## playlist.play 'tvshowid', item.model.get('tvshowid')
      view


  ## Main controller
  class Season.Controller extends App.Controllers.Base

    ## The TVShow page.
    initialize: (options) ->
      id = parseInt options.id
      seasonId = parseInt options.season

      ## Fetch the tvshow
      tvshow = App.request "tvshow:entity", id
      App.execute "when:entity:fetched", tvshow, =>

        ## Get the layout.
        @layout = @getLayoutView tvshow

        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getDetailsLayoutView tvshow, seasonId
          @getEpisodes tvshow, seasonId

        ## Add the layout to content.
        App.regionContent.show @layout

    getLayoutView: (tvshow) ->
      new Season.PageLayout
        tvshow: tvshow

    ## Build the details layout.
    getDetailsLayoutView: (tvshow, seasonId) ->
      ## Fetch the seasons
      seasons = App.request "season:entities", tvshow.get('id')
      App.execute "when:entity:fetched", seasons, =>
        season = seasons.findWhere({season: seasonId})
        tvshow.set({season: seasonId, thumbnail: season.get('thumbnail'), seasons: seasons})
        console.log tvshow
        headerLayout = new Season.HeaderLayout model: tvshow
        @listenTo headerLayout, "show", =>
          teaser = new Season.SeasonDetailTeaser model: tvshow
          detail = new Season.Details model: tvshow
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