@Kodi.module "PlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.LayoutView
    template: "apps/playlist/list/playlist_bar"
    tagName: "div"
    className: "playlist-bar"
    regions:
      kodiPlayList: '.kodi-playlist'
      localPlayList: '.local-playlist'
    triggers:
      'click .kodi-playlists .media-toggle .video' :  'playlist:kodi:video'
      'click .kodi-playlists .media-toggle .audio' :  'playlist:kodi:audio'

  class List.Item extends App.Views.ItemView
    template: "apps/playlist/list/playlist_item"
    tagName: "li"
    initialize: ->
      subtitle = ''
      switch @model.get('type')
        when 'song'
          subtitle = @model.get('artist').join(', ')
        else
          subtitle = ''
      @model.set({subtitle: subtitle});
    triggers:
      "click .remove" : "playlist:item:remove"
      "click .play" : "playlist:item:play"
    attributes: ->
      {
        class: 'item pos-' + @model.get('position')
      }

  class List.Items extends App.Views.CollectionView
    childView: List.Item
    tagName: "ul"
    className: "playlist-items"




