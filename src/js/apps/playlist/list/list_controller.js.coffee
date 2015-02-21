@Kodi.module "PlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      ## Watch the shell and render when ready.
      App.vent.on "shell:ready", (options) =>

        @getPlaylistBar()


    getPlaylistBar: ->
      @layout = @getLayout()

      @listenTo @layout, "show", =>
        ## Load the kodi audio list
        @renderList('kodi', 'audio')
        @renderList('local', 'audio')
        ## Set the initial active playlist
        App.vent.on "state:initialized", =>
          stateObj = App.request "state:current"
          @changePlaylist(stateObj.getState('player'), stateObj.getState('media'))

      @listenTo @layout, 'playlist:kodi:audio', =>
        @changePlaylist('kodi', 'audio')
      @listenTo @layout, 'playlist:kodi:video', =>
        @changePlaylist('kodi', 'video')
      @listenTo @layout, 'playlist:kodi', =>
        stateObj = App.request "state:current"
        stateObj.setPlayer 'kodi'
        @renderList 'kodi', 'audio'
      @listenTo @layout, 'playlist:local', =>
        stateObj = App.request "state:current"
        stateObj.setPlayer 'local'
        @renderList 'local', 'audio'

      ## Render the layout
      App.regionPlaylist.show @layout


    getLayout: ->
      new List.Layout()

    getList: (collection) ->
      new List.Items
        collection: collection

    renderList: (type, media) ->
      @layout.$el.removeClassStartsWith('media-').addClass('media-' + media)
      if type is 'kodi'
        ## Get the collection and controller for this list
        collection = App.request "playlist:list", type, media
        ## When fetched.
        App.execute "when:entity:fetched", collection, =>
          ## render to layout.
          listView = @getList collection
          App.listenTo listView, "show", =>
            ## Bind actions
            @bindActions listView, type, media
          @layout.kodiPlayList.show listView
          ## Trigger content update
          App.vent.trigger "state:content:updated"
      else
        ## Get the local playlist collection
        collection = App.request "localplayer:get:entities"
        listView = @getList collection
        App.listenTo listView, "show", =>
          ## Bind actions
          @bindActions listView, type, media
        @layout.localPlayList.show listView
        ## Trigger content update
        App.vent.trigger "state:content:updated"

    bindActions: (listView, type, media) ->
      ## Get the controller for this
      playlist = App.request "command:#{type}:controller", media, 'PlayList'
      ## Listen to commands
      @listenTo listView, "childview:playlist:item:remove", (playlistView, item) ->
        playlist.remove item.model.get('position')
      @listenTo listView, "childview:playlist:item:play", (playlistView, item) ->
        playlist.playEntity 'position', parseInt( item.model.get('position') )
      @initSortable type, media

    changePlaylist: (player, media) ->
      @renderList(player, media)

    initSortable: (type, media) ->
      $ctx = $('.' + type + '-playlist');
      playlist = App.request "command:#{type}:controller", media, 'PlayList'
      $('ul.playlist-items', $ctx).sortable({
        onEnd: (e) ->
          playlist.moveItem $(e.item).data('type'), $(e.item).data('id'), e.oldIndex, e.newIndex
      });