###
  App configuration settings, items stored in local storage and are
  specific to the browser/user instance. Not Kodi settings.
###
@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    storageKey: 'config:app'

    ## Get a loaded collection
    getCollection: ->
      collection = new Entities.ConfigAppCollection()
      collection.fetch()
      collection

    ## Get a single config item
    getConfig: (id, collection) ->
      collection ?= API.getCollection()
      collection.find {id: id}

  ## The config model
  class Entities.ConfigApp extends Entities.Model
    defaults:
      data: {}

  ## The config collection
  class Entities.ConfigAppCollection extends Entities.Collection
    model: Entities.ConfigApp
    localStorage: new Backbone.LocalStorage API.storageKey


  ## Handler to return a single local setting.
  App.reqres.setHandler "config:app:get", (configId, defaultData) ->
    model = API.getConfig(configId)
    if model?
      model.get 'data'
    else
      defaultData


  ## Handler to set/update a single local setting.
  App.reqres.setHandler "config:app:set", (configId, configData) ->
    collection = API.getCollection()
    model = API.getConfig(configId, collection)
    if model?
      model.save({data: configData})
    else
      collection.create({id: configId, data: configData})
      configData


  ## Handler to return a single static setting (forgotten on page reload).
  App.reqres.setHandler "config:static:get", (configId, defaultData) ->
    data = if config.static[configId]? then config.static[configId] else defaultData
    data


  ## Handler to set a single static setting (forgotten on page reload).
  App.reqres.setHandler "config:static:set", (configId, data) ->
    config.static[configId] = data
    data
