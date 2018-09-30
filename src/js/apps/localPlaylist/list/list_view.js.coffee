@Kodi.module "localPlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "local-playlist-list"

  class List.SideLayout extends App.Views.LayoutView
    template: 'apps/localPlaylist/list/playlist_sidebar_layout'
    tagName: 'div'
    className: 'side-inner'
    regions:
      regionLists: '.current-lists'
    triggers:
      'click .new-list' : 'lists:new'

  class List.List extends App.Views.ItemView
    template: 'apps/localPlaylist/list/playlist'
    tagName: "li"
    initialize: ->
      path = helpers.url.get 'playlist', @model.get('id')
      @model.set(title: @model.get('name'), path: path)
      if path is helpers.url.path()
        @model.set(active: true)

  class List.Lists extends App.Views.CompositeView
    template: 'apps/localPlaylist/list/playlist_list'
    childView: List.List
    tagName: "div"
    childViewContainer: 'ul.lists'
    onRender: ->
      $('h3', @$el).text( t.gettext('Playlists') )

  class List.Selection extends App.Views.ItemView
    template: 'apps/localPlaylist/list/playlist'
    tagName: "li"
    initialize: ->
      @model.set(title: @model.get('name'))
    triggers:
      'click .item' : 'item:selected'

  class List.SelectionList extends App.Views.CompositeView
    template: 'apps/localPlaylist/list/playlist_list'
    childView: List.Selection
    tagName: "div"
    className: 'playlist-selection-list'
    childViewContainer: 'ul.lists'
    onRender: ->
      $('h3', @$el).text( t.gettext('Existing playlists') )

  class List.Layout extends App.Views.LayoutView
    template: 'apps/localPlaylist/list/playlist_layout'
    tagName: 'div'
    className: 'local-playlist'
    regions:
      regionListItems: '.item-container'
    triggers:
      'click .local-playlist-header .rename' : 'list:rename'
      'click .local-playlist-header .clear' : 'list:clear'
      'click .local-playlist-header .delete' : 'list:delete'
      'click .local-playlist-header .play' : 'list:play'
      'click .local-playlist-header .localplay' : 'list:localplay'
      'click .local-playlist-header .export' : 'list:export'
    onRender: ->
      if @options and @options.list
        $('h2', @$el).text( @options.list.get('name') )
