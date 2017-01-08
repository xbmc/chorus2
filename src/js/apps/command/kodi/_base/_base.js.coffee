@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  class Api.Base extends Marionette.Object

    ajaxOptions: {}

    initialize: (options = {}) ->
      $.jsonrpc.defaultUrl = helpers.url.baseKodiUrl "Base"
      @setOptions(options)

    setOptions: (options) ->
      @ajaxOptions = options

    multipleCommands: (commands, callback) ->
      obj = $.jsonrpc commands, @ajaxOptions
      obj.fail (error) =>
        @onError commands, error
      obj.done (response) =>
        response = @parseResponse commands, response
        @triggerMethod "response:ready", response
        if callback?
          @doCallback callback, response
      obj

    singleCommand: (command, params, callback) ->
      command = {method: command, url: helpers.url.baseKodiUrl(command)}
      if params? and (params.length > 0 or _.isObject(params))
        command.params = params
      obj = @multipleCommands [command], callback
      obj

    parseResponse: (commands, response) ->
      results = []
      for i, result of response
        if result.result or result.result is false
          results.push result.result
        else
          @onError commands[i], result
      if commands.length is 1 and results.length is 1
        results = results[0]
      results

    paramObj: (key, val) ->
      helpers.global.paramObj key, val

    doCallback: (callback, response) ->
      if callback?
        callback response

    onError: (commands, error) ->
      helpers.debug.rpcError commands, error
