## Our global objects
@helpers = {}
@config = {
  static: jsonRpcEndpoint: 'jsonrpc'
}

## The App Inance
@Kodi = do (Backbone, Marionette) ->

  App = new Backbone.Marionette.Application()

  App.addRegions
    root: "body"

  App.on "initialize:after", (options) ->
    if Backbone.history
      Backbone.history.start()

  App

@Kodi.start()
