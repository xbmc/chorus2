@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->


  ## Base commander with shared functionality.
  class Api.Commander extends Api.Base


  ## Player commander.
  class Api.Player extends Api.Commander

    playEntity: (type = 'position', position, callback) ->
      collection = App.request "localplayer:get:entities"
      model = collection.findWhere {position: position}
      @localLoad model, =>
        @localPlay()
        ## Start playback of playlist position x
        console.log 'playing..', model
        @doCallback callback, position
