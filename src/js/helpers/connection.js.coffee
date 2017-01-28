###
  Connection helpers. For live connecting and disconnecting from Kodi.
###
helpers.connection = {}

## Attempt to reconnect a disconnected shell.
helpers.connection.reconnect = (success) ->
  helpers.connection.ping (() ->
    ## Successful reconnect!
    config.setLocal 'connected', true
    Kodi.execute 'state:ws:init'
    success()
  ), () ->
    Kodi.execute 'shell:disconnect'

## Disconnect the shell.
helpers.connection.disconnect = () ->
  config.setLocal 'connected', false

## We manually call a ping to specify a reduced timeout.
helpers.connection.ping = (success, fail) ->
  d = new Date()
  $.ajax
    url: helpers.url.baseKodiUrl("Ping")
    timeout: 3000
    contentType: 'application/json'
    type:'POST'
    data: JSON.stringify({jsonrpc: '2.0', method: 'JSONRPC.Ping', params: {}, id: d.getTime()})
    success: success
    error: fail
