@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "tvshow-list"

  class List.TVShowTeaser extends App.Views.CardView
    triggers:
      "click .menu" : "tvshow-menu:clicked"
    initialize: ->
      subtitle = ''
      # subtitle += @model.get('year')
      # subtitle += ' ' + @model.get('dateadded')
      subtitle += ' ' + @model.get('rating')
      # artistLink = @linkTo @model.get('artist'), helpers.url.get('artist', @model.get('artistid'))
      @model.set subtitle: subtitle

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "tvshow-empty-result"

  class List.TVShows extends App.Views.CollectionView
    childView: List.TVShowTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"