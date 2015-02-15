@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->

  class Api.Base extends Marionette.Object

    localLoad: (model, callback) ->
      stateObj = App.request "state:local"
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
            ## Set volume
            ## Trigger listeners
            @localStateUpdate()
          onstop: =>
            stateObj.setPlaying 'playing', false
            ## trigger listeners (remove classes, etc)
            @localStateUpdate()
          onpause: =>
            stateObj.setPlaying 'paused', true
            stateObj.setPlaying 'playstate', 'paused'
            ## trigger listenters
            @localStateUpdate()
          onresume: =>
            stateObj.setPlaying 'paused', false
            stateObj.setPlaying 'playstate', 'playing'
            ## trigger listenters
            @localStateUpdate()
          onfinish: =>
            @localFinished(model)
          whileplaying: =>
            ## update progress/buffer

        ## stuff after load
        @doCallback callback


    ## What to do when finished.
    localFinished: (model) ->
      ## TODO: random/repeat
      collection = App.request "localplayer:get:entities"
      ## Next song in playlist.
      model = collection.findWhere {position: model.get('position') + 1}
      if model
        @localLoad model, =>
          @localPlay()
      @localStateUpdate()

    ## Wrapper for playing current item.
    localPlay: ->
      @localCommand 'play'

    ## Wrapper for stopping current item.
    localStop: ->
      @localCommand 'stop'

    ## Wrapper for pausing current item.
    localStop: ->
      @localCommand 'pause'

    ## Wrapper for calling a command on the current soundmanager sound.
    localCommand: (command) ->
      stateObj = App.request "state:local"
      currentItem = stateObj.getState 'localPlay'
      if currentItem isnt false
        currentItem[command]()

    ## Triggers when something changes in the player.
    localStateUpdate: ->
      App.vent.trigger "state:content:updated"

    paramObj: (key, val) ->
      helpers.global.paramObj key, val

    doCallback: (callback, response) ->
      if typeof callback is 'function'
        callback response

    onError: (commands, error) ->
      helpers.debug.rpcError commands, error