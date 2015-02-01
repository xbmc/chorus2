@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title']
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'resume', 'rating', 'year', 'file']
      full: ['fanart', 'plotoutline', 'studio', 'mpaa', 'cast', 'imdbnumber', 'runtime', 'streamdetails']

    ## Fetch a single entity
    getEntity: (id, options) ->
      entity = new App.KodiEntities.Movie()
      entity.set({movieid: parseInt(id), properties:  helpers.entities.getFields(API.fields, 'full')})
      entity.fetch options
      entity

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {reset: false} ## reset: true
      options = _.extend defaultOptions, options
      collection = new KodiEntities.MovieCollection()
      collection.fetch options
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
      @parseModel 'movie', obj, obj.movieid

  ## Movies collection
  class KodiEntities.MovieCollection extends App.KodiEntities.Collection
    model: KodiEntities.Movie
    methods: read: ['VideoLibrary.GetMovies', 'arg1', 'arg2', 'arg3']
    arg1: -> helpers.entities.getFields(API.fields, 'small')
    arg2: -> @argLimit()
    arg3: -> @argSort("title", "ascending")
    parse: (resp, xhr) -> resp.movies


  ## Filtered Movie collection
  class KodiEntities.MovieFilteredCollection extends KodiEntities.MovieCollection
    methods: read: ['VideoLibrary.GetMovies', 'arg1', 'arg2', 'arg3', 'arg4']
    arg4: -> @argFilter()

  ###
   Request Handlers.
  ###

  # Get a single movie
  App.reqres.setHandler "movie:entity", (id, options = {}) ->
    API.getEntity id, options

  ## Get an movie collection
  App.reqres.setHandler "movie:entities", (options = {}) ->
    API.getCollection options