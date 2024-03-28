@Kodi.module "AlbumApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "album-list with-filters"

  class List.AlbumTeaser extends App.Views.CardView
    triggers:
      "click .play"               : "album:play"
      "click .dropdown .add"      : "album:add"
      "click .dropdown .localadd" : "album:localadd"
      "click .dropdown .localplay" : "album:localplay"
      "click .dropdown .edit"     : "album:edit"
    initialize: ->
      super arguments...
      if @model?
        @setMeta()
        @model.set(App.request('album:action:items'))
    setMeta: ->
      if @model
        @model.set subtitleHtml: @themeLink @model.get('artist'), helpers.url.get('artist', @model.get('artistid'))

  class List.Empty extends App.Views.EmptyViewResults
    tagName: "li"
    className: "album-empty-result"

  class List.Albums extends App.Views.VirtualListView
    childView: List.AlbumTeaser
    emptyView: List.Empty
    tagName: "ul"
    sort: 'artist'
    className: "card-grid--square"
