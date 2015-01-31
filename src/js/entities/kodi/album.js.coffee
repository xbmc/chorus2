@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    ## Get an albums fields.
    getAlbumFields: (type = 'small')->
      baseFields = ['thumbnail', 'playcount', 'artistid', 'artist', 'genre', 'albumlabel', 'year']
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
      defaultOptions = {reset: false} ## reset: true
      options = _.extend defaultOptions, options
      ## try cache first.
      albums = helpers.cache.get "album:entities"
      if albums is false or options.reset is true
        albums = new KodiEntities.AlbumCollection()
        albums.fetch options
      helpers.cache.set "album:entities", albums
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
    arg1: ->
      API.getAlbumFields('small')
    arg2: ->
      @argLimit()
    arg3: ->
      @argSort("album", "ascending")
    arg3: ->
      @argFilter()
    parse: (resp, xhr) ->
      resp.albums


  ## Get a single album
  App.reqres.setHandler "album:entity", (id, options = {}) ->
    API.getAlbum id, options


  ## Get an album collection
  App.reqres.setHandler "album:entities", (options = {}) ->
    API.getAlbums options