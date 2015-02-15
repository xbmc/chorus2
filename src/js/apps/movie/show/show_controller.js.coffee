@Kodi.module "MovieApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'movie:play', (viewItem) ->
        App.execute 'movie:action', 'play', viewItem
      App.listenTo view, 'movie:add', (viewItem) ->
        App.execute 'movie:action', 'add', viewItem
      App.listenTo view, 'movie:stream', (viewItem) ->
        App.execute 'movie:action', 'stream', viewItem
      App.listenTo view, 'movie:download', (viewItem) ->
        console.log viewItem
        App.execute 'movie:action', 'download', viewItem

  class Show.Controller extends App.Controllers.Base

    ## The Movie page.
    initialize: (options) ->
      id = parseInt options.id
      movie = App.request "movie:entity", id
      ## Fetch the movie
      App.execute "when:entity:fetched", movie, =>
        ## Get the layout.
        @layout = @getLayoutView movie
        ## Ensure background removed when we leave.
        @listenTo @layout, "destroy", =>
          App.execute "images:fanart:set", 'none'
        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getDetailsLayoutView movie
          @getContentView movie
        ## Add the layout to content.
        App.regionContent.show @layout

    ## Get the base layout
    getLayoutView: (movie) ->
      new Show.PageLayout
        model: movie

    getContentView: (movie) ->
      contentLayout = new Show.Content model: movie
      @listenTo contentLayout, "movie:youtube", (view) ->
        trailer = movie.get('trailer')
        App.execute "ui:modal:youtube", movie.get('title') + ' Trailer', trailer.id
      @layout.regionContent.show contentLayout


    ## Build the details layout.
    getDetailsLayoutView: (movie) ->
      headerLayout = new Show.HeaderLayout model: movie
      @listenTo headerLayout, "show", =>
        teaser = new Show.MovieTeaser model: movie
        API.bindTriggers teaser
        detail = new Show.Details model: movie
        API.bindTriggers detail
        headerLayout.regionSide.show teaser
        headerLayout.regionMeta.show detail
      @layout.regionHeader.show headerLayout

