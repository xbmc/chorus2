@Kodi.module "MovieApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "movie-list"

  class List.MovieTeaser extends App.Views.CardView
    triggers:
      "click .menu" : "movie-menu:clicked"

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "movie-empty-result"

  class List.Movies extends App.Views.CollectionView
    childView: List.MovieTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"