@Kodi.module "TVShowApp.Landing", (Landing, App, Backbone, Marionette, $, _) ->

  class Landing.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "movie-landing landing-page"

  class Landing.Page extends App.Views.LayoutView
    template: 'apps/movie/landing/landing'
    className: "movie-recent"
    regions:
      regionRecentlyAdded: '.region-recently-added'
