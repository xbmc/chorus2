@Kodi.module "ArtistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      artists = App.request "artist:entities"

      App.execute "when:entity:fetched", artists, =>

        @layout = @getLayoutView artists

        @listenTo @layout, "show", =>
          @artistsRegion artists

        App.regionContent.show @layout

    getLayoutView: (artists) ->
      new List.ListLayout
        collection: artists

    artistsRegion: (artists) ->
      artistsView = @getArtistsView artists
      @layout.regionContent.show artistsView

    getArtistsView: (artists) ->
      new List.Artists
        collection: artists
