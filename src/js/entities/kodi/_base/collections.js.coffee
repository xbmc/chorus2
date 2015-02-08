@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  Backbone.fetchCache.localStorage = false

  class KodiEntities.Collection extends App.Entities.Collection

    ## Common jsonrpc settings.
    url: config.get 'static', 'jsonRpcEndpoint'
    rpc: new Backbone.Rpc({
      useNamedParameters: true,
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
      result = if response.jsonrpc and response.result then response.result else response
      result[key]

    ## Common arg patterns all checking if the params exist in options first.
    argCheckOption: (option, fallback) ->
      if this.options? and this.options[option]?
        this.options[option]
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
      @argCheckOption 'filter', arg

    ## Should we ignore article when sorting?
    isIgnoreArticle: ->
      config.get 'static', 'ignoreArticle', true