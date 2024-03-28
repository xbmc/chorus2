@Kodi.module "StateApp.Local", (StateApp, App, Backbone, Marionette, $, _) ->

  ## Local state object.
  class StateApp.State extends App.StateApp.Base

    initialize: ->
      @state = _.extend {}, @state
      @playing = _.extend {}, @playing
      @setState 'player', 'local'
      @setState 'currentPlaybackId', 'browser-none'
      @setState 'localPlay', false

      ## Add a listener for others to trigger an update
      App.reqres.setHandler "state:local:update", (callback) =>
        @getCurrentState callback
      ## Add a listener for others to trigger an update
      App.reqres.setHandler "state:local:get", =>
        @getCachedState()

    getCurrentState: (callback) ->
      ## Update from local player.

      @doCallback callback, @getCachedState()
