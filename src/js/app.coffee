## Our global objects
@helpers = {}
@config = {
  static:
    jsonRpcEndpoint: 'jsonrpc'
    socketsHost: location.hostname
    socketsPort: 9090
    ajaxTimeout: 5000
    hashKey: 'kodi'
    defaultPlayer: 'auto'
    ignoreArticle: true
    pollInterval: 10000
    albumAtristsOnly: true
    searchIndexCacheExpiry: (24 * 60 * 60) # 1 day
}

## The App Inance
@Kodi = do (Backbone, Marionette) ->

  App = new Backbone.Marionette.Application()

  App.addRegions
    root: "body"

  ## Load custom config settings.
  App.on "before:start", ->
    config.static = _.extend config.static, config.get('app', 'config:local', config.static)
    console.log config.static

  App.vent.on "shell:ready", (options) =>
    App.startHistory()

  App

$(document).ready =>
  @Kodi.start()
  $.material.init()


