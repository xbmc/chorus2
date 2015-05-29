@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## PVR
  class Api.PVR extends Api.Commander

    commandNameSpace: 'PVR'

    ## Start recording a channel
    setPVRRecord: (id, fields = {}, callback) ->
      params = {channel: id}
      params = _.extend params, fields
      @singleCommand @getCommand('Record'), params, (resp) =>
        @doCallback callback, resp
        