@Kodi.module "localPlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      id = options.id
      playlists = App.request "localplaylist:entities"
      @layout = @getLayoutView playlists

      @listenTo @layout, "show", =>
        @getListsView(playlists)
        @getItems(id)

      App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.ListLayout
        collection: collection

    getListsView: (playlists) ->
      @sideLayout = new List.SideLayout()
      view = new List.Lists
        collection: playlists
      App.listenTo @sideLayout, "show", =>
        if playlists.length > 0
          @sideLayout.regionLists.show view
      App.listenTo @sideLayout, 'lists:new', ->
        App.execute "playlistlocal:newlist"
      @layout.regionSidebarFirst.show @sideLayout

    getItems: (id) ->
      playlist = App.request "localplaylist:entity", id
      @itemLayout = new List.Layout
        list: playlist
      App.listenTo @itemLayout, "show", =>
        media = playlist.get('media')
        collection = App.request "localplaylist:item:entities", id
        if collection.length > 0
          view = App.request "#{media}:list:view", collection, true
          @itemLayout.regionListItems.show view
      App.listenTo @itemLayout, 'list:clear', ->
        App.execute "localplaylist:clear:entities", id
        App.execute "playlistlocal:reload", id
      App.listenTo @itemLayout, 'list:delete', ->
        App.execute "localplaylist:clear:entities", id
        App.execute "localplaylist:remove:entity", id
        App.navigate "playlists", {trigger: true}
      @layout.regionContent.show @itemLayout