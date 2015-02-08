@Kodi.module "AlbumApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  ## Album with songs.

  class Show.WithSongsLayout extends App.Views.LayoutView
    template: 'apps/album/show/album_with_songs'
    className: 'album-wrapper'
    regions:
      regionMeta: '.region-album-meta'
      regionSongs: '.region-album-songs'

  class Show.WithSongsCollection extends App.Views.CollectionView
    childView: Show.WithSongsLayout
    tagName: "div"
    sort: 'year'
    className: "albums-wrapper"

  ## Full page views.

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'album-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'album-details'

  class Show.Details extends App.Views.ItemView
    template: 'apps/album/show/details_meta'

  class Show.AlbumTeaser extends App.AlbumApp.List.AlbumTeaser
    tagName: "div"
    className: "card-minimal"
    initialize: ->
      this.model.set subtitle: this.model.get('year')

  class Show.AlbumDetailTeaser extends Show.AlbumTeaser
    className: "card-detail"