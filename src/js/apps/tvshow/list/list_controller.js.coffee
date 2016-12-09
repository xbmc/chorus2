@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    getTVShowsList: (tvshows, set = false) ->
      viewName = if set then 'TVShowsSet' else 'TVShows'
      view = new List[viewName]
        collection: tvshows
      API.bindTriggers view
      view

    bindTriggers: (view) ->
      App.listenTo view, 'childview:tvshow:play', (parent, viewItem) ->
        App.execute 'tvshow:action', 'play', viewItem
      App.listenTo view, 'childview:tvshow:add', (parent, viewItem) ->
        App.execute 'tvshow:action', 'add', viewItem
      App.listenTo view, 'childview:tvshow:watched', (parent, viewItem) ->
        App.execute 'tvshow:action:watched', parent, viewItem
      App.listenTo view, 'childview:tvshow:edit', (parent, viewItem) ->
        App.execute 'tvshow:action', 'edit', viewItem

  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "tvshow:entities"

      ## Set available filters
      collection.availableFilters = @getAvailableFilters()

      ## Top level menu path for filters
      collection.sectionId = 'tvshows/recent'

      ## If present set initial filter via url
      App.request 'filter:init', @getAvailableFilters()

      ## When fetched.
      App.execute "when:entity:fetched", collection, =>

        ## Get and setup the layout
        @layout = @getLayoutView collection
        @listenTo @layout, "show", =>
          @getFiltersView collection
          @renderList collection

        ## Render the layout
        App.regionContent.show @layout

    getLayoutView: (tvshows) ->
      new List.ListLayout
        collection: tvshows


    ## Available sort and filter options
    ## See filter_app.js for available options
    getAvailableFilters: ->
      sort: ['title', 'year', 'dateadded', 'rating']
      filter: ['year', 'genre', 'unwatched', 'cast', 'mpaa', 'studio']

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
      filteredCollection = App.request 'filter:apply:entities', collection
      view = API.getTVShowsList filteredCollection
      @layout.regionContent.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "tvshow:list:view", (collection) ->
    API.getTVShowsList collection, true