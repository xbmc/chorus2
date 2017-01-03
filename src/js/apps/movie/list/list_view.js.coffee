@Kodi.module "MovieApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "movie-list with-filters"

  class List.MovieTeaser extends App.Views.CardView
    triggers:
      "click .play"          : "movie:play"
      "click .watched"       : "movie:watched"
      "click .add"           : "movie:add"
      "click .localplay"     : "movie:localplay"
      "click .download"      : "movie:download"
      "click .edit"          : "movie:edit"
    initialize: ->
      super
      @setMeta()
      if @model?
        @model.set( App.request('movie:action:items') )
    attributes: ->
      @watchedAttributes 'card'
    setMeta: ->
      @model.set
        subtitle: @themeLink @model.get('year'), 'movies?year=' + @model.get('year')

  class List.Empty extends App.Views.EmptyViewResults
    tagName: "li"
    className: "movie-empty-result"

  class List.Movies extends App.Views.VirtualListView
    childView: List.MovieTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"

  class List.MoviesSet extends App.Views.CollectionView
    childView: List.MovieTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--tall"