@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## PVR
  class Api.PVR extends Api.Commander

    commandNameSpace: 'PVR'

    ## Start recording a channel
    setRecord: (id, fields = {}, callback) ->
      params = {channel: id, record: 'toggle'}
      params = _.extend params, fields
      @singleCommand @getCommand('Record'), params, (resp) =>
        @doCallback callback, resp

    ## Toggle timer on a broadcast
    toggleTimer: (id, timerRule = false, callback) ->
      params = {broadcastid: id, timerrule: timerRule}
      @singleCommand @getCommand('ToggleTimer'), params, (resp) =>
        @doCallback callback, resp

    ## Add timer on a broadcast
    addTimer: (id, timerRule = false, callback) ->
      params = {broadcastid: id, timerrule: timerRule}
      @singleCommand @getCommand('AddTimer'), params, (resp) =>
        console.log resp
        @doCallback callback, resp

    ## Remove a timer id
    deleteTimer: (id, callback) ->
      params = {timerid: id}
      @singleCommand @getCommand('DeleteTimer'), params, (resp) =>
        @doCallback callback, resp