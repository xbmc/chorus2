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
        ## Set the initial active playlist
        App.vent.on "state:initialized", =>
          stateObj = App.request "state:current"
          @changePlaylist(stateObj.getState('player'), stateObj.getState('media'))

      @listenTo @layout, 'playlist:kodi:audio', =>
        @changePlaylist('kodi', 'audio')
      @listenTo @layout, 'playlist:kodi:video', =>
        @changePlaylist('kodi', 'video')

      ## Render the layout
      App.regionPlaylist.show @layout


    getLayout: ->
      new List.Layout()

    getList: (collection) ->
      new List.Items
        collection: collection

    renderList: (type, media) ->
      ## Get the collection and controller for this list
      collection = App.request "playlist:list", type, media
      @layout.$el.removeClassStartsWith('media-').addClass('media-' + media)
      ## When fetched.
      App.execute "when:entity:fetched", collection, =>
        ## render to layout.
        listView = @getList collection
        if type is 'kodi'
          @layout.kodiPlayList.show listView
        else
          @layout.localPlayList.show listView
        ## Bind actions
        @bindActions listView, type, media
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

    changePlaylist: (player, media) ->
      @renderList(player, media)