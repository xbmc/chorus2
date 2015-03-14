@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Application commander.
  class Api.AddOn extends Api.Commander

    commandNameSpace: 'Addons'

    getAddons: (type = "unknown", enabled = true, callback) ->
      @singleCommand @getCommand('GetAddons'), [type, "unknown", enabled], (resp) =>
        @doCallback callback, resp.addons

    getEnabledAddons: (callback) ->
      @getAddons "unknown", true, (resp) =>
        @doCallback callback, resp
