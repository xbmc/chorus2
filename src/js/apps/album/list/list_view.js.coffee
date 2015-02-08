@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "album-list"

  class List.AlbumTeaser extends App.Views.CardView
    triggers:
      "click .play"               : "album:play"
      "click .dropdown .add"      : "album:add"
      "click .dropdown .localadd" : "album:localadd"

    initialize: ->
      @model.set({actions: {thumbs: 'Thumbs up'}})
      @model.set({menu: {add: 'Add to Kodi playlist', localadd: 'Add to local playlist', divider: '', localplay: 'Play in browser'}})
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
