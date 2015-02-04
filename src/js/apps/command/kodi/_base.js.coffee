@Kodi.module "Command.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  class Api.Base extends Marionette.Object

    initialize: ->
      $.jsonrpc.defaultUrl = config.get 'static', 'jsonRpcEndpoint'

    multipleCommands: (commands, callback) ->
      obj = $.jsonrpc commands
      obj.fail (error) =>
        @onError commands, error
      obj.done (response) =>
        response = @parseResponse commands, response
        @triggerMethod "response:ready", response
        if callback?
          @doCallback callback, response
      obj

    singleCommand: (command, params, callback) ->
      command = {method: command}
      if params? and params.length > 0
        command.params = params
      obj = @multipleCommands [command], callback
      obj

    parseResponse: (commands, response) ->
      results = []
      for i, result of response
        if result.result
          results.push result.result
        else
          @onError commands[i], result
      if commands.length is 1 and results.length is 1
        results = response[0]
      results


    doCallback: (callback, response) ->
      if callback?
        callback response

    onError: (commands, error) ->
      helpers.debug.rpcError commands, error

