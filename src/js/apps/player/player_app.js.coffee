@Kodi.module "PlayerApp", (PlayerApp, App, Backbone, Marionette, $, _) ->

  API =

    ## Get the kodi play bar
    getPlayer: (player) ->
      new PlayerApp.Show.Player
        player: player

    ## Send a player command.
    doCommand: (player, command, params, callback) ->
      App.request "command:#{player}:player", command, params, =>
        @pollingUpdate(callback)

    ## Get the Kodi application controller
    getAppController: (player) ->
      App.request "command:#{player}:controller", 'auto', 'Application'

    ## Wrapper for requesting a state update if no sockets
    pollingUpdate: (callback) ->
      stateObj = App.request "state:current"
      if stateObj.getPlayer() is 'kodi'
        if not App.request 'sockets:active'
          App.request 'state:kodi:update', callback
      else
        ## Local player state update.

    ## Listen to the player commands
    initPlayer: (player, playerView) ->
      @initProgress(player)
      @initVolume(player)
      App.vent.trigger "state:player:updated", player
      appController = @getAppController(player)
      App.vent.on "state:initialized", =>
        stateObj = App.request "state:kodi"
        if stateObj.isPlaying()
          @timerStop()
          @timerStart()

      ## Buttons
      App.listenTo playerView, "control:play", =>
        console.log 'playOn', player
        @doCommand player, 'PlayPause', 'toggle'
      App.listenTo playerView, "control:prev", =>
        @doCommand player, 'GoTo', 'previous'
      App.listenTo playerView, "control:next", =>
        @doCommand  player, 'GoTo', 'next'
      App.listenTo playerView, "control:repeat", =>
        @doCommand  player, 'SetRepeat', 'cycle'
      App.listenTo playerView, "control:shuffle", =>
        @doCommand  player, 'SetShuffle', 'toggle'
      App.listenTo playerView, "control:mute", =>
        appController.toggleMute =>
          @pollingUpdate()
      App.listenTo playerView, 'control:menu', ->
        App.execute "ui:playermenu", 'toggle'

      ## Remote toggle
      if player is 'kodi'
        App.listenTo playerView, "remote:toggle", =>
          App.execute "input:remote:toggle"

      $playerCtx = $('#player-' + player)
      $progress = $('.playing-progress', $playerCtx)
      if player is 'kodi'
        ## Kodi Slider Progress change
        $progress.on 'change', ->
          API.timerStop()
          API.doCommand player, 'Seek', Math.round(@vGet()), ->
            API.timerStart()
        $progress.on 'slide', ->
          API.timerStop()
      else
        ## Local slider progress change
        $progress.on 'change', ->
          API.doCommand player, 'Seek', Math.round(@vGet())

      ## Slider volume
      $volume = $('.volume', $playerCtx)
      $volume.on 'change', ->
        appController.setVolume Math.round(@vGet()), ->
          API.pollingUpdate()

    ## Start virtual timer
    timerStart: ->
      App.playingTimerInterval = setTimeout(( =>
        @timerUpdate()
      ), 1000)


    ## Stop virtual timer
    timerStop: ->
      clearTimeout App.playingTimerInterval


    ## Update virual timer.
    timerUpdate: ->
      stateObj = App.request "state:kodi"
      # stop existing timers and restart if playing
      @timerStop()
      # is playing
      if stateObj.isPlaying() and stateObj.getPlaying('time')?
        # parse time
        cur = helpers.global.timeToSec(stateObj.getPlaying('time')) + 1
        dur = helpers.global.timeToSec(stateObj.getPlaying('totaltime'))
        percent = Math.ceil(cur / dur * 100)
        curTimeObj = helpers.global.secToTime(cur)
        # update cache with new time
        stateObj.setPlaying 'time', curTimeObj
        # update ui
        @setProgress 'kodi', percent, curTimeObj
        # Restart timer
        @timerStart()


    ## Set the current player progress.
    setProgress: (player, percent = 0, currentTime) ->
      $playerCtx = $('#player-' + player)
      $cur = $('.playing-time-current', $playerCtx)
      $cur.html helpers.global.formatTime(currentTime)
      $('.playing-progress', $playerCtx).val(percent)


    ## Init progress.
    initProgress: (player, percent = 0) ->
      $playerCtx = $('#player-' + player)
      $('.playing-progress', $playerCtx).noUiSlider({
        start: percent
        connect: 'upper'
        step: 1
        range:
          min: 0
          max: 100
      });

    ## Init Volume.
    initVolume: (player, percent = 50) ->
      $playerCtx = $('#player-' + player)
      $('.volume', $playerCtx).noUiSlider({
        start: percent
        connect: 'upper'
        step: 1
        range:
          min: 0
          max: 100
      });


  ## Kick of the player on shell ready.
  @onStart = (options) ->

    App.vent.on "shell:ready", (options) =>

      ## Kodi player
      App.kodiPlayer = API.getPlayer('kodi')
      App.listenTo App.kodiPlayer, "show", ->
        API.initPlayer 'kodi', App.kodiPlayer
        App.execute "player:kodi:timer", 'start'
      App.regionPlayerKodi.show App.kodiPlayer

      ## Local player
      App.localPlayer = API.getPlayer('local')
      App.listenTo App.localPlayer, "show", ->
        API.initPlayer 'local', App.localPlayer
      App.regionPlayerLocal.show App.localPlayer

    ## Handler for the virtual timer.
    App.commands.setHandler 'player:kodi:timer', (state = 'start') ->
      if state is 'start'
        API.timerStart()
      else if state is 'stop'
        API.timerStop()
      else if state is 'update'
        API.timerUpdate()

    ## Handler for changing the local progress.
    App.commands.setHandler 'player:local:progress:update', (percent, currentTime) ->
      API.setProgress 'local', percent, currentTime
