###
  Config Helpers.
###

# A wrapper for getting a config value.
config.get = (type, id, defaultData = '', callback) ->
  data = Kodi.request "config:#{type}:get", id, defaultData
  if callback?
    callback data
  data

# A wrapper for setting a config value.
config.set = (type, id, data, callback) ->
  resp = Kodi.request "config:#{type}:set", id, data
  if callback?
    callback resp
  resp

# A wrapper for getting a local setting (static)
config.getLocal = (id, defaultData, callback) ->
  config.get 'static', defaultData, callback

# Wrapper for getting a config value before app has started.
# Should always try and use config.get() before this.
config.preStartGet = (id, defaultData = '') ->
  if localStorage? and localStorage.getItem('config:app-config:local')?
    config = JSON.parse(localStorage.getItem('config:app-config:local')).data
    if config[id]?
      return config[id]
  defaultData