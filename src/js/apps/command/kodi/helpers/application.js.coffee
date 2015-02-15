@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Application commander.
  class Api.Application extends Api.Commander

    commandNameSpace: 'Application'

    getProperties: (callback) ->
      @singleCommand @getCommand('GetProperties'), [["volume", "muted"]], (resp) =>
        @doCallback callback, resp

    setVolume: (volume, callback) ->
      @singleCommand @getCommand('SetVolume'), [volume], (resp) =>
        @doCallback callback, resp

    toggleMute: (callback) ->
      stateObj = App.request "state:kodi"
      @singleCommand @getCommand('SetMute'), [!stateObj.getState('muted')], (resp) =>
        @doCallback callback, resp