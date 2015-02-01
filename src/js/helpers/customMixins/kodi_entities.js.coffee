###
  Entities mixins, all the common things we do/need on almost every collection

  example of usage:

  collection = new KodiCollection()
    .setEntityType 'collection'
    .setEntityKey 'movie'
    .setEntityFields 'small', ['thumbnail', 'title']
    .setEntityFields 'full', ['fanart', 'genre']
    .setMethod 'VideoLibrary.GetMovies'
    .setArgHelper 'fields'
    .setArgHelper 'limit'
    .setArgHelper 'sort'
    .applySettings()

###
@KodiMixins ?= {}


KodiMixins.Entities =

  url: config.get 'static', 'jsonRpcEndpoint'
  rpc: new Backbone.Rpc({
    useNamedParameters: true,
    namespaceDelimiter: ''
  })


  ###
    Overrides!
  ###

#  ## Add the options to the collection so we can use their args with rpc calls.
#  sync: (method, model, options) ->
#    if method is 'read'
#      this.options = options
#    Backbone.sync method, model, options
#
#  ## Parse the response.
#  parse: (resp, xhr) ->
#    respProp = @getEntityKey(@entityType + 'ResponseProperty')
#    if @entityType is 'model'
#      ## If fetched directly, look in movie details and mark as fully loaded
#      obj = if resp[respProp]? then resp[respProp] else resp
#      if resp[respProp]?
#        obj.fullyloaded = true
#      @parseModel @getEntityKey('type'), obj, obj[@getEntityKey('idProperty')]
#    else
#      ## collection
#      resp[respProp]



#  ###
#    Parse the model before adding to the collection
#    Here we can add generic goodies to all models.
#  ###
#  parseModel: (type, model, id) ->
#    model.id = id
#    model = App.request "images:path:entity", model
#    model.url = helpers.url.get type, id
#    model.type = type
#    model


  ###
    Apply all the defined settings.
  ###
  applySettings: ->
    ## @buildRpcRequest()
    if @entityType is 'model'
      @setModelDefaultFields()


  ###
    What kind of entity are we dealing with. collection or model
  ###
  entityType: 'model'
  setEntityType: (type) ->
    @entityType = type
    @


  ###
    Entity Keys, properties that change between the entities
  ###
  entityKeys:
    type: ''
    modelResponseProperty: ''
    collectionResponseProperty: ''
    idProperty: ''

  setEntityKey: (key, value) ->
    @entityKeys[key] = value
    @

  ## Type is the only required, autodetect others.
  getEntityKey: (key) ->
    type = @entityKeys.type
    switch key
      when 'modelResponseProperty'
        ret = if @entityKeys[key]? then @entityKeys[key] else type + 'details'
      when 'collectionResponseProperty'
        ret = if @entityKeys[key]? then @entityKeys[key] else type + 's'
      when 'idProperty'
        ret = if @entityKeys[key]? then @entityKeys[key] else type + 'id'
      else
        ret = type
    ret


  ###
    The types of fields we request, minimal for search, small for list, full for page.
  ###
  entitiyFields:
    minimal: []
    small: []
    full: []

  setEntityFields: (type, fields = []) ->
    @entitiyFields[type] = fields
    @

  getEntityFields: (type) ->
    fields = @entitiyFields.minimal
    if type is 'full'
      fields.concat(@entitiyFields.small).concat(@entitiyFields.full)
    else if type is 'small'
      fields.concat(@entitiyFields.small)
    else
      fields

  ## Common model fields (not valid kodi response properties)
  modelDefaults:
    id: 0
    fullyloaded: false
    thumbnail: ''
    thumbsUp: false

  ## Define the model fields using a null default.
  setModelDefaultFields: (defaultFields = {}) ->
    defaultFields = _.extend @modelDefaults, defaultFields
    for field in @getEntityFields('full')
      @defaults[field] = ''


  ###
    JsonRPC common paterns and helpers.
  ###
  callMethodName: ''
  callArgs: []
  callIgnoreArticle: true

  ## Set method
  setMethod: (method) ->
    @callMethodName = method
    @

  ## Args must be set in the correct order!

  ## Set a static argument
  setArgStatic: (callback) ->
    @callArgs.push( callback )
    @

  ## Set a helper argument
  setArgHelper: (helper, param1, param2) ->
    func = 'argHelper' + helper
    @callArgs.push( this[func](param1, param2) )
    @

  ## Common arg patterns all checking if the params exist in options first.
  argCheckOption: (option, fallback) ->
    if this.options? and this.options[option]?
      this.options[option]
    else
      fallback

  ## Our arg helpers
  argHelperfields: (type = 'small') ->
    arg = @getEntityFields type
    @argCheckOption 'fields', arg

  argHelpersort: (method, order = 'ascending') ->
    arg = {method: method, order: order, ignorearticle: @callIgnoreArticle}
    @argCheckOption 'sort', arg

  argHelperlimit: (start = 0, end = 'all') ->
    arg = {start: start}
    if end isnt 'all'
      arg.end = end
    @argCheckOption 'limit', arg

  argHelperfilter: (name, value) ->
    arg = {}
    if name?
      arg[name] = value
    @argCheckOption 'filter', arg

  ## Apply the methods + args to entity (build request)
  buildRpcRequest: (type = 'read') ->
    req = [@callMethodName]
    for arg in @callArgs
      func = 'argHelper' + arg
      ## if a callback (collection)
      if typeof func is 'function'
        key = 'arg' + req.length
        req.push key
        this[key] = func
      else
        ## if a string (model)
        req.push arg
    ## Set the method
    req


