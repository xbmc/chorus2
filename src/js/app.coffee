## Our global objects
@helpers = {}
@config = {
  static:
    appTitle: 'Kodi.'
    jsonRpcEndpoint: 'jsonrpc'
    socketsHost: location.hostname
    socketsPort: 9090
    ajaxTimeout: 5000
    hashKey: 'kodi'
    defaultPlayer: 'auto'
    ignoreArticle: true
    pollInterval: 10000
    reverseProxy: false
    albumAtristsOnly: true
    searchIndexCacheExpiry: (24 * 60 * 60) # 1 day
    collectionCacheExpiry: (7 * 24 * 60 * 60) # 1 week (gets wiped on library update)
    addOnsLoaded: false
    lang: (JSON.parse(localStorage.getItem('config:app-config:local')).data.lang || 'en')
}

## The App Inance
@Kodi = do (Backbone, Marionette) ->

  App = new Backbone.Marionette.Application()

  App.addRegions
    root: "body"

  ## Load custom config settings.
  App.on "before:start", ->
    config.static = _.extend config.static, config.get('app', 'config:local', config.static)

  App.vent.on "shell:ready", (options) =>
    App.startHistory()

  App

$(document).ready =>
  $.getJSON("resources/language/" + config.static.lang + ".json", (data) -> 
    window.t = new Jed(data)
    t.options["missing_key_callback"] = (key) -> console.error key
    Kodi.start()
  )
  $.material.init()
