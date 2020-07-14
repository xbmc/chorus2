@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title', 'art']
      small: ['playcount', 'lastplayed', 'dateadded', 'resume', 'rating', 'year', 'file', 'genre', 'writer', 'director', 'cast', 'set', 'studio', 'mpaa', 'tag']
      full: ['plotoutline', 'imdbnumber', 'runtime', 'streamdetails', 'plot', 'trailer', 'sorttitle', 'originaltitle', 'country']

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.Movie()
      entity.set({movieid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      collection = new KodiEntities.MovieCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

  ###
   Models and collections.
  ###

  ## Single Movie model.
  class KodiEntities.Movie extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {movieid: 1, movie: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: read: ['VideoLibrary.GetMovieDetails', 'movieid', 'properties']
    parse: (resp, xhr) ->
      obj = if resp.moviedetails? then resp.moviedetails else resp
      if resp.moviedetails?
        obj.fullyloaded = true
      obj.unwatched = if obj.playcount > 0 then 0 else 1
      @parseModel 'movie', obj, obj.movieid

  ## Movies collection
  class KodiEntities.MovieCollection extends App.KodiEntities.Collection
    model: KodiEntities.Movie
    methods: read: ['VideoLibrary.GetMovies', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs
      properties: @argFields(helpers.entities.getFields(API.fields, 'small'))
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
      filter: @argFilter()
    parse: (resp, xhr) -> @getResult resp, 'movies'

  ## Movie Custom collection, assumed passed an array of raw entity data.
  class KodiEntities.MovieCustomCollection extends App.KodiEntities.Collection
    model: KodiEntities.Movie

  ###
   Request Handlers.
  ###

  # Get a single movie
  App.reqres.setHandler "movie:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an movie collection
  App.reqres.setHandler "movie:entities", (options = {}) ->
    API.getCollection options

  ## Given an array of models, return as collection.
  App.reqres.setHandler "movie:build:collection", (items) ->
    new KodiEntities.MovieCustomCollection items

  ## Get full field/property list for entity
  App.reqres.setHandler "movie:fields", (type = 'full') ->
    helpers.entities.getFields(API.fields, type)
