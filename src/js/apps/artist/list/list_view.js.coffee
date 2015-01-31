@Kodi.module "ArtistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "artist-list"

  class List.ArtistTeaser extends App.Views.CardView
    triggers:
      "click .menu" : "artist-menu:clicked"

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "artist-empty-result"

  class List.Artists extends App.Views.CollectionView
    childView: List.ArtistTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--wide"