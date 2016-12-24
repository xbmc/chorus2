@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

    songsByIdMax: 50 ## Jsonrpc freaks out if too many in the batch!

    fields:
      minimal: ['title', 'file']
      small: ['thumbnail', 'artist', 'artistid', 'album', 'albumid', 'lastplayed', 'track', 'year', 'duration']
      full: ['fanart', 'genre', 'style', 'mood', 'born', 'formed', 'description', 'lyrics']

    ## Fetch a single song
    getSong: (id, options) ->
      artist = new App.KodiEntities.Song()
      artist.set({songid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')})
      artist.fetch options
      artist

    ## Fetch an song collection.
    getFilteredSongs: (options) ->
      defaultOptions = {cache: true}
      options = _.extend defaultOptions, options
      if options.indexOnly
        options.expires = config.getLocal 'searchIndexCacheExpiry', 86400
        songs = new KodiEntities.SongSearchIndexCollection()
      else
        songs = new KodiEntities.SongFilteredCollection()
      songs.fetch options
      songs

    ## Retrieve collection of songs by type and ids, type can be albumid, artistid or songid
    ## ids is an array of ids for the provided type. Returns song collection
    getCustomSongsCollection: (type, ids, callback) ->
      if type is 'songid'
        @getSongsByIds ids, -1, callback
      else
        items = []
        options = {filter: {}}
        req = 0
        for i, id of ids
          options.filter[type] = id
          ## On success, concat models into items and if last request then callback
          options.success = (collection) ->
            items = items.concat(collection.toJSON())
            req++
            if req is ids.length
              collection = new KodiEntities.SongCustomCollection items
              callback(collection)
          ## Get each set of songs
          @getFilteredSongs options

    ## Turn a collection of songs, e.g. all artist songs
    ## into an array of album song collections keyed by albumid.
    parseSongsToAlbumSongs: (songs) ->
      songsRaw = songs.getRawCollection()
      parsedRaw = {}
      collections = {}
      ## Parse the songs into sets.
      for song in songsRaw
        if not parsedRaw[song.albumid]
          parsedRaw[song.albumid] = []
        parsedRaw[song.albumid].push song
      ## Turn the sets into collections.
      for albumid, songSet of parsedRaw
        collections[albumid] = new KodiEntities.SongCustomCollection songSet
      collections

    ## Get a list of songs via an array of ids only, we don't use Backbone.jsonrpc for this
    ## as we are doing multiple commands. Specific sets are stored in cache.
    getSongsByIds: (songIds = [], max = -1, callback) ->
      commander = App.request "command:kodi:controller", 'auto', 'Commander'
      songIds = @getLimitIds songIds, max
      cacheKey = 'songs-' + songIds.join('-')
      items = []
      cache = helpers.cache.get cacheKey, false
      if cache
        ## Cache hit
        collection = new KodiEntities.SongCustomCollection cache
        if callback
          callback collection
      else
        ## No cache
        model = new KodiEntities.Song()
        commands = []
        for id in songIds
          commands.push {method: 'AudioLibrary.GetSongDetails', params: [id, helpers.entities.getFields(API.fields, 'small')] }
        if commands.length > 0
          commander.multipleCommands commands, (resp) =>
            for item in _.flatten [resp]
              items.push model.parseModel('song', item.songdetails, item.songdetails.songid)
            helpers.cache.set cacheKey, items
            collection = new KodiEntities.SongCustomCollection items
            if callback
              callback collection
      collection

    ## reduce a set of song ids to max allowed
    getLimitIds: (ids, max) ->
      max = if max is -1 then @songsByIdMax else max
      ret = []
      for i, id of ids
        if i < max
          ret.push id
      ret


  ## Single song model.
  class KodiEntities.Song extends App.KodiEntities.Model
    defaults: ->
      fields = _.extend(@modelDefaults, {songid: 1, artist: ''})
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), fields
    methods: read: ['AudioLibrary.GetSongDetails', 'songidid', 'properties']
    parse: (resp, xhr) ->
      ## If fetched directly, look in artist details and mark as fully loaded
      obj = if resp.songdetails? then resp.songdetails else resp
      if resp.songdetails?
        obj.fullyloaded = true
      @parseModel 'song', obj, obj.songid


  ## Song Filtered collection
  class KodiEntities.SongFilteredCollection extends App.KodiEntities.Collection
    model: KodiEntities.Song
    methods: read: ['AudioLibrary.GetSongs', 'arg1', 'arg2', 'arg3', 'arg4']
    arg1: -> helpers.entities.getFields(API.fields, 'small')
    arg2: -> @argLimit()
    arg3: -> @argSort("track", "ascending")
    arg4: -> @argFilter()
    parse: (resp, xhr) -> @getResult resp, 'songs'


  ## Song Custom collection, assumed passed an array of raw entity data.
  class KodiEntities.SongCustomCollection extends App.KodiEntities.Collection
    model: KodiEntities.Song


  ## Song search index collection (absolute minimal fields).
  class KodiEntities.SongSearchIndexCollection extends KodiEntities.SongFilteredCollection
    methods: read: ['AudioLibrary.GetSongs']


  ## Get a single song.
  App.reqres.setHandler "song:entity", (id, options = {}) ->
    API.getSong id, options

  ## Get a filtered song collection.
  App.reqres.setHandler "song:filtered:entities", (options = {}) ->
    API.getFilteredSongs options

  ## Get a custom song collection (albums, artists, songs).
  App.reqres.setHandler "song:custom:entities", (type, ids, callback) ->
    API.getCustomSongsCollection type, ids, callback

  ## Given an array of models, return as collection.
  App.reqres.setHandler "song:build:collection", (items) ->
    new KodiEntities.SongCustomCollection items

  ## Get a filtered song collection.
  App.reqres.setHandler "song:byid:entities", (songIds = [], callback) ->
    API.getSongsByIds songIds, -1, callback

  ## Parse a song collection into albums
  App.reqres.setHandler "song:albumparse:entities", (songs) ->
    API.parseSongsToAlbumSongs songs

  ## Get the songs matching a search query.
  App.commands.setHandler "song:search:entities", (query, limit, callback) ->
    allLimit = 20
    options = helpers.global.paramObj 'indexOnly', true
    collection = API.getFilteredSongs options
    App.execute "when:entity:fetched", collection, =>
      filtered = new App.Entities.Filtered(collection)
      filtered.filterByString('label', query)
      ids = filtered.pluck 'songid'
      count = if limit is 'limit' then allLimit else -1
      API.getSongsByIds ids, count, (loaded) ->
        if ids.length > allLimit and limit is 'limit'
          loaded.more = true
        if callback
          callback loaded
    collection
