@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->


  ## Base commander with shared functionality.
  class Api.Commander extends Api.Base
    ## See Api.Base for soundmanager abstraction

  ## Player commander.
  class Api.Player extends Api.Commander

    playEntity: (type = 'position', position, callback) ->
      collection = App.request "localplayer:get:entities"
      model = collection.findWhere {position: position}
      @localLoad model, =>
        @localPlay()
        ## Start playback of playlist position x
        @doCallback callback, position

    ## Mimics Kodi Player Commands.
    sendCommand: (command, param) ->
      switch command
        when 'GoTo'
          @localGoTo param
        when 'PlayPause'
          @localPlayPause()
        when 'Seek'
          @localSeek param
        when 'SetRepeat'
          ## param can be 'cycle', 'off', 'all' or 'one'
          @localRepeat param
        when 'SetShuffle'
          ## Toggles shuffle
          @localShuffle()
        when 'Stop'
          @localStop()
        else
          ## nothing
      @localStateUpdate()
