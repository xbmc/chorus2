@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    cacheSynced: (entities, callback) ->
      entities.on 'cachesync', ->
        callback()
        helpers.global.loading "end"

    xhrsFetch:  (entities, callback) ->
      xhrs = _.chain([entities]).flatten().pluck("_fetch").value()
      $.when(xhrs...).done ->
        callback()
        helpers.global.loading "end"


  ## When entity fetched use the xhrs response to trigger done.
  App.commands.setHandler "when:entity:fetched", (entities, callback) ->
    helpers.global.loading "start"
    ## When collections are returned from cache they don't seem to have
    ## params so am using this as our check if it is an xhrs request or
    ## a cachehit.
    ## TODO: Keep an eye on this - https://github.com/madglory/backbone-fetch-cache/issues/113
    if not entities.params
      API.cacheSynced(entities, callback)
    else
      API.xhrsFetch(entities, callback)
