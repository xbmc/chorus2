@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    ## Get an artists fields.
    getArtistFields: (type = 'small')->
      baseFields = ['thumbnail', 'mood', 'genre', 'style']
      extraFields = ['fanart', 'born', 'formed', 'description']
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
      defaultOptions = {cache: true}
      options = _.extend defaultOptions, options
      ## try cache first.
      artists = helpers.cache.get "artist:entities"
      if artists is false or options.reset is true
        artists = new KodiEntities.ArtistCollection()
        artists.fetch options
      helpers.cache.set "artist:entities", artists
      artists


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


  ## artists collection
  class KodiEntities.ArtistCollection extends App.KodiEntities.Collection
    model: KodiEntities.Artist
    methods: {
      read: ['AudioLibrary.GetArtists', 'arg1', 'arg2', 'arg3', 'arg4']
    }
    arg1: ->
      config.get 'static', 'albumAtristsOnly', true
    arg2: -> API.getArtistFields('small')
    arg3: -> @argLimit()
    arg4: -> @argSort("artist", "ascending")
    parse: (resp, xhr) -> @getResult resp, 'artists'


  ## Get a single artist
  App.reqres.setHandler "artist:entity", (id, options = {}) ->
    API.getArtist id, options


  ## Get an artist collection
  App.reqres.setHandler "artist:entities", (options = {}) ->
    API.getArtists options

  ## Get a search collection
  App.commands.setHandler "artist:search:entities", (query, callback) ->
    collection = API.getArtists {}
    App.execute "when:entity:fetched", collection, =>
      filtered = new App.Entities.Filtered(collection)
      filtered.filterByString('label', query)
      if callback
        callback filtered