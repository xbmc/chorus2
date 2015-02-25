@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['name']
      small: ['order', 'role', 'thumbnail', 'origin', 'url']
      full: []

    ## Fetch an entity collection.
    getCollection: (cast, origin) ->
      for i, item of cast
        cast[i].origin = origin
      collection = new KodiEntities.CastCollection cast
      collection


  ###
   Models and collections.
  ###

  ## Single Casts model.
  class KodiEntities.Cast extends App.KodiEntities.Model
    idAttribute: "order"
    defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'small'), {}
    parse: (obj, xhr) ->
      obj.url = '?cast=' + obj.name
      obj

  ## Castss collection
  class KodiEntities.CastCollection extends App.KodiEntities.Collection
    model: KodiEntities.Cast


  ###
   Request Handlers.
  ###

  ## Get an cast collection
  App.reqres.setHandler "cast:entities", (cast, origin) ->
    API.getCollection cast, origin
