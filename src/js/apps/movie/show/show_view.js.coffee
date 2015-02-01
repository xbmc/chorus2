@Kodi.module "MovieApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.PageLayout extends App.Views.LayoutWithHeaderView
    className: 'movie-show detail-container'

  class Show.HeaderLayout extends App.Views.LayoutDetailsHeaderView
    className: 'movie-details'

  class Show.Details extends App.Views.ItemView
    template: 'apps/movie/show/details_meta'

  class Show.MovieTeaser extends App.Views.CardView
    tagName: "div"
    className: "card-detail"
    triggers:
      "click .menu" : "movie-menu:clicked"
