@Kodi.module "MovieApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "movie-list with-filters"

  class List.MovieTeaser extends App.Views.CardView
    triggers:
      "click .play"       : "movie:play"
      "click .watched"    : "movie:watched"
      "click .add"        : "movie:add"
      "click .localplay"  : "movie:localplay"
      "click .download"   : "movie:download"
    initialize: ->
      super
      if @model?
        @model.set subtitle: @model.get('year')
        @model.set({actions: {watched: 'Watched', thumbs: 'Thumbs up'}})
        @model.set({menu: {add: 'Add to Kodi playlist', divider: '', download: 'Download', localplay: 'Play in browser'}})

    attributes: ->
      classes = ['card']
      if helpers.entities.isWatched @model
        classes.push 'is-watched'
      {
        class: classes.join(' ')
      }


  class List.Empty extends App.Views.EmptyView
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