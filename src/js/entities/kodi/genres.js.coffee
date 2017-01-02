@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title']
      small: ['thumbnail']
      full: []

    ## Fetch a single entity, requires a channel collection passed.
    getEntity: (collection, genre) ->
      collection.findWhere({title: genre})

    ## Fetch an entity collection.
    getCollection: (type, options) ->
      collection = new KodiEntities.GenreAudioCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

  ###
   Models and collections.
  ###

  ## Single Genre model.
  class KodiEntities.Genre extends App.KodiEntities.Model
    defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), {}
    parse: (obj, xhr) ->
      obj.fullyloaded = true
      obj.url = 'music/genre/' + encodeURIComponent(obj.title)
      obj

  ## Genres audio collection
  class KodiEntities.GenreAudioCollection extends App.KodiEntities.Collection
    model: KodiEntities.Genre
    methods: read: ['AudioLibrary.GetGenres', 'properties', 'limits', 'sort']
    args: -> @getArgs({
      properties: helpers.entities.getFields(API.fields, 'small')
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
    })
    parse: (resp, xhr) ->
      @getResult resp, 'genres'

  ###
   Request Handlers.
  ###

  # Get a single genre
  App.reqres.setHandler "genre:entity", (collection, genre) ->
    API.getEntity collection, genre,

  ## Get a genre collection
  App.reqres.setHandler "genre:entities", (type = 'audio', options = {}) ->
    API.getCollection type, options
