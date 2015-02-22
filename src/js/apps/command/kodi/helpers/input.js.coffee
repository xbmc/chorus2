@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->


  ## Input commander
  class Api.Input extends Api.Commander

    commandNameSpace: 'Input'

    ## Send a text string
    sendText: (text, callback) ->
      @singleCommand @getCommand('SendText'), [text], (resp) =>
        @doCallback callback, resp

    ## Set a single input
    sendInput: (type, callback) ->
      @singleCommand @getCommand(type), [], (resp) =>
        @doCallback callback, resp
        if not App.request 'sockets:active'
          App.request 'state:kodi:update', callback
