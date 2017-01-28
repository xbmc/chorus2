@Kodi.module "StateApp", (StateApp, App, Backbone, Marionette, $, _) ->


  API =

    setState: (player = 'kodi') ->
      @setBodyClasses player
      @setPlayingContent player
      @setPlayerPlaying player
      @setAppProperties player
      @setTitle player

    playerClass: (className, player) ->
      player + '-' + className

    ## Set app level body state classes
    setBodyClasses: (player) ->
      stateObj = App.request "state:" + player
      $body = App.getRegion('root').$el
      ## Remove All
      $body.removeClassStartsWith(player + '-');
      ## Add based on state properties
      newClasses = []
      newClasses.push ( 'shuffled-' + (if stateObj.getState('shuffled') then 'on' else 'off')  )
      newClasses.push ( 'partymode-' + (if stateObj.getPlaying('partymode') then 'on' else 'off')  )
      newClasses.push ( 'mute-' + (if stateObj.getState('muted') then 'on' else 'off')  )
      newClasses.push ( 'repeat-' + stateObj.getState('repeat') )
      newClasses.push ( 'media-' + stateObj.getState('media') )
      if stateObj.isPlaying()
        newClasses.push ( stateObj.getPlaying('playState') )
      else
        newClasses.push ('not-playing')
      for c in newClasses
        $body.addClass @playerClass(c, player)

    ## Set playing rows in content.
    setPlayingContent: (player) ->
      stateObj = App.request "state:" + player
      $playlistCtx = $('.media-' + stateObj.getState('media') + ' .' + player + '-playlist')
      $('.can-play').removeClassStartsWith(player + '-row-')
      $('.item', $playlistCtx).removeClassStartsWith('row-')
      if stateObj.isPlaying()
        item = stateObj.getPlaying('item')
        playState = stateObj.getPlaying('playState')
        ## library item
        className = '.item-' + item.uid
        $(className).addClass( @playerClass('row-' + playState, player) )
        ## playlist item
        $plItem = $('.pos-' + stateObj.getPlaying('position'), $playlistCtx).addClass( 'row-' + playState )
        ## force playing item thumb and title @see http://forum.kodi.tv/showthread.php?tid=300522
        if $plItem.data('type') is 'file'
          $('.thumb', $plItem).css "background-image", "url('" + item.thumbnail + "')"
          $('.title', $plItem).html helpers.entities.playingLink(item)
        App.vent.trigger "state:" + player + ":playing:updated", stateObj

    ## Set the now playing info in the player
    setPlayerPlaying: (player) ->
      stateObj = App.request "state:" + player
      $playerCtx = $('#player-' + player)
      $title = $('.playing-title', $playerCtx)
      $subtitle = $('.playing-subtitle', $playerCtx)
      $dur = $('.playing-time-duration', $playerCtx)
      $img = $('.playing-thumb', $playerCtx)
      if stateObj.isPlaying()
        item = stateObj.getPlaying('item')
        $title.html helpers.entities.playingLink(item)
        $subtitle.html helpers.entities.getSubtitle(item)
        $dur.html helpers.global.formatTime(stateObj.getPlaying('totaltime'))
        $img.css "background-image", "url('" + item.thumbnail + "')"
      else
        $title.html t.gettext('Nothing playing')
        $subtitle.html ''
        $dur.html '0'
        $img.attr 'src', App.request("images:path:get")


    setAppProperties: (player) ->
      stateObj = App.request "state:" + player
      $playerCtx = $('#player-' + player)
      $('.volume', $playerCtx).val stateObj.getState('volume')

    setTitle: (player) ->
      if player is 'kodi'
        stateObj = App.request "state:" + player
        if stateObj.isPlaying() and stateObj.getPlaying('playState') is 'playing'
          helpers.global.appTitle stateObj.getPlaying('item')
        else
          helpers.global.appTitle()

    ## Kick off all things kodi statewise
    initKodiState: ->

      ## Set initial state
      App.kodiState = new StateApp.Kodi.State()
      App.localState = new StateApp.Local.State()

      ## Set the initial active player
      App.kodiState.setPlayer config.get('state', 'lastplayer', 'kodi')

      ## Load up the Kodi state
      App.kodiState.getCurrentState (state) ->
        API.setState 'kodi'

        ## Attach sockets and polling (if req).
        App.kodiSockets = new StateApp.Kodi.Notifications()
        App.kodiPolling =  new StateApp.Kodi.Polling()

        ## Sockets unavailable, start polling.
        App.vent.on "sockets:unavailable", ->
          App.kodiPolling.startPolling()

        ## Playlist is available, set its state
        App.vent.on "playlist:rendered", ->
          App.request "playlist:refresh", App.kodiState.getState('player'), App.kodiState.getState('media')

        ## Some new content has been rendered with a potential to be playing
        App.vent.on "state:content:updated", ->
          API.setPlayingContent 'kodi'
          API.setPlayingContent 'local'

        ## Some kodi data has changed or needs updating.
        App.vent.on "state:kodi:changed", (state) ->
          API.setState 'kodi'

        ## Some local data has changed or needs updating.
        App.vent.on "state:local:changed", (state) ->
          API.setState 'local'

        ## Player data requires updating
        App.vent.on "state:player:updated", (player) ->
          API.setPlayerPlaying player

        App.vent.trigger "state:initialized"


      ## Everything should use the state object.
      App.reqres.setHandler "state:kodi", ->
        App.kodiState
      App.reqres.setHandler "state:local", ->
        App.localState

      ## Everything should use the state object.
      App.reqres.setHandler "state:current", ->
        stateObj = if App.kodiState.getPlayer() is 'kodi' then App.kodiState else App.localState
        stateObj

      # Reconnect websockets.
      App.commands.setHandler 'state:ws:init', () ->
        App.kodiSockets = new StateApp.Kodi.Notifications()

      ## Let things know the state object is now available
      App.vent.trigger "state:changed"



  ## Startup tasks.
  App.addInitializer ->
    ## Kodi state.
    API.initKodiState()
