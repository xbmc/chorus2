@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    fields:
      minimal: ['thumbnail']
      small: ['playcount', 'artistid', 'artist', 'genre', 'albumlabel', 'year', 'dateadded', 'style']
      full: ['fanart', 'mood', 'description', 'genreid', 'rating', 'type', 'theme']

    ## Fetch a single album
    getAlbum: (id, options) ->
      album = new App.KodiEntities.Album()
      album.set({albumid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')})
      album.fetch options
      album

    ## Fetch an album collection.
    getAlbums: (options) ->
      collection = new KodiEntities.AlbumCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

  ###
   Models and collections.
  ###

  ## Single album model.
  class KodiEntities.Album extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {albumid: 1, album: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: {
      read: ['AudioLibrary.GetAlbumDetails', 'albumid', 'properties']
    }
    parse: (resp, xhr) ->
      ## If fetched directly, look in album details and mark as fully loaded
      obj = if resp.albumdetails? then resp.albumdetails else resp
      obj.title = obj.label
      if resp.albumdetails?
        obj.fullyloaded = true
      @parseModel 'album', obj, obj.albumid

  ## Albums collection
  class KodiEntities.AlbumCollection extends App.KodiEntities.Collection
    model: KodiEntities.Album
    methods: read: ['AudioLibrary.GetAlbums', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs
      properties: @argFields helpers.entities.getFields(API.fields, 'small')
      limits: @argLimit()
      sort: @argSort 'title', 'ascending'
      filter: @argFilter()
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

  ## Get full field/property list for entity
  App.reqres.setHandler "album:fields", (type = 'full') ->
    helpers.entities.getFields(API.fields, type)