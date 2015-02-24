@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    getTVShowsList: (tvshows, set = false) ->
      viewName = if set then 'TVShowsSet' else 'TVShows'
      view = new List[viewName]
        collection: tvshows
      App.listenTo view, 'childview:tvshow:play', (list, item) ->
        playlist = App.request "command:kodi:controller", 'video', 'PlayList'
        playlist.play 'tvshowid', item.model.get('tvshowid')
      view


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "tvshow:entities"

      ## Set available filters
      collection.availableFilters = @getAvailableFilters()
      collection.sectionId = 21

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
      filter: ['year', 'genre', 'unwatched', 'cast']

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
      view = API.getTVShowsList filteredCollection
      @layout.regionContent.show view


  ## handler for other modules to get a list view.
  App.reqres.setHandler "tvshow:list:view", (collection) ->
    API.getTVShowsList collection, true