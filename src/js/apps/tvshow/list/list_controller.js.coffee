@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      tvshows = App.request "tvshow:entities"

      App.execute "when:entity:fetched", tvshows, =>

        @layout = @getLayoutView tvshows

        @listenTo @layout, "show", =>
          @tvshowsRegion tvshows

        App.regionContent.show @layout

    getLayoutView: (tvshows) ->
      new List.ListLayout
        collection: tvshows

    tvshowsRegion: (tvshows) ->
      tvshowsView = @getTVShowsView tvshows
      @layout.regionContent.show tvshowsView

    getTVShowsView: (tvshows) ->
      new List.TVShows
        collection: tvshows
