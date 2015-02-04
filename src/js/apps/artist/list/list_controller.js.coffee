@Kodi.module "ArtistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "artist:entities"
      App.execute "when:entity:fetched", collection, =>

        ## Set available filters
        collection.availableFilters = @getAvailableFilters()
        collection.sectionId = 1

        @layout = @getLayoutView collection

        @listenTo @layout, "show", =>
          @renderList collection
          @getFiltersView collection

        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.ListLayout
        collection: collection

    getArtistsView: (collection) ->
      new List.Artists
        collection: collection


    ## Available sort and filter options
    ## See filter_app.js for available options
    getAvailableFilters: ->
      sort: ['artist']
      filter: ['mood', 'genre', 'style']

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
      view = @getArtistsView filteredCollection
      @layout.regionContent.show view
