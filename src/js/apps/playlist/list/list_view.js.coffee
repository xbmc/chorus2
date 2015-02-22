@Kodi.module "PlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.LayoutView
    template: "apps/playlist/list/playlist_bar"
    tagName: "div"
    className: "playlist-bar"
    regions:
      kodiPlayList: '.kodi-playlist'
      localPlayList: '.local-playlist'
    triggers:
      'click .kodi-playlists .media-toggle .video'  :  'playlist:kodi:video'
      'click .kodi-playlists .media-toggle .audio'  :  'playlist:kodi:audio'
      'click .player-toggle .kodi'                  :  'playlist:kodi'
      'click .player-toggle .local'                 :  'playlist:local'
      'click .clear-playlist'                       :  'playlist:clear'
      'click .refresh-playlist'                     :  'playlist:refresh'
      'click .party-mode'                           :  'playlist:party'
      'click .save-playlist'                        :  'playlist:save'
    events:
      'click .playlist-menu a': 'menuClick'
    menuClick: (e) ->
      e.preventDefault()

  class List.Item extends App.Views.ItemView
    template: "apps/playlist/list/playlist_item"
    tagName: "li"
    initialize: ->
      subtitle = ''
      switch @model.get('type')
        when 'song'
          subtitle = if @model.get('artist') then @model.get('artist').join(', ') else ''
        else
          subtitle = ''
      @model.set({subtitle: subtitle});
    triggers:
      "click .remove" : "playlist:item:remove"
      "click .play" : "playlist:item:play"
    attributes: ->
      {
        class: 'item pos-' + @model.get('position')
        'data-type': @model.get('type')
        'data-id': @model.get('id')
      }

  class List.Items extends App.Views.CollectionView
    childView: List.Item
    tagName: "ul"
    className: "playlist-items"




