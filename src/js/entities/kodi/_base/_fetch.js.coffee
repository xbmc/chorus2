@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->
	
  API =

    initialize: ->
      $.jsonrpc.defaultUrl = config.get 'static', 'jsonRpcEndpoint'

    multipleCommands: (commands, callback) ->
      obj = $.jsonrpc commands
      obj.fail (error) ->
        helpers.debug.rpcError error
      obj

    singleCommand: (command, params) ->
      command = {method: command}
      if params? and params.length > 0
        command.params = params
      obj = API.multipleCommands [command]
      obj

    parseResponse: (response) ->
      results = []
      console.log response
      for result in response
        if result.result
          results.push result.result
        else
          helpers.debug.rpcError result.error
      results


  ## When multiple commands fetched
  App.commands.setHandler "when:commands:fetched", (commands, callback) ->
    request = API.multipleCommands(commands)
    request.done (response) ->
      result = API.parseResponse(response)
      callback(result)


  ## When single command fetched.
  App.commands.setHandler "when:command:fetched", (command, params, callback) ->
    request = API.singleCommand(command, params)
    request.done (response) ->
      results = API.parseResponse(response)
      result = if results.length is 1 then results[0] else {}
      callback( result )


  ## When entity fetched.
  App.commands.setHandler "when:entity:fetched", (entities, callback) ->
    xhrs = _.chain([entities]).flatten().pluck("_fetch").value()
    $.when(xhrs...).done ->
      callback()