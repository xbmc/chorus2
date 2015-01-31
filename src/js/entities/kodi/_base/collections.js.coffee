@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

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

    ## Common arg patterns all checking if the params exist in options first.
    argCheckOption: (option, fallback) ->
      if this.options? and this.options[option]?
        this.options[option]
      else
        fallback

    ## Sort.
    argSort: (method, order = 'ascending') ->
      arg = {method: method, order: order, ignorearticle: true}
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

