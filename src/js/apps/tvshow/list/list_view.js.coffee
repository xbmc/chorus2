@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "tvshow-list"

  class List.TVShowTeaser extends App.Views.CardView
    triggers:
      "click .menu" : "tvshow-menu:clicked"

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "tvshow-empty-result"

  class List.TVShows extends App.Views.CollectionView
    childView: List.TVShowTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"