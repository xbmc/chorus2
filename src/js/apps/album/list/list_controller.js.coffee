@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "album:entities"

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

    getAlbumsView: (collection) ->
      new List.Albums
        collection: collection


    ## Available sort and filter options
    ## See filter_app.js for available options
    getAvailableFilters: ->
      sort: ['album', 'year', 'rating']
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
      view = @getAlbumsView filteredCollection
      @layout.regionContent.show view
