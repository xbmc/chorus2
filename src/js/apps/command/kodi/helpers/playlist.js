/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Playlist requires some player functionality but is also its
//# own thing so it extends the player.
(function() {
  const Cls = (Api.PlayList = class PlayList extends Api.Player {
    static initClass() {

      this.prototype.commandNameSpace = 'Playlist';
    }

    //# Play an item. Rules:
    //# - If in the playlist already, play that item
    //# - If currently playing, insert it next and play
    //# - If not playing clear playlist, add and play
    //# - If resume > 0 will resume from that point
    play(type, value, model, resume = 0, callback) {
      // Get items in the playlist
      return this.getItems(currentPlaylist => {
        // If item is already in th playlist, play that
        const plItem = {type: type.replace('id', ''), id: value};
        const inPlaylist = currentPlaylist.items ? _.findWhere(currentPlaylist.items, plItem) : false;
        if (inPlaylist) {
          return this.playPosition(inPlaylist.position, resume, callback);
        } else {
          // Item needs to be added to playlist
          const stateObj = App.request("state:kodi");
          //# If playing, queue up next.
          if (stateObj.isPlaying(this.getPlayerName())) {
            const pos = currentPlaylist.items ? (stateObj.getPlaying('position') + 1) : 0;
            return this.insertAndPlay(type, value, pos, resume, callback);
          } else {
            return this.clear(() => {
              return this.insertAndPlay(type, value, 0, resume, callback);
            });
          }
        }
      });
    }

    //# Add a collection of models wrapper, will clear if not playing
    addCollection(collection, position = 0, callback) {
      const stateObj = App.request("state:kodi");
      //# If playing, queue up next.
      if (stateObj.isPlaying(this.getPlayerName())) {
        position = (stateObj.getPlaying('position') + 1);
        this.addCollectionItems(collection, position, callback);
      } else {
        this.clear(() => {
          return this.addCollectionItems(collection, position, callback);
        });
      }
      return position;
    }

    //# Add a collection of models
    addCollectionItems(collection, position = 0, callback) {
      App.execute("notification:show", t.gettext("Adding items to the queue"));
      const models = collection.getRawCollection();
      const player = this.getPlayer();
      const commands = [];
      //# build a set of commands so we can add all the models with one request.
      for (var i in models) {
        var model = models[i];
        var pos = parseInt(position) + parseInt(i);
        var type = model.type === 'file' ? 'file' : model.type + 'id';
        var params = [player, pos, this.paramObj(type, model[type])];
        commands.push({method: this.getCommand('Insert'), params});
      }
      return this.multipleCommands(commands, resp => {
        this.doCallback(callback, resp);
        return this.refreshPlaylistView();
      });
    }

    // Add a collection of models.
    playCollection(collection, position = 0) {
      let pos;
      return pos = this.addCollection(collection, position, resp => {
        this.playEntity('position', parseInt(pos), {}, () => {});
        return this.refreshPlaylistView();
      });
    }

    //# Add a item to the end of the playlist
    add(type, value) {
      return this.playlistSize(size => {
        return this.insert(type, value, size);
      });
    }

    //# Remove an item from the list
    remove(position, callback) {
      return this.singleCommand(this.getCommand('Remove'), [this.getPlayer(), parseInt(position)], resp => {
        this.refreshPlaylistView();
        return this.doCallback(callback, resp);
      });
    }

    //# Clear a playlist.
    clear(callback) {
      return this.singleCommand(this.getCommand('Clear'), [this.getPlayer()], resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Insert a song at a position
    insert(type, value, position = 0, callback) {
      return this.singleCommand(this.getCommand('Insert'), [this.getPlayer(), parseInt(position), this.paramObj(type,value)], resp => {
        this.refreshPlaylistView();
        return this.doCallback(callback, resp);
      });
    }

    //# Get items in a playlist
    getItems(callback) {
      return this.singleCommand(this.getCommand('GetItems'), [this.getPlayer(), ['title']], resp => {
        return this.doCallback(callback, this.parseItems(resp));
      });
    }

    //# Add position to each item in the playlist
    parseItems(resp) {
      if (resp.items) {
        resp.items = _.map(resp.items, function(item, idx) {
          item.position = parseInt(idx);
          return item;
        });
      }
      return resp;
    }

    //# Insert a song at a position and play it
    insertAndPlay(type, value, position = 0, resume = 0, callback) {
      return this.insert(type, value, position, resp => {
        return this.playPosition(position, resume, callback);
      });
    }

    //# Play a position in the playlist with optional resume
    playPosition(position = 0, resume = 0, callback) {
      return this.playEntity('position', parseInt(position), {}, () => {
        if (resume > 0) {
          // Seek to resume point if not 0. Setting option {resume: true} does not work :(
          App.execute("player:kodi:progress:update", resume);
        }
        return this.doCallback(callback);
      });
    }

    //# Get the size of the current playlist
    playlistSize(callback) {
      return this.getItems(resp => {
        const position = (resp.items != null) ?  resp.items.length : 0;
        return this.doCallback(callback, position);
      });
    }

    //# Refresh playlist
    refreshPlaylistView() {
      const wsActive = App.request("sockets:active");
      if (!wsActive) {
        return App.execute("playlist:refresh", 'kodi', this.playerName);
      }
    }

    //# Move Item
    moveItem(media, id, position1, position2, callback) {
      const idProp = media === 'file' ? 'file' : media + 'id';
      return this.singleCommand(this.getCommand('Remove'), [this.getPlayer(), parseInt(position1)], resp => {
        return this.insert(idProp, id, position2, () => {
          return this.doCallback(callback, position2);
        });
      });
    }
  });
  Cls.initClass();
  return Cls;
})());

