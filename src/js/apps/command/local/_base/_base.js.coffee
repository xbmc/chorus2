@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->

  class Api.Base extends Marionette.Object

    localLoad: (model, callback) ->

      ## Local state obj
      stateObj = App.request "state:local"

      ## If no valid model passed tell the UI we have stopped
      if not model?
        stateObj.setPlaying 'playing', false
        @localStateUpdate()
        return

      ## Unique browser playback id
      stateObj.setState 'currentPlaybackId', 'browser-' + model.get('id')

      ## Get the download path for the file.
      files = App.request "command:kodi:controller", 'video', 'Files'
      files.downloadPath model.get('file'), (path) =>

        ## Clone soundmanager
        sm = soundManager;

        ## Stop anything currently playing
        @localStop()

        ## Create a sm object and load it into the state
        stateObj.setState 'localPlay', sm.createSound
          id: stateObj.getState('currentPlaybackId')
          url: path
          autoplay: false
          autoLoad: true
          stream: true
          onerror: ->
            console.log 'SM ERROR!'
          onplay: =>
            stateObj.setPlayer 'local'
            stateObj.setPlaying 'playing', true
            stateObj.setPlaying 'paused', false
            stateObj.setPlaying 'playState', 'playing'
            stateObj.setPlaying 'position', model.get('position')
            stateObj.setPlaying 'itemChanged', true
            stateObj.setPlaying 'item', model.attributes
            stateObj.setPlaying 'totaltime', helpers.global.secToTime( model.get('duration') )
            ## Set volume
            ## Trigger listeners
            @localStateUpdate()
          onstop: =>
            stateObj.setPlaying 'playing', false
            ## trigger listeners (remove classes, etc)
            @localStateUpdate()
          onpause: =>
            stateObj.setPlaying 'paused', true
            stateObj.setPlaying 'playState', 'paused'
            ## trigger listenters
            @localStateUpdate()
          onresume: =>
            stateObj.setPlaying 'paused', false
            stateObj.setPlaying 'playState', 'playing'
            ## trigger listenters
            @localStateUpdate()
          onfinish: =>
            @localFinished()
          whileplaying: ->
            pos = parseInt(@position) / 1000
            dur = parseInt( model.get('duration') ) ## @duration is also available (represents loaded not total)
            percentage = Math.round((pos / dur) * 100)
            stateObj.setPlaying 'time', helpers.global.secToTime(pos)
            stateObj.setPlaying 'percentage', percentage
            App.execute 'player:local:progress:update', percentage, helpers.global.secToTime(pos)

        ## stuff after load
        @doCallback callback


    ## What to do when finished.
    localFinished: ->
      @localGoTo('next')

    ## Wrapper for playing current item.
    localPlay: ->
      @localCommand 'play'

    ## Wrapper for stopping current item.
    localStop: ->
      @localCommand 'stop'

    ## Wrapper for pausing current item.
    localPause: ->
      @localCommand 'pause'

    localPlayPause: ->
      stateObj = App.request "state:local"
      if stateObj.getPlaying 'paused'
        @localCommand 'play'
      else
        @localCommand 'pause'

    ## Set volume
    localSetVolume: (volume) ->
      @localCommand 'setVolume', volume

    ## Wrapper for calling a command on the current soundmanager sound.
    localCommand: (command, param) ->
      stateObj = App.request "state:local"
      currentItem = stateObj.getState 'localPlay'
      if currentItem isnt false
        currentItem[command](param)
      @localStateUpdate()

    ## Go to next/prev item adhering to repeat and shuffle
    localGoTo: (param) ->
      ## Get current playlist and state
      collection = App.request "localplayer:get:entities"
      stateObj = App.request "state:local"
      currentPos = stateObj.getPlaying 'position'
      posToPlay = false
      ## Need songs to continue.
      if collection.length > 0
        ## Repeat this item
        if stateObj.getState('repeat') is 'one'
          posToPlay = currentPos
        else if stateObj.getState('shuffled') is true
          ## Shuffle
          ## TODO: store what positions have been played so we dont repeat
          posToPlay = helpers.global.getRandomInt 0, collection.length - 1
        else
          ## Next action
          if param is 'next'
            ## repeat all, back to the start
            if currentPos is collection.length - 1 and stateObj.getState('repeat') is 'all'
              posToPlay = 0
            else if currentPos < collection.length
              ## Standard next
              posToPlay = currentPos + 1
          ## Prev action
          if param is 'previous'
            ## repeat all, go to the end
            if currentPos is 0 and stateObj.getState('repeat') is 'all'
              posToPlay = collection.length - 1
            else if currentPos > 0
              ## Standard prev
              posToPlay = currentPos - 1
      ## Check we have a position to play, if so, play it.
      if posToPlay isnt false
        model = collection.findWhere {position: posToPlay}
        @localLoad model, =>
          @localPlay()
          @localStateUpdate()

    ## Seek to a percentage in the song
    localSeek: (percent) ->
      stateObj = App.request "state:local"
      localPlay = stateObj.getState 'localPlay'
      if localPlay isnt false
        newPos = (percent / 100) * localPlay.duration
        sound = soundManager.getSoundById stateObj.getState('currentPlaybackId')
        sound.setPosition newPos

    ## Set repeat state (cycle is available).
    localRepeat: (param) ->
      stateObj = App.request "state:local"
      if param isnt 'cycle'
        stateObj.setState('repeat', param)
      else
        newState = false
        states = ['off', 'all', 'one']
        for i, state of states
          i = parseInt(i)
          if newState isnt false
            continue
          if stateObj.getState('repeat') is state
            if i isnt (states.length - 1)
              key = i + 1
              newState = states[key]
            else
              newState = 'off'
        stateObj.setState('repeat', newState)

    ## Toggle shuffle
    localShuffle: ->
      stateObj = App.request "state:local"
      currentShuffle = stateObj.getState 'shuffled'
      stateObj.setState 'shuffled', !currentShuffle

    ## Triggers when something changes in the player.
    localStateUpdate: ->
      App.vent.trigger "state:local:changed"

    paramObj: (key, val) ->
      helpers.global.paramObj key, val

    doCallback: (callback, response) ->
      if typeof callback is 'function'
        callback response

    onError: (commands, error) ->
      helpers.debug.rpcError commands, error