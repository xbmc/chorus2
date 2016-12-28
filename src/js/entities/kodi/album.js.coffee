@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    ## Get an albums fields.
    getAlbumFields: (type = 'small')->
      baseFields = ['thumbnail', 'playcount', 'artistid', 'artist', 'genre', 'albumlabel', 'year', 'dateadded', 'style']
      extraFields = ['fanart', 'mood', 'description', 'genreid', 'rating', 'type', 'theme']
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
      collection = new KodiEntities.AlbumCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

#      defaultOptions = {cache: true, expires: config.get('static', 'collectionCacheExpiry'), useNamedParameters: true}
#      options = _.extend defaultOptions, options
#      albums = new KodiEntities.AlbumCollection()
#      albums.fetch options
#      albums

  ###
   Models and collections.
  ###

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

  ## Albums collection
  class KodiEntities.AlbumCollection extends App.KodiEntities.Collection
    model: KodiEntities.Album
    methods: read: ['AudioLibrary.GetAlbums', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs({
      properties: @argFields(API.getAlbumFields('small'))
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
      filter: @argFilter()
    })
    parse: (resp, xhr) -> @getResult resp, 'albums'

  ###
   Request Handlers.
  ###

  ## Get a single album
  App.reqres.setHandler "album:entity", (id, options = {}) ->
    API.getAlbum id, options

  ## Get an album collection
  App.reqres.setHandler "album:entities", (options = {}) ->
    API.getAlbums options
