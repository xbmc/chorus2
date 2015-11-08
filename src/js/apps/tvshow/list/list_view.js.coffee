@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "tvshow-list with-filters"

  class List.TVShowTeaser extends App.Views.CardView
    triggers:
      "click .play" : "tvshow:play"
      "click .menu" : "tvshow-menu:clicked"
    initialize: ->
      super
      subtitle = ''
      # subtitle += @model.get('year')
      # subtitle += ' ' + @model.get('dateadded')
      subtitle += ' ' + @model.get('rating')
      # artistLink = @linkTo @model.get('artist'), helpers.url.get('artist', @model.get('artistid'))
      @model.set subtitle: subtitle

  class List.Empty extends App.Views.EmptyViewResults
    tagName: "li"
    className: "tvshow-empty-result"

  class List.TVShows extends App.Views.VirtualListView
    childView: List.TVShowTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"

  class List.TVShowsSet extends App.Views.CollectionView
    childView: List.TVShowTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"