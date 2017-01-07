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

  class Show.Details extends App.Views.DetailsItem
    template: 'apps/album/show/details_meta'
    triggers:
      "click .play"       : "album:play"
      "click .add"        : "album:add"
      "click .localadd"   : "album:localadd"
      "click .localplay"  : "album:localplay"
      "click .edit"       : "album:edit"

  class Show.AlbumTeaser extends App.AlbumApp.List.AlbumTeaser
    tagName: "div"
    initialize: ->
      @setMeta()
      @model.set(App.request('album:action:items'))
    setMeta: ->
      @model.set
        subtitle: @themeLink @model.get('year'), 'music/albums?year=' + @model.get('year')
    attributes: ->
      @watchedAttributes 'card-minimal'

  class Show.AlbumDetailTeaser extends Show.AlbumTeaser
    attributes: ->
      @watchedAttributes 'card-detail'