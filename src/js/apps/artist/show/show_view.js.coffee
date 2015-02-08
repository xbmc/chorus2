@Kodi.module "ArtistApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'artist-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'artist-details'

  class Show.Details extends App.Views.ItemView
    template: 'apps/artist/show/details_meta'

  class Show.ArtistTeaser extends App.ArtistApp.List.ArtistTeaser
    tagName: "div"
    className: "card-detail"
