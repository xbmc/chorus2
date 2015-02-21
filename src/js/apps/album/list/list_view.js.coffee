@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "album-list with-filters"

  class List.AlbumTeaser extends App.Views.CardView
    triggers:
      "click .play"               : "album:play"
      "click .dropdown .add"      : "album:add"
      "click .dropdown .localadd" : "album:localadd"
      "click .dropdown .localplay" : "album:localplay"

    initialize: ->
      super
      @model.set({actions: {thumbs: 'Thumbs up'}})
      artist = if @model.get('artist') != '' then @model.get('artist') else '&nbsp;'
      @model.set({menu: {add: 'Add to Kodi playlist', localadd: 'Add to local playlist', divider: '', localplay: 'Play in browser'}})
      artistLink = @themeLink artist, helpers.url.get('artist', @model.get('artistid'))
      @model.set subtitle: artistLink

  class List.Empty extends App.Views.EmptyView
    tagName: "li"
    className: "album-empty-result"

  class List.Albums extends App.Views.VirtualListView
    childView: List.AlbumTeaser
    emptyView: List.Empty
    tagName: "ul"
    sort: 'artist'
    className: "card-grid--square"

  class List.AlbumsSet extends App.Views.CollectionView
    childView: List.AlbumTeaser
    emptyView: List.Empty
    tagName: "ul"
    sort: 'artist'
    className: "card-grid--square"
