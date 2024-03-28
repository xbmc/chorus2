/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp.LocalParty", function(LocalParty, App, Backbone, Marionette, $, _) {

  const API = {

    getController() {
      return new LocalParty.Manager();
    }
  };

  //# Local playlist Partymode.
  LocalParty.Manager = class Manager extends App.Controllers.Base {

    //# Init
    initialize(options) {
      this.stateObj = App.request("state:local");
      return this.localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
    }

    //# Get the list
    fillGlasses(callback) {
      // Set state to partymode.
      this.stateObj.setPlaying('partymode', true);
      // Get 10 songs
      return this.getSongs(10, collection => {
        //# Clear playlist
        return this.localPlaylist.clear(() => {
          //# Add songs to playlist and play
          this.localPlaylist.playCollection(collection);
          if (callback) {
            return callback(true);
          }
        });
      });
    }

    //# Add one more song and remove first song
    topUpGlasses() {
      // Get new last song
      return this.getSongs(1, collection => {
        // Remove first song
        return this.localPlaylist.remove(0, () => {
          // Add new last song
          return this.localPlaylist.addCollection(collection);
        });
      });
    }

    //# Get the songs to play
    getSongs(limit, callback) {
      const options = {
        sort: {method: 'random', order: 'ascending'},
        limit: {start: 0, end: limit},
        cache: false,
        success(result) {
          return callback(result);
        }
      };
      return App.request("song:entities", options);
    }

    //# Disable party mode.
    leaveParty(callback) {
      this.stateObj.setPlaying('partymode', false);
      if (callback) {
        return callback(true);
      }
    }

    //# Is party mode active
    isPartyMode() {
      return this.stateObj.getPlaying('partymode', false);
    }
  };


  //# Enable, disable or toggle party mode
  App.commands.setHandler('playlist:local:partymode', function(op = 'toggle', callback) {
    const manager = API.getController();
    if (op === 'toggle') {
      op = !manager.isPartyMode();
    }
    if (op === true) {
      manager.fillGlasses(callback);
    } else {
      manager.leaveParty(callback);
    }
    return App.vent.trigger("state:local:changed");
  });

  //# Listen to local song finished
  return App.vent.on("state:local:next", function() {
    const manager = API.getController();
    if (manager.isPartyMode()) {
      return manager.topUpGlasses();
    }
  });
});
