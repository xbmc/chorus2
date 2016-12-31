@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  Backbone.fetchCache.localStorage = false

  class KodiEntities.Collection extends App.Entities.Collection

    initialize: () ->
      # On model update (eg edit) reload the model
      App.vent.on 'entity:kodi:refresh', (type, id, fields) =>
        model = @findWhere({type: type, id: id})
        if model
          model.fetch({properties: fields, success: (updatedModel) =>
            Backbone.fetchCache.clearItem(updatedModel)
          })

    ## Common jsonrpc settings.
    url: -> helpers.url.baseKodiUrl "Collection"
    rpc: new Backbone.Rpc({
      namespaceDelimiter: ''
    })

    ## Add the options to the collection so we can use their args with rpc calls.
    sync: (method, model, options) ->
      if method is 'read'
        this.options = options
      Backbone.sync method, model, options

    ## Set our custom cache keys.
    getCacheKey: (options) ->
      this.options = options
      key = this.constructor.name
      for k in ['filter', 'sort', 'limit', 'file']
        if options[k]
          for prop, val of options[k]
            key += ':' + prop + ':' + val
      key

    ## When using cache, it doesn't respect the jsonrpc parsing
    ## so we use this to parse all collection results using cache.
    getResult: (response, key) ->
      @responseKey = key
      result = if response.jsonrpc and response.result then response.result else response
      result[key]

    ## Common arg patterns all checking if the params exist in options first.
    argCheckOption: (option, fallback) ->
      if @options? and @options[option]?
        @options[option]
      else
        fallback

    ## Sort.
    argSort: (method, order = 'ascending') ->
      arg = {method: method, order: order, ignorearticle: @isIgnoreArticle()}
      @argCheckOption 'sort', arg

    ## Limit.
    argLimit: (start = 0, end = 'all') ->
      arg = {start: start}
      if end isnt 'all'
        arg.end = end
      @argCheckOption 'limit', arg

    ## Filter.
    argFilter: (name, value) ->
      arg = {}
      if name?
        arg[name] = value
      else
        arg = undefined
      @argCheckOption 'filter', arg

    ## Allow replacing fields (fields) or adding additional fields (addFields) via options.
    ## Both expect an array.
    argFields: (fields) ->
      if @options? and @options.fields?
        fields = @options.fields
      if @options? and @options.addFields?
        for field in @options.addFields
          if not helpers.global.inArray field, fields
            fields.push field
      fields

    ## Should we ignore article when sorting?
    isIgnoreArticle: ->
      config.getLocal 'ignoreArticle', true

    ## Get Args
    getArgs: (defaults) ->
      args = if @options? then _.extend(defaults, @options) else defaults
      args
