@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

	class KodiEntities.Model extends App.Entities.Model
    url: -> helpers.url.baseKodiUrl "Model"
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
        else if type is 'channel'
          ## Check pvr for subtype
          if model.channeltype is 'tv' then type = "channeltv" else type = "channelradio"
          model.url = helpers.url.get type, id
        else
          model.url = helpers.url.get type, id
          
        model = App.request "images:path:entity", model
        model.type = type
        model.uid = @getUniqueId(model, type)
        model.parsed = true
      model

    ## Parse fields into defaults. Sets all to null.
    parseFieldsToDefaults: (fields, defaults = {}) ->
      for field in fields
        defaults[field] = ''
      defaults

    ## Get UniqueID for model.
    getUniqueId: (model, type) ->
      type = if type then type else model.type
      id = model.id
      uid = 'none'
      if typeof id is 'number'
        uid = id
      else
        file = model.file
        if file
          uid = 'file-' + helpers.global.hashCode(file)
      type + '-' + uid

    # Check the response, it might be cached and parsing can be skipped.
    #
    # @param [Object] Response from the API
    # @param [String] The key to check against.
    # @return [Object] the response with the fullyloaded property set if parsing can be skipped.
    #
    checkResponse: (response, checkKey) ->
      obj = if response[checkKey]? then response[checkKey] else response
      if response[checkKey]?
        obj.fullyloaded = true
      obj