@Kodi.module "ArtistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "artist-list with-filters"

  class List.ArtistTeaser extends App.Views.CardView
    triggers:
      "click .play" : "artist:play"
      "click .dropdown .add" : "artist:add"
    initialize: ->
      super
      if @model?
        @model.set({actions: {thumbs: 'Thumbs up'}})
        @model.set({menu: {add: 'Add to Kodi playlist', savelist: 'Add to local playlist', divider: '', localplay: 'Play in browser'}})

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "artist-empty-result"

  class List.Artists extends App.Views.VirtualListView
    childView: List.ArtistTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--wide"

  class List.ArtistsSet extends App.Views.CollectionView
    childView: List.ArtistTeaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--wide"