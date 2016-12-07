@Kodi.module "TVShowApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "tvshow-list with-filters"

  class List.TVShowTeaser extends App.Views.CardView
    triggers:
      "click .play"       : "tvshow:play"
      "click .watched"    : "tvshow:watched"
      "click .add"        : "tvshow:add"
    initialize: ->
      super
      subtitle = ''
      subtitle += ' ' + @model.get('rating')
      @model.set subtitle: subtitle
      @model.set( App.request('tvshow:action:items') )
    attributes: ->
      classes = ['card']
      if helpers.entities.isWatched @model
        classes.push 'is-watched'
      {
      class: classes.join(' ')
      }

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