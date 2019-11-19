@Kodi.module "CommandApp.Local", (Api, App, Backbone, Marionette, $, _) ->

  ## Application commander.
  class Api.Application extends Api.Commander

    getProperties: (callback) ->
      stateObj = App.request "state:local"
      resp = {
        volume: stateObj.getState 'volume'
        muted: stateObj.getState 'muted'
      }
      @doCallback callback, resp

    setVolume: (volume, callback) ->
      stateObj = App.request "state:local"
      stateObj.setState 'volume', volume
      @localSetVolume(volume)
      @doCallback callback, volume

    toggleMute: (callback) ->
      stateObj = App.request "state:local"
      volume = 0
      if stateObj.getState 'muted'
        ## unmute (last vol)
        volume = stateObj.getState('lastVolume')
        stateObj.setState 'muted', false
      else
        ## set mute
        stateObj.setState 'lastVolume', stateObj.getState('volume')
        stateObj.setState 'muted', true
        volume = 0
      @localSetVolume(volume)
      @doCallback callback, volume