@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title']
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'rating', 'year', 'file']
      full: ['fanart', 'studio', 'mpaa', 'cast', 'imdbnumber', 'episodeguide', 'watchedepisodes']

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.TVShow()
      entity.set({tvshowid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {reset: false} ## reset: true
      options = _.extend defaultOptions, options
      collection = new KodiEntities.TVShowCollection()
      collection.fetch options
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
      @parseModel 'tvshow', obj, obj.tvshowid

  ## TVShowss collection
  class KodiEntities.TVShowCollection extends App.KodiEntities.Collection
    model: KodiEntities.TVShow
    methods: read: ['VideoLibrary.GetTVShows', 'arg1', 'arg2', 'arg3']
    arg1: -> helpers.entities.getFields(API.fields, 'small')
    arg2: -> @argLimit()
    arg3: -> @argSort("title", "ascending")
    parse: (resp, xhr) -> resp.tvshows


  ## Filtered TVShows collection
  class KodiEntities.TVShowFilteredCollection extends KodiEntities.TVShowCollection
    methods: read: ['VideoLibrary.GetTVShowss', 'arg1', 'arg2', 'arg3', 'arg4']
    arg4: -> @argFilter()

  ###
   Request Handlers.
  ###

  # Get a single tvshow
  App.reqres.setHandler "tvshow:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an tvshow collection
  App.reqres.setHandler "tvshow:entities", (options = {}) ->
    API.getCollection options