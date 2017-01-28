@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    fields:
      minimal: ['title']
      small: ['thumbnail', 'file', 'genre', 'artist', 'year', 'playcount', 'dateadded', 'streamdetails', 'album', 'resume', 'director', 'rating']
      full: ['fanart', 'studio', 'plot', 'track', 'tag']

    ## Fetch a single artist
    getVideo: (id, options) ->
      artist = new App.KodiEntities.MusicVideo()
      artist.set({musicvideoid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')})
      artist.fetch options
      artist

    ## Fetch an artist collection.
    getVideos: (options) ->
      collection = new KodiEntities.MusicVideoCollection()
      collection.fetch helpers.entities.buildOptions(options)
      collection

  ###
   Models and collections.
  ###

  ## Single video model.
  class KodiEntities.MusicVideo extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {musicvideoid: 1, title: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: {
      read: ['VideoLibrary.GetMusicVideoDetails', 'musicvideoid', 'properties']
    }
    parse: (resp, xhr) ->
      obj = if resp.musicvideodetails? then resp.musicvideodetails else resp
      if resp.musicvideodetails?
        obj.fullyloaded = true
      @parseModel 'musicvideo', obj, obj.musicvideoid

  ## Video collection
  class KodiEntities.MusicVideoCollection extends App.KodiEntities.Collection
    model: KodiEntities.MusicVideo
    methods: read: ['VideoLibrary.GetMusicVideos', 'properties', 'limits', 'sort', 'filter']
    args: -> @getArgs
      properties: @argFields helpers.entities.getFields(API.fields, 'full')
      limits: @argLimit()
      sort: @argSort('title', 'ascending')
      filter: @argFilter()
    parse: (resp, xhr) -> @getResult resp, 'musicvideos'

  ## Video Custom collection, assumed passed an array of raw entity data.
  class KodiEntities.MusicVideoCustomCollection extends App.KodiEntities.Collection
    model: KodiEntities.MusicVideo


  ###
   Request Handlers.
  ###

  ## Get a single video
  App.reqres.setHandler "musicvideo:entity", (id, options = {}) ->
    API.getVideo id, options

  ## Get an video collection
  App.reqres.setHandler "musicvideo:entities", (options = {}) ->
    API.getVideos options

  ## Get full field/property list for entity
  App.reqres.setHandler "musicvideo:fields", (type = 'full') ->
    helpers.entities.getFields(API.fields, type)

  ## Given an array of models, return as collection.
  App.reqres.setHandler "musicvideo:build:collection", (items) ->
    new KodiEntities.MusicVideoCustomCollection items