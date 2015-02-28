@Kodi.module "AlbumApp.Landing", (Landing, App, Backbone, Marionette, $, _) ->

  class Landing.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "album-landing landing-page"

  class Landing.Page extends App.Views.LayoutView
    template: 'apps/album/landing/landing'
    className: "album-recent"
    regions:
      regionRecentlyAdded: '.region-recently-added'
      regionRecentlyPlayed: '.region-recently-played'
