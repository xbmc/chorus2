@Kodi.module "ArtistApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'childview:artist:play', (list, item) ->
        App.execute 'artist:action', 'play', item
      App.listenTo view, 'childview:artist:add', (list, item) ->
        App.execute 'artist:action', 'add', item
      App.listenTo view, 'childview:artist:localadd', (list, item) ->
        App.execute 'artist:action', 'localadd', item
      App.listenTo view, 'childview:artist:localplay', (list, item) ->
        App.execute 'artist:action', 'localplay', item

    getArtistList: (collection, set = false) ->
      viewName = if set then 'ArtistsSet' else 'Artists'
      view = new List[viewName]
        collection: collection
      API.bindTriggers view
      view


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "artist:entities"
      App.execute "when:entity:fetched", collection, =>

        ## Set available filters
        collection.availableFilters = @getAvailableFilters()

        ## Top level menu path for filters
        collection.sectionId = 'music'

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
      sort: ['label']
      filter: ['mood', 'genre', 'style', 'thumbsUp']

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
      view = API.getArtistList filteredCollection
      @layout.regionContent.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "artist:list:view", (collection) ->
    API.getArtistList collection, true