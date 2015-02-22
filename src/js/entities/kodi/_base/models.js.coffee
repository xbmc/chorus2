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
        if id isnt 'mixed'
          model.id = id
        if model.rating
          model.rating = helpers.global.rating model.rating
        if model.streamdetails and _.isObject model.streamdetails
          model.streamdetails = helpers.stream.streamFormat model.streamdetails
        if model.resume
          model.progress = if model.resume.position is 0 then 0 else Math.round((model.resume.position / model.resume.total) * 100)
        if model.trailer
          model.trailer = helpers.url.parseTrailerUrl model.trailer
        if type is 'episode'
          model.url = helpers.url.get type, id, {':tvshowid': model.tvshowid, ':season': model.season}
        else
          model.url = helpers.url.get type, id
        model = App.request "images:path:entity", model
        model.type = type
        model.parsed = true
      model

    ## Parse fields into defaults. Sets all to null.
    parseFieldsToDefaults: (fields, defaults = {}) ->
      for field in fields
        defaults[field] = ''
      defaults