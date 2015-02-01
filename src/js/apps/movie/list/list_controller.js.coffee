@Kodi.module "MovieApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      movies = App.request "movie:entities"

      App.execute "when:entity:fetched", movies, =>

        @layout = @getLayoutView movies

        @listenTo @layout, "show", =>
          @moviesRegion movies

        App.regionContent.show @layout

    getLayoutView: (movies) ->
      new List.ListLayout
        collection: movies

    moviesRegion: (movies) ->
      moviesView = @getMoviesView movies
      @layout.regionContent.show moviesView

    getMoviesView: (movies) ->
      new List.Movies
        collection: movies
