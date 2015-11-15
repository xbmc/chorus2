@Kodi.module "StateApp.Kodi", (StateApp, App, Backbone, Marionette, $, _) ->

  ## Poll for updates when websockets unavailable
  ## As we need instance properties, for reference the instance is `App.kodiPolling`
  class StateApp.Polling extends App.StateApp.Base

    commander: {}
    checkInterval: 10000 ## 10 sec
    currentInterval: ''
    timeoutObj: {}
    failures: 0
    maxFailures: 100

    initialize: ->
      ## Set the current interval to default
      interval = config.getLocal 'pollInterval'
      @checkInterval = parseInt interval
      @currentInterval = @checkInterval

    startPolling: ->
      @update()

    ## The polling call.
    updateState: ->
      stateObj = App.request "state:kodi"
      stateObj.getCurrentState()

    ## As most of this is called out of context, we are calling everything
    ## around the timeout in the golbal instace scope.
    update: ->
      if App.kodiPolling.failures < App.kodiPolling.maxFailures
        App.kodiPolling.updateState()
        ## Set the timeout.
        App.kodiPolling.timeout = setTimeout(App.kodiPolling.ping, App.kodiPolling.currentInterval)
      else
        ## We have exceeded the failure count, probably dead!
        App.execute "notification:show", t.gettext("Unable to communicate with Kodi in a long time. I think it's dead Jim!")

    ## Do a ping and deal with the results.
    ping: ->
      commander = App.request "command:kodi:controller", 'auto', 'Commander'
      commander.setOptions({
        timeout: 5000
        error: ->
          App.kodiPolling.failure()
      })
      commander.onError = ->
        ## replace current error handler so we don't polute the console.
      commander.sendCommand 'Ping', [], ->
        App.kodiPolling.alive()

    alive: ->
      App.kodiPolling.failures = 0 # reset failures
      App.kodiPolling.currentInterval = App.kodiPolling.checkInterval # reset interval
      App.kodiPolling.update() ## update again

    failure: ->
      App.kodiPolling.failures++
      ## Incriment the check interval the more failures we get
      if App.kodiPolling.failures > 10
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 5
      if App.kodiPolling.failures > 20
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 10
      if App.kodiPolling.failures > 30
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 30
      App.kodiPolling.update() ## update again


