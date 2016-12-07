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
      defaultOptions = {cache: false, expires: config.get('static', 'collectionCacheExpiry')}
      options = _.extend defaultOptions, options
      if options.season is 'all'
        collection = new KodiEntities.EpisodeAllCollection()
      else
        collection = new KodiEntities.EpisodeCollection()
      collection.fetch options
      collection

    ## Fetch a recently added entity collection.
    getRecentlyAddedCollection: (options) ->
      collection = new KodiEntities.EpisodeRecentlyAddedCollection()
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
    methods: read: ['VideoLibrary.GetEpisodes', 'arg1', 'arg2', 'arg3']
    arg1: ->@argCheckOption('tvshowid', 0)
    arg2: ->@argCheckOption('season', 0)
    arg3: -> helpers.entities.getFields(API.fields, 'small')
    arg4: -> @argLimit()
    arg5: -> @argSort("episode", "ascending")
    parse: (resp, xhr) -> @getResult resp, 'episodes'

  ## All Episodes collection (for adding to playlist)
  class KodiEntities.EpisodeAllCollection extends App.KodiEntities.Collection
    model: KodiEntities.Episode
    methods: read: ['VideoLibrary.GetEpisodes', 'arg1']
    arg1: ->@argCheckOption('tvshowid', 0)
    parse: (resp, xhr) -> @getResult resp, 'episodes'

  ## Episodes collection
  class KodiEntities.EpisodeRecentlyAddedCollection extends App.KodiEntities.Collection
    model: KodiEntities.Episode
    methods: read: ['VideoLibrary.GetRecentlyAddedEpisodes', 'arg1', 'arg2']
    arg1: -> helpers.entities.getFields(API.fields, 'small')
    arg2: -> @argLimit()
    parse: (resp, xhr) -> @getResult resp, 'episodes'


  ###
   Request Handlers.
  ###

  # Get a single episode
  App.reqres.setHandler "episode:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an episode collection
  App.reqres.setHandler "episode:entities", (tvshowid, season, options = {}) ->
    options.tvshowid = tvshowid
    options.season = season
    API.getCollection options

  ## Get a recently added episode collection
  App.reqres.setHandler "episode:recentlyadded:entities", (options = {}) ->
    API.getRecentlyAddedCollection options