
## A wrapper for getting a config value.
config.get = (type, id, defaultData = '', callback) ->
  data = Kodi.request "config:#{type}:get", id, defaultData
  if callback?
    callback data
  data

## A wrapper for setting a config value.
config.set = (type, id, data, callback) ->
  resp = Kodi.request "config:#{type}:set", id, data
  if callback?
    callback resp
  resp