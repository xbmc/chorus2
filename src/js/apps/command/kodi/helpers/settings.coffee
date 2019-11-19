@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## GUI
  class Api.Settings extends Api.Commander

    commandNameSpace: 'Settings'

    getSettingValue: (value, callback) ->
      @sendCommand "getSettingValue", [value], (resp) =>
	      @doCallback callback, resp.value
