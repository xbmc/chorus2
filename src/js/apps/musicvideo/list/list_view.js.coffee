@Kodi.module "MusicVideoApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "musicvideo-list with-filters"

  class List.Teaser extends App.Views.CardView
    triggers:
      "click .play"           : "musicvideo:play"
      "click .add"            : "musicvideo:add"
      'click .stream'         : 'musicvideo:localplay'
      'click .download'       : 'musicvideo:download'
      'click .edit'           : 'musicvideo:edit'
      'click .refresh'        : 'musicvideo:refresh'
    initialize: ->
      super
      if @model?
        @setMeta()
        @model.set(App.request('musicvideo:action:items'))
    setMeta: ->
      if @model
        artist = if @model.get('artist') != '' then @model.get('artist') else '&nbsp;'
        artistLink = @themeLink artist, 'search/artist/' + artist
        @model.set subtitle: artistLink

  class List.Empty extends App.Views.EmptyViewResults
    tagName: "li"
    className: "musicvideo-empty-result"

  class List.Videos extends App.Views.VirtualListView
    childView: List.Teaser
    emptyView: List.Empty
    tagName: "ul"
    className: "card-grid--musicvideo"
