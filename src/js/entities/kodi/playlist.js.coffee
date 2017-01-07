@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    fields:
      minimal: ['title', 'thumbnail', 'file']
      small: ['artist', 'genre', 'year', 'rating', 'album', 'track', 'duration', 'playcount', 'dateadded', 'episode', 'artistid', 'albumid', 'tvshowid']
      full: ['fanart']

    ## Types that can be thumbed up
    canThumbsUp: ['song', 'movie', 'episode']

    ## Fetch an entity collection.
    getCollection: (options) ->
      defaultOptions = {cache: false, useNamedParameters: true}
      options = _.extend defaultOptions, options
      collection = new KodiEntities.PlaylistCollection()
      collection.fetch options
      collection

    ## Attempt to get the type of a playlist item by parsing the properties
    getType: (item, media) ->
      type = 'file'
      if item.id isnt undefined and item.id isnt ''
        if media is 'audio'
          type = 'song'
        else if media is 'video'
          if item.episode isnt ''
            type = 'episode'
          else
            type = 'movie'
      type

    ## Enrich the playlist item with as much extra data as possible.
    parseItems: (items, options) ->
      for i, item of items
        item.position = parseInt(i)
        items[i] = @parseItem item, options
      items

    parseItem: (item, options) ->
      item.playlistid = options.playlistid
      item.media = options.media
      item.player = 'kodi'
      if not item.type or item.type is 'unknown'
        item.type = API.getType(item, options.media)
      if item.type is 'file'
        item.id = item.file
      item.uid = helpers.entities.createUid(item)
      item.canThumbsUp = helpers.global.inArray(item.type, API.canThumbsUp)
      item.thumbsUp = false
      item


  ###
   Models and collections.
  ###

  ## Single Playlist model.
  class KodiEntities.PlaylistItem extends App.KodiEntities.Model
    idAttribute: "position"
    defaults: ->
      fields = _.extend(@modelDefaults, {position: 0})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    parse: (resp, xhr) ->
      resp.fullyloaded = true
      model = @parseModel resp.type, resp, resp.id
      model.url = helpers.url.playlistUrl model
      model

  ## Playlists collection
  class KodiEntities.PlaylistCollection extends App.KodiEntities.Collection
    model: KodiEntities.PlaylistItem
    methods: read: ['Playlist.GetItems', 'playlistid', 'properties', 'limits']
    args: -> @getArgs
      playlistid: @argCheckOption('playlistid', 0)
      properties: @argFields(helpers.entities.getFields(API.fields, 'small'))
      limits: @argLimit()
    parse: (resp, xhr) ->
      items = @getResult resp, 'items'
      API.parseItems(items, @options)

  ###
   Request Handlers.
  ###

  ## Get an playlist collection
  App.reqres.setHandler "playlist:kodi:entities", (media = 'audio') ->
    playlist = App.request "command:kodi:controller", media, 'PlayList'
    options = {}
    options.media = media
    options.playlistid = playlist.getPlayer()
    collection = API.getCollection options
    collection.sortCollection('position', 'asc')
    collection

  ## Expose the Api object for now-playing usage.
  App.reqres.setHandler "playlist:kodi:entity:api", ->
    API