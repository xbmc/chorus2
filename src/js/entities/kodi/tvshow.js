@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title', 'art']
      small: ['playcount', 'lastplayed', 'dateadded', 'episode', 'rating', 'year', 'file', 'genre', 'watchedepisodes', 'cast', 'studio', 'mpaa', 'tag']
      full: ['imdbnumber', 'episodeguide', 'plot', 'sorttitle', 'originaltitle', 'premiered']

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.TVShow()
      entity.set({tvshowid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      collection = new KodiEntities.TVShowCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

  ###
   Models and collections.
  ###

  ## Single TVShows model.
  class KodiEntities.TVShow extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {tvshowid: 1, tvshow: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: read: ['VideoLibrary.GetTVShowDetails', 'tvshowid', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.tvshowdetails? then resp.tvshowdetails else resp
      if resp.tvshowdetails?
        obj.fullyloaded = true
      obj.unwatched = obj.episode - obj.watchedepisodes
      @parseModel 'tvshow', obj, obj.tvshowid

  ## TVShows collection
  class KodiEntities.TVShowCollection extends App.KodiEntities.Collection
    model: KodiEntities.TVShow
    methods: read: ['VideoLibrary.GetTVShows', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs({
      properties: @argFields(helpers.entities.getFields(API.fields, 'small'))
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
      filter: @argFilter()
    })
    parse: (resp, xhr) -> @getResult resp, 'tvshows'

  ###
   Request Handlers.
  ###

  # Get a single tvshow
  App.reqres.setHandler "tvshow:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an tvshow collection
  App.reqres.setHandler "tvshow:entities", (options = {}) ->
    API.getCollection options

  ## Get full field/property list for entity
  App.reqres.setHandler "tvshow:fields", (type = 'full') ->
    helpers.entities.getFields(API.fields, type)
