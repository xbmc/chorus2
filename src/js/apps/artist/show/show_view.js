@Kodi.module "ArtistApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'artist-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'artist-details'

  class Show.Details extends App.Views.DetailsItem
    template: 'apps/artist/show/details_meta'
    triggers:
      "click .play"       : "artist:play"
      "click .add"        : "artist:add"
      "click .localadd"   : "artist:localadd"
      "click .localplay"  : "artist:localplay"
      "click .edit"       : "artist:edit"

  class Show.ArtistTeaser extends App.ArtistApp.List.ArtistTeaser
    tagName: "div"
    initialize: ->
      @model.set(actions: {thumbs: tr('Thumbs up')})
    attributes: ->
      @watchedAttributes 'card-detail'
