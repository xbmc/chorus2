@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'childview:album:play', (list, item) ->
        App.execute 'album:action', 'play', item
      App.listenTo view, 'childview:album:add', (list, item) ->
        App.execute 'album:action', 'add', item
      App.listenTo view, 'childview:album:localadd', (list, item) ->
        App.execute 'album:action', 'localadd', item
      App.listenTo view, 'childview:album:localplay', (list, item) ->
        App.execute 'album:action', 'localplay', item

    getAlbumsList: (collection) ->
      view = new List.Albums
        collection: collection
      API.bindTriggers(view)
      view


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "album:entities"
      App.execute "when:entity:fetched", collection, =>

        ## Set available filters
        collection.availableFilters = @getAvailableFilters()
        collection.sectionId = 1

        ## If present set initial filter via url
        App.request 'filter:init', @getAvailableFilters()

        @layout = @getLayoutView collection

        ## Render subviews on show
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
      sort: ['label', 'year', 'rating']
      filter: ['year', 'genre']

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
      view = API.getAlbumsList filteredCollection
      @layout.regionContent.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "album:list:view", (collection) ->
    API.getAlbumsList collection