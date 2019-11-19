@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    fields:
      minimal: []
      small: ['thumbnail', 'mood', 'genre', 'style']
      full: ['fanart', 'born', 'formed', 'description', 'died', 'disbanded', 'yearsactive', 'instrument', 'musicbrainzartistid']

    ## Fetch a single artist
    getArtist: (id, options) ->
      artist = new App.KodiEntities.Artist()
      artist.set({artistid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')})
      artist.fetch options
      artist

    ## Fetch an artist collection.
    getArtists: (options) ->
      collection = new KodiEntities.ArtistCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

  ###
   Models and collections.
  ###

  ## Single artist model.
  class KodiEntities.Artist extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {artistid: 1, artist: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: {
      read: ['AudioLibrary.GetArtistDetails', 'artistid', 'properties']
    }
    parse: (resp, xhr) ->
      ## If fetched directly, look in artist details and mark as fully loaded
      obj = if resp.artistdetails? then resp.artistdetails else resp
      if resp.artistdetails?
        obj.fullyloaded = true
      @parseModel 'artist', obj, obj.artistid

  ## Artists collection
  class KodiEntities.ArtistCollection extends App.KodiEntities.Collection
    model: KodiEntities.Artist
    methods: read: ['AudioLibrary.GetArtists', 'albumartistsonly', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs
      albumartistsonly: config.getLocal 'albumArtistsOnly', true
      properties: @argFields helpers.entities.getFields(API.fields, 'small')
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
      filter: @argFilter()
    parse: (resp, xhr) -> @getResult resp, 'artists'

  ###
   Request Handlers.
  ###

  ## Get a single artist
  App.reqres.setHandler "artist:entity", (id, options = {}) ->
    API.getArtist id, options

  ## Get an artist collection
  App.reqres.setHandler "artist:entities", (options = {}) ->
    # If using filters, search all artists
    if options.filter and options.albumartistsonly isnt true
      options.albumartistsonly = false
    API.getArtists options

  ## Get full field/property list for entity
  App.reqres.setHandler "artist:fields", (type = 'full') ->
    helpers.entities.getFields(API.fields, type)