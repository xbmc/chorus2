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

    dictionary: {}

    fields:
      minimal: []
      small: ['method', 'description', 'thumbnail', 'params', 'permission', 'returns', 'type', 'namespace', 'methodname']
      full: []

    ## Fetch a single entity
    getEntity: (id, collection) ->
      model = collection.where({id: id}).shift()
      model

    ## Fetch an entity collection.
    getCollection: (options = {}) ->
      collection = new KodiEntities.ApiMethodCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

    parseCollection: (itemsRaw = [], type = 'method') ->
      items = []
      for method, item of itemsRaw
        item.method = method
        item.id = method
        API.dictionary[item.id] = item.id
        if type is 'type'
          item.params = _.extend {}, item
          item.description = 'API Type'
        item.type = type
        methodParts = method.replace('.', '[SPLIT]').split('[SPLIT]')
        item.namespace = methodParts[0]
        item.methodname = methodParts[1]
        items.push item
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
    methods: read: ['JSONRPC.Introspect', 'getdescriptions', 'getmetadata']
    args: -> @getArgs
      getdescriptions: true
      getmetadata: true
    parse: (resp, xhr) ->
      methods = API.parseCollection(@getResult(resp, 'methods'), 'method')
      types = API.parseCollection(@getResult(resp, 'types'), 'type')
      methods.concat(types)


  ###
   Request Handlers.
  ###

  ## Get an single method collection
  App.reqres.setHandler "introspect:entity", (id, collection) ->
    API.getEntity id, collection

  ## Get the introspect collection of methods
  App.reqres.setHandler "introspect:entities", (options = {}) ->
    API.getCollection options

  ## Get a dictionary of all known methods/types, must be called after fetch
  App.reqres.setHandler "introspect:dictionary", () ->
    API.dictionary