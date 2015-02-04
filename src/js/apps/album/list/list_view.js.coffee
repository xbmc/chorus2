@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "album-list"

  class List.AlbumTeaser extends App.Views.CardView
    triggers:
      "click .menu" : "album-menu:clicked"
    initialize: ->
      artistLink = @themeLink @model.get('artist'), helpers.url.get('artist', @model.get('artistid'))
      @model.set subtitle: artistLink

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "album-empty-result"

  class List.Albums extends App.Views.CollectionView
    childView: List.AlbumTeaser
    emptyView: List.Empty
    tagName: "ul"
    sort: 'artist'
    className: "card-grid--square"
