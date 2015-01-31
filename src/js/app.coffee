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

  App.vent.on "shell:ready", (options) =>
    Backbone.history.start();

  App

@Kodi.start()
