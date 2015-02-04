@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  API =

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
      songs = new KodiEntities.SongFilteredCollection()
      songs.fetch options
      songs

    ## Turn a collection of songs, eg. all artist songs
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


  ## Get a single song.
  App.reqres.setHandler "song:entity", (id, options = {}) ->
    API.getSong id, options

  ## Get a filtered song collection.
  App.reqres.setHandler "song:filtered:entities", (options = {}) ->
    API.getFilteredSongs options

  ## Parse a song collection into albums
  App.reqres.setHandler "song:albumparse:entities", (songs) ->
    API.parseSongsToAlbumSongs songs