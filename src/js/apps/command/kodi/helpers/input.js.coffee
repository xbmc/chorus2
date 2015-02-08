@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->


  ## Input commander
  class Api.Input extends Api.Commander

    commandNameSpace: 'Input'

    sendText: (text, callback) ->
      @singleCommand @getCommand('SendText'), [text], (resp) =>
        @doCallback callback, resp

    sendInput: (type) ->
      @singleCommand @getCommand('type'), [], (resp) =>
        @doCallback callback, resp