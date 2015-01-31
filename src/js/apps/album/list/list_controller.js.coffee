@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      albums = App.request "album:entities"

      App.execute "when:entity:fetched", albums, =>

        @layout = @getLayoutView albums

        @listenTo @layout, "show", =>
          @albumsRegion albums

        App.regionContent.show @layout

    getLayoutView: (albums) ->
      new List.ListLayout
        collection: albums

    albumsRegion: (albums) ->
      albumsView = @getAlbumsView albums
      @layout.regionContent.show albumsView

    getAlbumsView: (albums) ->
      new List.Albums
        collection: albums