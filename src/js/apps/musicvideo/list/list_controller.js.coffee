@Kodi.module "MusicVideoApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'childview:musicvideo:play', (parent, viewItem) ->
        App.execute 'musicvideo:action', 'play', viewItem
      App.listenTo view, 'childview:musicvideo:add', (parent, viewItem) ->
        App.execute 'musicvideo:action', 'add', viewItem
      App.listenTo view, 'childview:musicvideo:localplay', (parent, viewItem) ->
        App.execute 'musicvideo:action', 'localplay', viewItem
      App.listenTo view, 'childview:musicvideo:download', (parent, viewItem) ->
        App.execute 'musicvideo:action', 'download', viewItem
      App.listenTo view, 'childview:musicvideo:edit', (parent, viewItem) ->
        App.execute 'musicvideo:edit', viewItem.model
      view

    getVideoList: (collection) ->
      view = new List.Videos
        collection: collection
      API.bindTriggers(view)
      view


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "musicvideo:entities"
      App.execute "when:entity:fetched", collection, =>

        ## Set available filters
        collection.availableFilters = @getAvailableFilters()

        ## Top level menu path for filters
        collection.sectionId = 'music'

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
      sort: ['label', 'year', 'artist', 'album']
      filter: ['studio', 'director', 'artist', 'album', 'year']

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
      view = API.getVideoList filteredCollection
      @layout.regionContent.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "musicvideo:list:view", (collection) ->
    API.getVideoList collection
