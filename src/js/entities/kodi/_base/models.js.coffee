@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->
	
	class KodiEntities.Model extends App.Entities.Model
    url: config.get 'static', 'jsonRpcEndpoint'
    rpc: new Backbone.Rpc({
      useNamedParameters: true,
      namespaceDelimiter: ''
    })
    modelDefaults:
      fullyloaded: false
      thumbnail: ''
      thumbsUp: false
      parsed: false

    ## This is our generic way of updating things that need to be
    ## added or changed on all models prior to creation, should be
    ## called during model.parse()
    parseModel: (type, model, id) ->
      if not model.parsed
        model.id = id
        model = App.request "images:path:entity", model
        model.url = helpers.url.get type, id
        model.type = type
        model.parsed = true
      model

    ## Parse fields into defaults. Sets all to null.
    parseFieldsToDefaults: (fields, defaults = {}) ->
      for field in fields
        defaults[field] = ''
      defaults