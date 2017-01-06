@Kodi.module "PlaylistApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Controller extends App.Controllers.Base

    initialize: ->
      ## Watch the shell and render when ready.
      App.vent.on "shell:ready", (options) =>
        @getPlaylistBar()

    playlistController: (player, media) ->
      App.request "command:#{player}:controller", media, 'PlayList'

    playerCommand: (player, command, params = []) ->
      App.request "command:#{player}:player", command, params, ->
        App.request "state:kodi:update"

    stateObj: ->
      App.request "state:current"

    getPlaylistBar: ->
      @layout = @getLayout()

      @listenTo @layout, "show", =>
        ## Load the kodi audio list
        @renderList('kodi', 'audio')
        @renderList('local', 'audio')
        ## Set the initial active playlist
        App.vent.on "state:initialized", =>
          @changePlaylist(@stateObj().getState('player'), @stateObj().getState('media'))

      @listenTo @layout, 'playlist:kodi:audio', =>
        @changePlaylist('kodi', 'audio')
      @listenTo @layout, 'playlist:kodi:video', =>
        @changePlaylist('kodi', 'video')
      @listenTo @layout, 'playlist:kodi', =>
        @stateObj().setPlayer 'kodi'
        @renderList 'kodi', 'audio'
      @listenTo @layout, 'playlist:local', =>
        @stateObj().setPlayer 'local'
        @renderList 'local', 'audio'
      @listenTo @layout, 'playlist:clear', =>
        @playlistController(@stateObj().getPlayer(), @stateObj().getState('media')).clear()
      @listenTo @layout, 'playlist:refresh', =>
        @renderList @stateObj().getPlayer(), @stateObj().getState('media')
        App.execute "notification:show", t.gettext('Playlist refreshed')
      @listenTo @layout, 'playlist:party', =>
        @playerCommand 'kodi', 'SetPartymode', ['toggle']
      @listenTo @layout, 'playlist:save', =>
        App.execute "localplaylist:addentity", 'playlist'

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
            ## Trigger content update
            App.vent.trigger "state:content:updated", type, media
          @layout.kodiPlayList.show listView
      else
        ## Get the local playlist collection
        collection = App.request "localplayer:get:entities"
        listView = @getList collection
        App.listenTo listView, "show", =>
          ## Bind actions
          @bindActions listView, type, media
          ## Trigger content update
          App.vent.trigger "state:content:updated", type, media
        @layout.localPlayList.show listView

    bindActions: (listView, type, media) ->
      ## Get the controller for this
      playlist = @playlistController type, media
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
      playlist = @playlistController type, media
      $('ul.playlist-items', $ctx).sortable({
        filter: '.row-playing,.row-paused'
        onEnd: (e) ->
          playlist.moveItem $(e.item).data('type'), $(e.item).data('id'), e.oldIndex, e.newIndex
      });

    ## If playing item isn't visible already, scroll to it
    focusPlaying: (type, media) ->
      if config.getLocal('playlistFocusPlaying', true)
        $playing = $('.' + type + '-playlist .row-playing')
        if $playing.length > 0
          $playing.get(0).scrollIntoView()
