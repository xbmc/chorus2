@Kodi.module "ArtistApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'artist-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'artist-details'

  class Show.Details extends App.Views.ItemView
    template: 'apps/artist/show/details_meta'
    triggers:
      "click .play"       : "artist:play"
      "click .add"        : "artist:add"
      "click .localadd"   : "artist:localadd"
      "click .localplay"  : "artist:localplay"
    onRender: ->
      $('.description', @$el).attr('title', tr('Click for more')).on 'click', (e) ->
        $(@).toggleClass('expanded')

  class Show.ArtistTeaser extends App.ArtistApp.List.ArtistTeaser
    tagName: "div"
    className: "card-detail"
