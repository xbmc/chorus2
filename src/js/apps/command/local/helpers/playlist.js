// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {


  //# Playlist requires some player functionality but is also its
  //# own thing so it extends the player.
  return Api.PlayList = class PlayList extends Api.Player {

    //# Play an item.
    play(type, value, resume = 0) {
      return this.getSongs(type, value, songs => {
        return this.playCollection(songs);
      });
    }

    //# Queue an item.
    add(type, value) {
      return this.getSongs(type, value, songs => {
        return this.addCollection(songs);
      });
    }

    //# Play a collection of song models.
    playCollection(models) {
      models = this.itemsJson(models);
      //# TODO: Add logic for if something is already playing (like kodi controller)
      return this.clear(() => {
        return this.insertAndPlay(models, 0);
      });
    }

    //# Add a item to the end of the playlist
    addCollection(models) {
      models = this.itemsJson(models);
      return this.playlistSize(size => {
        return this.insert(models, size);
      });
    }

    //# Remove an item from the list
    remove(position, callback) {
      return this.getItems(collection => {
        const raw = this.itemsJson(collection);
        const ret = [];
        for (var pos in raw) {
          var item = raw[pos];
          if (parseInt(pos) !== parseInt(position)) {
            ret.push(item);
          }
        }
        return this.clear(() => {
          collection = this.addItems(ret);
          return this.doCallback(callback, collection);
        });
      });
    }

    //# Clear a playlist.
    clear(callback) {
      const collection = App.execute("localplayer:clear:entities");
      this.refreshPlaylistView();
      return this.doCallback(callback, collection);
    }

    //# Insert a song at a position models can be a sing model or an array. Expects raw json (not collection)
    insert(models, position = 0, callback) {
      return this.getItems(collection => {
        let model, ret;
        const raw = this.itemsJson(collection);
        if (raw.length === 0) {
          //# Empty list
          ret = _.flatten( [models] );
        } else if (parseInt(position) >= raw.length) {
          //# Adding to the end of a list
          ret = raw;
          for (model of _.flatten( [models] )) {
            ret.push(model);
          }
        } else {
          //# Insert in the middle of a list
          ret = [];
          for (var pos in raw) {
            var item = raw[pos];
            if (parseInt(pos) === parseInt(position)) {
              for (model of _.flatten( [models] )) {
                ret.push(model);
              }
            }
            ret.push(item);
          }
        }
        return this.clear(() => {
          collection = this.addItems(ret);
          return this.doCallback(callback, collection);
        });
      });
    }

    //# Add items to the end of a list
    addItems(items) {
      App.request("localplayer:item:add:entities", items);
      this.updatePlayingPosition(items);
      this.refreshPlaylistView();
      return items;
    }

    //# Get the songs in a collection based on type type/value.
    getSongs(type, value, callback) {
      //# If a single song.
      if (type === 'songid') {
        return App.request("song:byid:entities", [value], songs => {
          return this.doCallback(callback, songs.getRawCollection());
        });
      } else {
        //# Else it's a filtered collection (artist, album, etc)
        const songs = App.request("song:entities", {filter: helpers.global.paramObj(type, value)});
        return App.execute("when:entity:fetched", songs, () => {
          return this.doCallback(callback, songs.getRawCollection());
        });
      }
    }

    //# Get items in a playlist
    getItems(callback) {
      const collection = App.request("localplayer:get:entities");
      return this.doCallback(callback, collection);
    }

    //# If collection, normalise to JSON, if JSON pass through.
    itemsJson(collection) {
      const items = _.isArray(collection) ? collection : collection.toJSON();
      return items;
    }

    //# Insert a song at a position and play it
    insertAndPlay(models, position = 0, callback) {
      return this.insert(models, position, resp => {
        return this.playEntity('position', parseInt(position), {}, () => {
          return this.doCallback(callback, position);
        });
      });
    }

    //# Get the size of the current playlist
    playlistSize(callback) {
      return this.getItems(resp => {
        return this.doCallback(callback, resp.length);
      });
    }

    //# Refresh playlist
    refreshPlaylistView() {
      return App.execute("playlist:refresh", 'local', 'audio');
    }

    //# Move Item
    moveItem(media, id, position1, position2, callback) {
      return this.getItems(collection => {
        const raw = collection.getRawCollection();
        const item = raw[position1];
        return this.remove(position1, () => {
          return this.insert(item, position2, () => {
            return this.doCallback(callback, position2);
          });
        });
      });
    }

    //# After items in playlist have changed, this updates the playing position
    //# TODO: Make this less buggy, does weird things when tracks changed in party mode
    updatePlayingPosition(collection) {
      const stateObj = App.request("state:local");
      if (stateObj.isPlaying()) {
        const model = stateObj.getPlaying('item');
        if (model.uid) {
          let set = false;
          let pos = 0;
          const object = this.itemsJson(collection);
          for (var i in object) {
            var m = object[i];
            if (set === true) {
              continue;
            }
            if (m.uid === model.uid) {
              pos = parseInt(i);
              set = true;
            }
          }
          model.position = pos;
          stateObj.setPlaying('item', model);
          return stateObj.setPlaying('position', pos);
        }
      }
    }
  };
});
