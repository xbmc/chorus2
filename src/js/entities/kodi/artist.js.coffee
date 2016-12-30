@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    ## Get an artists fields.
    getArtistFields: (type = 'small')->
      baseFields = ['thumbnail', 'mood', 'genre', 'style']
      extraFields = ['fanart', 'born', 'formed', 'description', 'died', 'disbanded', 'yearsactive', 'instrument']
      if type is 'full'
        fields = baseFields.concat( extraFields )
        fields
      else
        baseFields

    ## Fetch a single artist
    getArtist: (id, options) ->
      artist = new App.KodiEntities.Artist()
      artist.set({artistid: parseInt(id), properties:  API.getArtistFields('full')})
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
      @parseFieldsToDefaults API.getArtistFields('full'), fields

    methods: {
      read: ['AudioLibrary.GetArtistDetails', 'artistid', 'properties']
    }
    arg2: API.getArtistFields('full')
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
      properties: @argFields(API.getArtistFields('small'))
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
    API.getArtists options
