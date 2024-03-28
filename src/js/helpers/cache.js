###
  Our cache storage, persists only for app lifecycle
  Eg. gets wiped when page reloaded.
###
helpers.cache =
  store: {}
  defaultExpiry: 406800 ## 7days

## Set a cached object
helpers.cache.set = (key, data, expires) ->
  expires ?= helpers.cache.defaultExpiry
  helpers.cache.store[key] =
    data: data
    expires: expires + helpers.global.time()
    key: key
  data

## Get a cached object
helpers.cache.get = (key, fallback) ->
  fallback ?= false
  if helpers.cache.store[key]? and helpers.cache.store[key].expires >= helpers.global.time()
    helpers.cache.store[key].data
  else
    fallback

## Delete a cached object
helpers.cache.del = (key) ->
  if helpers.cache.store[key]?
    delete helpers.cache.store[key]

## Clear all caches
helpers.cache.clear = ->
  helpers.cache.store = {}

## Update a property of a model in a backbone collection so we don't
## have to clear the entire collection cache.
## TODO: See if this can be replaced with: Backbone.fetchCache.clearItem(updatedModel)
helpers.cache.updateCollection = (collectionKey, responseKey, modelId, property, value) ->
  if Backbone.fetchCache._cache? and Backbone.fetchCache._cache[collectionKey]? and Backbone.fetchCache._cache[collectionKey].value.result?
    if Backbone.fetchCache._cache[collectionKey].value.result[responseKey]?
      for i, item of Backbone.fetchCache._cache[collectionKey].value.result[responseKey]
        if item.id is modelId
          Backbone.fetchCache._cache[collectionKey].value.result[responseKey][parseInt(i)][property] = value
