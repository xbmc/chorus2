@Kodi.module "localPlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      id = options.id

      ## If id is 0 we have no playlists saved.

      playlists = App.request "localplaylist:entities"
#      App.execute "when:entity:fetched", collection, =>
#
#        ## Set available filters
#        collection.availableFilters = @getAvailableFilters()
#        collection.sectionId = 1

      @layout = @getLayoutView playlists

      @listenTo @layout, "show", =>
        @getListsView(playlists)
        @getItems(id)
#          @getFiltersView collection

      App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.ListLayout
        collection: collection

    getListsView: (playlists) ->
      view = new List.Lists
        collection: playlists
      @layout.regionSidebarFirst.show view

    getItems: (id) ->
      playlist = App.request "localplaylist:entity", id
      ## media = playlist.get('media')
      media = 'song'
      collection = App.request "localplaylist:item:entities", id
      view = App.request "#{media}:list:view", collection
      @layout.regionContent.show view