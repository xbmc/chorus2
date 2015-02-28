@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['season']
      small: ['showtitle', 'playcount', 'thumbnail', 'tvshowid', 'episode', 'watchedepisodes', 'fanart']
      full: []

    ## Fetch a single entity, requires a season collection passed.
    getEntity: (collection, season) ->
      collection.findWhere({season: season})

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {cache: false, expires: config.get('static', 'collectionCacheExpiry')}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.SeasonCollection()
      collection.fetch options
      collection

  ###
   Models and collections.
  ###

  ## Single Seasons model.
  class KodiEntities.Season extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {seasonid: 1, season: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    parse: (resp, xhr) ->
      obj = if resp.seasondetails? then resp.seasondetails else resp
      if resp.seasondetails?
        obj.fullyloaded = true
      obj.unwatched = obj.episode - obj.watchedepisodes
      @parseModel 'season', obj, obj.tvshowid + '/' + obj.season

  ## Seasonss collection
  class KodiEntities.SeasonCollection extends App.KodiEntities.Collection
    model: KodiEntities.Season
    methods: read: ['VideoLibrary.GetSeasons', 'arg1', 'arg2', 'arg3', 'arg4']
    arg1: ->@argCheckOption('tvshowid', 0)
    arg2: -> helpers.entities.getFields(API.fields, 'small')
    arg3: -> @argLimit()
    arg4: -> @argSort("season", "ascending")
    parse: (resp, xhr) ->
      console.log resp
      @getResult resp, 'seasons'


  ###
   Request Handlers.
  ###

  # Get a single season
  App.reqres.setHandler "season:entity", (collection, season) ->
    API.getEntity collection, season,

  ## Get an season collection
  App.reqres.setHandler "season:entities", (tvshowid, options = {}) ->
    options.tvshowid = tvshowid
    API.getCollection options
