# Entities for the API Browser.
#
# @param [Object] The entities object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: []
      small: ['method', 'description', 'thumbnail', 'params', 'permission', 'returns', 'type', 'namespace', 'methodname']
      full: []

    ## Fetch a single entity
    getEntity: (id, collection) ->
      console.log id, collection
      model = collection.where({method: id}).shift()
      console.log model
      model

    ## Fetch an entity collection.
    getCollection: (options = {}) ->
      collection = new KodiEntities.ApiMethodCollection()
      collection.fetch options
      collection

    parseCollection: (itemsRaw = []) ->
      items = []
      for method, item of itemsRaw
        item.method = method
        item.id = method
        methodParts = method.split('.')
        item.namespace = methodParts[0]
        item.methodname = methodParts[1]
        items.push item
      console.log "INTROSPECT"
      console.log items
      items


  ###
   Models and collections.
  ###

  ## Single API Method model.
  class KodiEntities.ApiMethod extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {id: 1, params: {}})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'small'), fields

  ## Method collection
  class KodiEntities.ApiMethodCollection extends App.KodiEntities.Collection
    model: KodiEntities.ApiMethod
    methods: read: ['JSONRPC.Introspect', 'arg1', 'arg2', 'arg3']
    arg1: -> true
    arg2: -> true
    parse: (resp, xhr) ->
      items = @getResult resp, 'methods'
      API.parseCollection(items)


  ###
   Request Handlers.
  ###

  ## Get an single method collection
  App.reqres.setHandler "introspect:entity", (id, collection) ->
    API.getEntity id, collection

  ## Get the introspect collection of methods
  App.reqres.setHandler "introspect:entities", (options = {}) ->
    API.getCollection options
