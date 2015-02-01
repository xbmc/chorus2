@Kodi.module "MovieApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    ## The Movie page.
    initialize: (options) ->
      id = parseInt options.id
      movie = App.request "movie:entity", id
      ## Fetch the movie
      App.execute "when:entity:fetched", movie, =>
        ## Set background image.
        App.execute "images:fanart:set", movie.get('fanart')
        ## Get the layout.
        @layout = @getLayoutView movie
        ## Ensure background removed when we leave.
        @listenTo @layout, "destroy", =>
          App.execute "images:fanart:set", ''
        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getDetailsLayoutView movie
        ## Add the layout to content.
        App.regionContent.show @layout

    ## Get the base layout
    getLayoutView: (movie) ->
      new Show.PageLayout
        model: movie

    ## Build the details layout.
    getDetailsLayoutView: (movie) ->
      headerLayout = new Show.HeaderLayout model: movie
      @listenTo headerLayout, "show", =>
        teaser = new Show.MovieTeaser model: movie
        detail = new Show.Details model: movie
        headerLayout.regionSide.show teaser
        headerLayout.regionMeta.show detail
      @layout.regionHeader.show headerLayout

