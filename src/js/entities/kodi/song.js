// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  var API = {

    songsByIdMax: 50, //# Jsonrpc freaks out if too many in the batch!

    fields: {
      minimal: ['title', 'file'],
      small: ['thumbnail', 'artist', 'artistid', 'album', 'albumid', 'lastplayed', 'track', 'year', 'duration'],
      full: ['fanart', 'genre', 'disc', 'rating', 'albumartist']
    },

    //# Fetch a single song
    getSong(id, options) {
      const artist = new App.KodiEntities.Song();
      artist.set({songid: parseInt(id), properties: helpers.entities.getFields(API.fields, 'full')});
      artist.fetch(options);
      return artist;
    },

    //# Fetch a song collection.
    getFilteredSongs(options) {
      const songs = new KodiEntities.SongFilteredCollection();
      songs.fetch(helpers.entities.buildOptions(options));
      return songs;
    },

    //# Retrieve collection of songs by type and ids, type can be albumid, artistid or songid
    //# ids is an array of ids for the provided type. Returns song collection
    getCustomSongsCollection(type, ids, callback) {
      if (type === 'songid') {
        return this.getSongsByIds(ids, -1, callback);
      } else {
        let items = [];
        const options = {filter: {}};
        let req = 0;
        return (() => {
          const result = [];
          for (var i in ids) {
            var id = ids[i];
            options.filter[type] = id;
            //# On success, concat models into items and if last request then callback
            options.success = function(collection) {
              items = items.concat(collection.toJSON());
              req++;
              if (req === ids.length) {
                collection = new KodiEntities.SongCustomCollection(items);
                return callback(collection);
              }
            };
            //# Get each set of songs
            result.push(this.getFilteredSongs(options));
          }
          return result;
        })();
      }
    },

    //# Turn a collection of songs, e.g. all artist songs
    //# into an array of album song collections keyed by albumid.
    parseSongsToAlbumSongs(songs) {
      const songsRaw = songs.getRawCollection();
      const parsedRaw = {};
      let collections = [];
      //# Parse the songs into sets.
      for (var song of songsRaw) {
        if (!parsedRaw[song.albumid]) {
          parsedRaw[song.albumid] = [];
        }
        parsedRaw[song.albumid].push(song);
      }
      //# Turn the sets into collections.
      for (var albumid in parsedRaw) {
        var songSet = parsedRaw[albumid];
        var year = songSet[0].year ? songSet[0].year : 0;
        collections.push({
          songs: new KodiEntities.SongCustomCollection(songSet),
          albumid: parseInt(albumid),
          sort: (0 - parseInt(year))
        });
      }
      collections = _.sortBy(collections, 'sort');
      return collections;
    },

    //# Get a list of songs via an array of ids only, we don't use Backbone.jsonrpc for this
    //# as we are doing multiple commands. Specific sets are stored in cache.
    getSongsByIds(songIds = [], max = -1, callback) {
      let collection;
      const commander = App.request("command:kodi:controller", 'auto', 'Commander');
      songIds = this.getLimitIds(songIds, max);
      const cacheKey = 'songs-' + songIds.join('-');
      const items = [];
      const cache = helpers.cache.get(cacheKey, false);
      if (cache) {
        //# Cache hit
        collection = new KodiEntities.SongCustomCollection(cache);
        if (callback) {
          callback(collection);
        }
      } else {
        //# No cache
        const model = new KodiEntities.Song();
        const commands = [];
        for (var id of songIds) {
          commands.push({method: 'AudioLibrary.GetSongDetails', params: [id, helpers.entities.getFields(API.fields, 'small')] });
        }
        if (commands.length > 0) {
          commander.multipleCommands(commands, resp => {
            for (var item of _.flatten([resp])) {
              items.push(model.parseModel('song', item.songdetails, item.songdetails.songid));
            }
            helpers.cache.set(cacheKey, items);
            collection = new KodiEntities.SongCustomCollection(items);
            if (callback) {
              return callback(collection);
            }
          });
        }
      }
      return collection;
    },

    //# reduce a set of song ids to max allowed
    getLimitIds(ids, max) {
      max = max === -1 ? this.songsByIdMax : max;
      const ret = [];
      for (var i in ids) {
        var id = ids[i];
        if (i < max) {
          ret.push(id);
        }
      }
      return ret;
    }
  };


  //# Single song model.
  let Cls = (KodiEntities.Song = class Song extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['AudioLibrary.GetSongDetails', 'songid', 'properties']};
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {songid: 1, artist: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      //# If fetched directly, look in artist details and mark as fully loaded
      const obj = (resp.songdetails != null) ? resp.songdetails : resp;
      if (resp.songdetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('song', obj, obj.songid);
    }
  });
  Cls.initClass();

  //# Song Filtered collection
  Cls = (KodiEntities.SongFilteredCollection = class SongFilteredCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Song;
      this.prototype.methods = {read: ['AudioLibrary.GetSongs', 'properties', 'limits', 'sort', 'filter']};
    }
    args() { return this.getArgs({
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      limits: this.argLimit(),
      sort: this.argSort("track", "ascending"),
      filter: this.argFilter()
    }); }
    parse(resp, xhr) { return this.getResult(resp, 'songs'); }
  });
  Cls.initClass();

  //# Song Custom collection, assumed passed an array of raw entity data.
  Cls = (KodiEntities.SongCustomCollection = class SongCustomCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Song;
    }
  });
  Cls.initClass();

  //# Song search index collection (absolute minimal fields).
  //# TODO: Now we are using named params, this can probably be removed
  Cls = (KodiEntities.SongSearchIndexCollection = class SongSearchIndexCollection extends KodiEntities.SongFilteredCollection {
    static initClass() {
      this.prototype.methods = {read: ['AudioLibrary.GetSongs']};
    }
  });
  Cls.initClass();


  //# Get a single song.
  App.reqres.setHandler("song:entity", (id, options = {}) => API.getSong(id, options));

  //# Get a song collection - Filters are a must!
  App.reqres.setHandler("song:entities", (options = {}) => API.getFilteredSongs(options));

  //# Get a custom song collection (albums, artists, songs).
  App.reqres.setHandler("song:custom:entities", (type, ids, callback) => API.getCustomSongsCollection(type, ids, callback));

  //# Given an array of models, return as collection.
  App.reqres.setHandler("song:build:collection", items => new KodiEntities.SongCustomCollection(items));

  //# Get a filtered song collection.
  App.reqres.setHandler("song:byid:entities", (songIds = [], callback) => API.getSongsByIds(songIds, -1, callback));

  //# Parse a song collection into albums
  App.reqres.setHandler("song:albumparse:entities", songs => API.parseSongsToAlbumSongs(songs));

  //# Get full field/property list for entity
  return App.reqres.setHandler("song:fields", (type = 'full') => helpers.entities.getFields(API.fields, type));
});
