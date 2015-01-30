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
