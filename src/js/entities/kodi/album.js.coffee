@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    ## Get an albums fields.
    getAlbumFields: (type = 'small')->
      baseFields = ['thumbnail', 'playcount', 'artistid', 'artist', 'genre', 'albumlabel', 'year', 'dateadded']
      extraFields = ['fanart', 'style', 'mood', 'description', 'genreid', 'rating']
      if type is 'full'
        fields = baseFields.concat( extraFields )
        fields
      else
        baseFields

    ## Fetch a single album
    getAlbum: (id, options) ->
      album = new App.KodiEntities.Album()
      album.set({albumid: parseInt(id), properties:  API.getAlbumFields('full')})
      album.fetch options
      album

    ## Fetch an album collection.
    getAlbums: (options) ->
      defaultOptions = {cache: true, expires: config.get('static', 'collectionCacheExpiry')}
      options = _.extend defaultOptions, options
      albums = new KodiEntities.AlbumCollection()
      albums.fetch options
      albums

    ## Fetch an album collection.
    getRecentlyAddedAlbums: (options) ->
      albums = new KodiEntities.AlbumRecentlyAddedCollection()
      albums.fetch options
      albums

    ## Fetch an album collection.
    getRecentlyPlayedAlbums: (options) ->
      albums = new KodiEntities.AlbumRecentlyPlayedCollection()
      albums.fetch options
      albums



  ## Single album model.
  class KodiEntities.Album extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {albumid: 1, album: ''})
      @parseFieldsToDefaults API.getAlbumFields('full'), fields
    methods: {
      read: ['AudioLibrary.GetAlbumDetails', 'albumid', 'properties']
    }
    arg2: API.getAlbumFields('full')
    parse: (resp, xhr) ->
      ## If fetched directly, look in album details and mark as fully loaded
      obj = if resp.albumdetails? then resp.albumdetails else resp
      if resp.albumdetails?
        obj.fullyloaded = true
      @parseModel 'album', obj, obj.albumid

  ## albums collection
  class KodiEntities.AlbumCollection extends App.KodiEntities.Collection
    model: KodiEntities.Album
    methods: {
      read: ['AudioLibrary.GetAlbums', 'arg1', 'arg2', 'arg3', 'arg4']
    }
    arg1: -> API.getAlbumFields('small')
    arg2: -> @argLimit()
    arg3: -> @argSort("title", "ascending")
    arg3: -> @argFilter()
    parse: (resp, xhr) -> @getResult resp, 'albums'

  ## albums recently added collection
  class KodiEntities.AlbumRecentlyAddedCollection extends App.KodiEntities.Collection
    model: KodiEntities.Album
    methods: {
      read: ['AudioLibrary.GetRecentlyAddedAlbums', 'arg1', 'arg2']
    }
    arg1: -> API.getAlbumFields('small')
    arg2: -> @argLimit(0, 21)
    parse: (resp, xhr) -> @getResult resp, 'albums'

  ## albums recently played collection
  class KodiEntities.AlbumRecentlyPlayedCollection extends App.KodiEntities.Collection
    model: KodiEntities.Album
    methods: {
      read: ['AudioLibrary.GetRecentlyPlayedAlbums', 'arg1', 'arg2']
    }
    arg1: -> API.getAlbumFields('small')
    arg2: -> @argLimit(0, 21)
    parse: (resp, xhr) -> @getResult resp, 'albums'



  ## Get a single album
  App.reqres.setHandler "album:entity", (id, options = {}) ->
    API.getAlbum id, options

  ## Get an album collection
  App.reqres.setHandler "album:entities", (options = {}) ->
    API.getAlbums options

  ## Get a recently added album collection
  App.reqres.setHandler "album:recentlyadded:entities", (options = {}) ->
    API.getRecentlyAddedAlbums options

  ## Get a recently played album collection
  App.reqres.setHandler "album:recentlyplayed:entities", (options = {}) ->
    API.getRecentlyPlayedAlbums options

  ## Get a search collection
  App.commands.setHandler "album:search:entities", (query, limit, callback) ->
    collection = API.getAlbums {}
    App.execute "when:entity:fetched", collection, =>
      filtered = new App.Entities.Filtered(collection)
      filtered.filterByString('label', query)
      if callback
        callback filtered