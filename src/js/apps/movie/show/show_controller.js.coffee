@Kodi.module "MovieApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'movie:play', (viewItem) ->
        App.execute 'movie:action', 'play', viewItem
      App.listenTo view, 'movie:add', (viewItem) ->
        App.execute 'movie:action', 'add', viewItem
      App.listenTo view, 'movie:localplay', (viewItem) ->
        App.execute 'movie:action', 'localplay', viewItem
      App.listenTo view, 'movie:download', (viewItem) ->
        App.execute 'movie:action', 'download', viewItem
      App.listenTo view, 'toggle:watched', (viewItem) ->
        App.execute 'movie:action:watched', viewItem.view, viewItem.view
      App.listenTo view, 'movie:refresh', (viewItem) ->
        App.execute 'movie:action', 'refresh', viewItem
      App.listenTo view, 'movie:edit', (viewItem) ->
        App.execute 'movie:edit', viewItem.model

    moreContent: [
      {
        title: 'More from %1$s'
        filter: 'set'
        key: 'set'
        type: 'string'
        pluck: false
      }
      {
        title: 'More %1$s movies'
        filter: 'genre'
        key: 'genre'
        type: 'array'
        pluck: false
      }
      {
        title: 'More movies staring %1$s'
        filter: 'actor'
        key: 'cast'
        type: 'array'
        pluck: 'name'
      }
      {
        title: 'Other movies released in %1$s'
        filter: 'year'
        key: 'year'
        type: 'string'
        pluck: false
      }
    ]

  class Show.Controller extends App.Controllers.Base

    ## The Movie page.
    initialize: (options) ->
      id = parseInt options.id
      movie = App.request "movie:entity", id
      ## Fetch the movie
      App.execute "when:entity:fetched", movie, =>
        ## Get the layout.
        @layout = @getLayoutView movie
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
      @contentLayout = new Show.Content model: movie
      @listenTo @contentLayout, "movie:youtube", (view) ->
        trailer = movie.get('mediaTrailer')
        App.execute "ui:modal:youtube", movie.escape('title') + ' Trailer', trailer.id
      @listenTo @contentLayout, 'show', =>
        if movie.get('cast').length > 0
          @contentLayout.regionCast.show @getCast(movie)
        @getMoreContent movie
      @layout.regionContent.show @contentLayout

    getCast: (movie) ->
      App.request 'cast:list:view', movie.get('cast'), 'movies'


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

    getMoreContent: (movie) ->
      idx = 0
      for i, more of API.moreContent
        # Get the correct value to filter by
        filterVal = false
        if more.type is 'array'
          filterVals = if more.pluck then _.pluck(movie.get(more.key), more.pluck) else movie.get(more.key)
          filterVals = _.shuffle filterVals.slice(0, 4)
          filterVal = _.first filterVals
        else
          filterVal = movie.get(more.key)

        # Built req options
        if filterVal and filterVal isnt ''
          idx++
          opts =
            limit: {start: 0, end: 6}
            cache: false
            sort: {method: 'random', order: 'ascending'}
            filter: {}
            title: t.sprintf(tr(more.title), '<a href="#movies?' + more.key + '=' + filterVal + '">' + filterVal + '</a>')
            idx: idx
          opts.filter[more.filter] = filterVal

          # On get results
          opts.success = (collection) =>
            collection.remove(movie);
            if collection.length > 0
              view = new Show.Set
                set: collection.options.title
              App.listenTo view, "show", =>
                listview = App.request "movie:list:view", collection
                view.regionCollection.show listview
              @contentLayout["regionMore#{collection.options.idx}"].show view

          # Fetch
          App.request "movie:entities", opts
