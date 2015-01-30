@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    ## Get an artists fields.
    getFields: (type = 'small')->
      baseFields = ['thumbnail']
      extraFields = ['fanart', 'genre', 'style', 'mood', 'born', 'formed', 'description']
      if type is 'full'
        fields = baseFields.concat( extraFields )
        fields
      else
        baseFields

    ## Fetch a single artist
    getArtist: (id, options) ->
      artist = new App.KodiEntities.Artist()
      artist.set({artistid: id, properties:  API.getFields('full')})
      artist.fetch options

    ## Fetch an artist collection.
    getArtists: (options) ->
      artists = new KodiEntities.ArtistCollection()
      defaultOptions = reset: true
      options = _.extend defaultOptions, options
      if callback?
        options callback
      artists.fetch options


  ## Single artist model.
  class KodiEntities.Artist extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {artistid: 1, artist: ''})
      for field in API.getFields('full')
        fields[field] = ''
      fields

    methods: {
      read: ['AudioLibrary.GetArtistDetails', 'artistid', 'properties']
    }
    arg2: API.getFields('full')
    parse: (resp, xhr) ->
      ## If fetched directly, look in artist details and mark as fully loaded
      obj = if resp.artistdetails? then resp.artistdetails else resp
      if resp.artistdetails?
        obj.fullyloaded = true
      obj.id = obj.artistid
      obj


  ## artists collection
  class KodiEntities.ArtistCollection extends App.KodiEntities.Collection
    model: KodiEntities.Artist
    methods: {
      read: ['AudioLibrary.GetArtists', 'arg1', 'arg2', 'arg3', 'arg4']
    }
    arg1: ->
      console.log this
      true
    arg2: ->
      API.getFields('small')
    arg3: ->
      @argLimit()
    arg4: ->
      @argSort("artist", "descending")
    parse: (resp, xhr) ->
      resp.artists


  ## Get a single artist
  App.commands.setHandler "artist:entity", (id, options = {}) ->
    API.getArtist id, options


  ## Get an artist collection
  App.commands.setHandler "artist:entities", (options = {}) ->
    API.getArtists options