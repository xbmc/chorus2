@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## GUI
  class Api.GUI extends Api.Commander

    commandNameSpace: 'GUI'

    setFullScreen: (fullscreen = true, callback) ->
      @sendCommand "SetFullscreen", [fullscreen], (resp) =>
	@doCallback callback, resp

    ## See http://kodi.wiki/view/JSON-RPC_API/v6#GUI.Window for types
    activateWindow: (window, params = [], callback) ->
      @sendCommand "ActivateWindow", [window, params], (resp) =>
	@doCallback callback, resp
