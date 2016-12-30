@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->


  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title']
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'season', 'rating', 'file', 'cast', 'showtitle', 'tvshowid', 'uniqueid', 'resume']
      full: ['fanart', 'plot', 'firstaired', 'director', 'writer', 'runtime', 'streamdetails']

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.Episode()
      entity.set({episodeid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {cache: false, expires: config.get('static', 'collectionCacheExpiry'), useNamedParameters: true}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.EpisodeCollection()
      collection.fetch options
      collection

  ###
   Models and collections.
  ###

  ## Single Episodes model.
  class KodiEntities.Episode extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {episodeid: 1, episode: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: read: ['VideoLibrary.GetEpisodeDetails', 'episodeid', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.episodedetails? then resp.episodedetails else resp
      if resp.episodedetails?
        obj.fullyloaded = true
      obj.unwatched = if obj.playcount > 0 then 0 else 1
      @parseModel 'episode', obj, obj.episodeid

  ## Episodes collection
  class KodiEntities.EpisodeCollection extends App.KodiEntities.Collection
    model: KodiEntities.Episode
    methods: read: ['VideoLibrary.GetEpisodes', 'tvshowid', 'season', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs({
      tvshowid: @argCheckOption('tvshowid', undefined)
      season: @argCheckOption('season', undefined)
      properties: @argFields(helpers.entities.getFields(API.fields, 'small'))
      limits: @argLimit()
      sort: @argSort("episode", "ascending")
      filter: @argCheckOption('filter', undefined)
    })
    parse: (resp, xhr) -> @getResult resp, 'episodes'

  ## Episode Custom collection, assumed passed an array of raw entity data.
  class KodiEntities.EpisodeCustomCollection extends App.KodiEntities.Collection
    model: KodiEntities.Episode

  ###
   Request Handlers.
  ###

  # Get a single episode
  App.reqres.setHandler "episode:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an episode collection
  App.reqres.setHandler "episode:entities", (options = {}) ->
    API.getCollection options

  ## Get an episode collection
  App.reqres.setHandler "episode:tvshow:entities", (tvshowid, season, options = {}) ->
    if tvshowid isnt 'all'
      options.tvshowid = tvshowid
      if season isnt 'all'
        options.season = season
    API.getCollection options

  ## Given an array of models, return as collection.
  App.reqres.setHandler "episode:build:collection", (items) ->
    new KodiEntities.EpisodeCustomCollection items