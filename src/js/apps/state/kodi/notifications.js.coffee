@Kodi.module "StateApp.Kodi", (StateApp, App, Backbone, Marionette, $, _) ->

  ## Deal with notifications from Kodi
  class StateApp.Notifications extends App.StateApp.Base

    wsActive: false
    wsObj: {}

    getConnection: ->
      host = config.getLocal 'socketsHost'
      socketPath = config.getLocal 'jsonRpcEndpoint'
      socketPort = config.getLocal 'socketsPort'
      socketHost = if host is 'auto' then location.hostname else host
      protocol = if helpers.url.isSecureProtocol() then "wss" else "ws"
      "#{protocol}://#{socketHost}:#{socketPort}/#{socketPath}?kodi"

    initialize: ->

      if window.WebSocket

        ws = new WebSocket @getConnection()

        ws.onopen = (e) =>
          ## Do an initial update prior to setting sockets to active
          ## TODO: update state.
          ## Websockets is working!
          helpers.debug.msg "Websockets Active"
          @wsActive = true;
          App.vent.trigger "sockets:available"

        ws.onerror = (resp) =>
          helpers.debug.msg @socketConnectionErrorMsg(), "warning", resp
          @wsActive = false;
          App.vent.trigger "sockets:unavailable"

        ws.onmessage = (resp) =>
          @messageReceived resp

        ws.onclose = (resp) =>
          helpers.debug.msg "Websockets Closed", "warning", resp
          @wsActive = false;

      else
        ## Sockets not available
        msg = "Your browser doesn't support websockets! Get with the times and update your browser."
        helpers.debug.msg t.gettext(msg), "warning", resp
        App.vent.trigger "sockets:unavailable"

      App.reqres.setHandler "sockets:active", =>
        @wsActive

    ## Return the data from a response
    parseResponse: (resp) ->
      jQuery.parseJSON(resp.data)

    ## Deal with a message.
    messageReceived: (resp) ->
      data = @parseResponse resp
      @onMessage data

    socketConnectionErrorMsg: ->
      msg = "Failed to connect to websockets"
      t.gettext msg

    ## Force a state refresh
    refreshStateNow: (callback) ->
      App.vent.trigger "state:kodi:changed", @getCachedState()
      ## Do a full lookup 1s later, calling this immediately returns
      ## old data. TODO: Not robust, fix!
      setTimeout(( =>
        App.request "state:kodi:update", (state) =>
          if callback
            callback state
      ), 1000)

    ## An item in the library has been updated, trigger a model refresh
    onLibraryUpdate: (data) ->
      # This feels like a bug (different structure for audio vs video) and might be fixed one day
      model = if data.params.data.item then data.params.data.item else data.params.data
      ## Trigger a update of model in ui
      model.uid = helpers.entities.createUid model, model.type
      App.vent.trigger 'entity:kodi:update', model.uid
      ## Episode updates might affect parent show and happen in bulk, so we defer a show update after 2 seconds.
      if model.type is 'episode'
        clearTimeout App.episodeRecheckTimeout
        App.episodeRecheckTimeout = setTimeout(() ->
          App.request 'episode:entity', model.id, {success: (epModel) ->
            App.vent.trigger 'entity:kodi:update', 'tvshow-' + epModel.get('tvshowid')
          }
        , 2000)

    ## Deal with message responses.
    onMessage: (data) ->

      # Action based on method
      switch data.method

        # playback started
        when 'Player.OnPlay'
          @setPlaying('paused', false)
          @setPlaying('playState', 'playing')
          App.execute "player:kodi:timer", 'start'
          @refreshStateNow()

        # playback stopped
        when 'Player.OnStop'
          @setPlaying('playing', false)
          App.execute "player:kodi:timer", 'stop'
          @refreshStateNow()

        # e.g. shuffled, repeat, partymode
        when 'Player.OnPropertyChanged'
          @refreshStateNow()

        # playback pause
        when 'Player.OnPause'
          @setPlaying('paused', true)
          @setPlaying('playState', 'paused')
          App.execute "player:kodi:timer", 'stop'
          @refreshStateNow()

        # progress changed
        when 'Player.OnSeek'
          App.execute "player:kodi:timer", 'stop'
          @refreshStateNow ->
            App.execute "player:kodi:timer", 'start'

        # list cleared, add, remove, use a timeout to prevent slowdown on bulk add
        when 'Playlist.OnClear', 'Playlist.OnAdd', 'Playlist.OnRemove'
          clearTimeout App.playlistUpdateTimeout
          App.playlistUpdateTimeout = setTimeout((e) =>
            playerController = App.request "command:kodi:controller", 'auto', 'Player'
            App.execute "playlist:refresh", 'kodi', playerController.playerIdToName(data.params.data.playlistid)
            @refreshStateNow()
          , 500)

        # volume change
        when 'Application.OnVolumeChanged'
          @setState 'volume', data.params.data.volume
          @setState 'muted', data.params.data.muted
          @refreshStateNow()

        # Video Library scan
        when 'VideoLibrary.OnScanStarted'
          App.execute "notification:show", t.gettext("Video library scan started")

        # Video Library scan end
        when 'VideoLibrary.OnScanFinished'
          App.execute "notification:show", t.gettext("Video library scan complete")
          ## Clear video caches
          Backbone.fetchCache.clearItem('MovieCollection');
          Backbone.fetchCache.clearItem('TVShowCollection');

        # Audio Library scan
        when 'AudioLibrary.OnScanStarted'
          App.execute "notification:show", t.gettext("Audio library scan started")

        # Audio Library scan end
        when 'AudioLibrary.OnScanFinished'
          App.execute "notification:show", t.gettext("Audio library scan complete")
          ## Clear audio caches
          Backbone.fetchCache.clearItem('AlbumCollection');
          Backbone.fetchCache.clearItem('ArtistCollection');

        # Audio Library clean start
        when 'AudioLibrary.OnCleanStarted'
          App.execute "notification:show", t.gettext("Audio library clean started")

        # Audio Library clean stop
        when 'AudioLibrary.OnCleanFinished'
          App.execute "notification:show", t.gettext("Audio library clean finished")

        # Video Library clean start
        when 'VideoLibrary.OnCleanStarted'
          App.execute "notification:show", t.gettext("Video library clean started")

        # Video Library clean stop
        when 'VideoLibrary.OnCleanFinished'
          App.execute "notification:show", t.gettext("Video library clean finished")

        # Audio Library update
        when 'AudioLibrary.OnUpdate', 'VideoLibrary.OnUpdate'
          @onLibraryUpdate data

        # input box has opened
        when 'Input.OnInputRequested'
          App.execute "input:textbox", ''
          wait = 60
          # We set a timeout for {wait} seconds for a fallback for no input
          # this is to prevent an open dialog preventing api requests
          # Instead of encouraging entering random shizzle how about it's just cancelled and a message saying why?
          App.inputTimeout = setTimeout((->
            wotd = '<a href="http://goo.gl/PGE7wg" target="_blank">word of the day</a>'
            msg = t.sprintf(tr(
              "%1$d seconds ago, an input dialog opened in Kodi and it is still open! To prevent " +
              "a mainframe implosion, you should probably give me some text. I don't really care what it " +
              "is at this point, why not be creative? Do you have a %2$s? I won't tell..."), wait, wotd
            )
            App.execute "input:textbox", msg
            return
          ), 1000 * wait)

        # input box has closed
        when 'Input.OnInputFinished'
          clearTimeout App.inputTimeout
          App.execute "input:textbox:close"

        # xbmc shutdown
        when 'System.OnQuit'
          App.execute "notification:show", t.gettext("Kodi has quit")

        else
          ## do nothing.
      return
