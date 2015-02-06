@Kodi.module "PlayerApp", (PlayerApp, App, Backbone, Marionette, $, _) ->

  API =

    ## Get the kodi play bar
    getKodiPlayer: ->
      new PlayerApp.Show.Player()

    ## Send a player command.
    doKodiCommand: (command, params, callback) ->
      App.request 'command:kodi:player', command, params, =>
        @pollingUpdate(callback)

    ## Get the Kodi application controller
    getAppController: ->
      App.request "command:kodi:controller", 'auto', 'Application'

    ## Wrapper for requesting a state update if no sockets
    pollingUpdate: (callback) ->
      if not App.request 'sockets:active'
        App.request 'state:kodi:update', callback

    ## Listen to the player commands
    initKodiPlayer: (player) ->
      @initProgress('kodi')
      @initVolume('kodi')
      App.vent.trigger "state:player:updated", 'kodi'
      appController = @getAppController()

      ## Buttons
      App.listenTo player, "control:play", =>
        @doKodiCommand 'PlayPause', 'toggle'
      App.listenTo player, "control:prev", =>
        @doKodiCommand 'GoTo', 'previous'
      App.listenTo player, "control:next", =>
        @doKodiCommand 'GoTo', 'next'
      App.listenTo player, "control:repeat", =>
        @doKodiCommand 'SetRepeat', 'cycle'
      App.listenTo player, "control:shuffle", =>
        console.log 'suff'
        @doKodiCommand 'SetShuffle', 'toggle'
      App.listenTo player, "control:mute", =>
        appController.toggleMute =>
          @pollingUpdate()

      ## Slider Progress
      $playerCtx = $('#player-kodi')
      $progress = $('.playing-progress', $playerCtx)
      $progress.on 'change', ->
        API.timerStop()
        API.doKodiCommand 'Seek', Math.round(@vGet()), ->
          API.timerStart()
      $progress.on 'slide', ->
        API.timerStop()
      ## Slider volume
      $volume = $('.volume', $playerCtx)
      $volume.on 'change', ->
        appController.setVolume Math.round(@vGet())
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
      App.kodiPlayer = API.getKodiPlayer()
      App.listenTo App.kodiPlayer, "show", ->
        API.initKodiPlayer App.kodiPlayer
        App.execute "player:kodi:timer", 'start'
      App.regionPlayerKodi.show App.kodiPlayer

    ## Handler for the virtual timer.
    App.commands.setHandler 'player:kodi:timer', (state = 'start') ->
      if state is 'start'
        API.timerStart()
      else if state is 'stop'
        API.timerStop()
      else if state is 'update'
        API.timerUpdate()