@Kodi.module "MovieApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    getMoviesView: (collection, set = false) ->
      viewName = if set then 'MoviesSet' else 'Movies'
      view = new List[viewName]
        collection: collection
      API.bindTriggers view
      view

    bindTriggers: (view) ->
      App.listenTo view, 'childview:movie:play', (parent, viewItem) ->
        App.execute 'movie:action', 'play', viewItem
      App.listenTo view, 'childview:movie:add', (parent, viewItem) ->
        App.execute 'movie:action', 'add', viewItem
      App.listenTo view, 'childview:movie:stream', (parent, viewItem) ->
        App.execute 'movie:action', 'stream', viewItem


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "movie:entities"

      App.execute "when:entity:fetched", collection, =>

        ## Set available filters
        collection.availableFilters = @getAvailableFilters()
        collection.sectionId = 11

        ## If present set initial filter via url
        App.request 'filter:init', @getAvailableFilters()

        @layout = @getLayoutView collection

        @listenTo @layout, "show", =>
          @renderList collection
          @getFiltersView collection

        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.ListLayout
        collection: collection

    ## Available sort and filter options
    ## See filter_app.js for available options
    getAvailableFilters: ->
      sort: ['title', 'year', 'dateadded', 'rating']
      filter: ['year', 'genre', 'writer', 'director', 'cast']

    ## Apply filter view and provide a handler for applying changes
    getFiltersView: (collection) ->
      filters = App.request 'filter:show', collection
      @layout.regionSidebarFirst.show filters
      ## Listen to when the filters change and re-render.
      @listenTo filters, "filter:changed", =>
        @renderList collection

    ## Get the list view with filters applied.
    renderList: (collection) ->
      App.execute "loading:show:view", @layout.regionContent
      filteredCollection = App.request 'filter:apply:entites', collection
      view = API.getMoviesView filteredCollection
      @layout.regionContent.show view

  ## handler for other modules to get a list view.
  App.reqres.setHandler "movie:list:view", (collection) ->
    API.getMoviesView collection, true