/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {


  //# Base commander with shared functionality.
  let Cls = (Api.Commander = class Commander extends Api.Base {
    static initClass() {
  
      this.prototype.playerActive = 0; //# default to audio
      this.prototype.playerName = 'music';
      this.prototype.playerForced = false; //# If false will check active player before a command
  
      //# Applies to player and playlists.
      this.prototype.playerIds = {
        audio: 0,
        video: 1
      };
  
  
      //# Namespace should be added in each extending class
      this.prototype.commandNameSpace = 'JSONRPC';
    }

    setPlayer(player) {
      if ((player === 'audio') || (player === 'video')) {
        this.playerActive = this.playerIds[player];
        this.playerName = player;
        return this.playerForced = true;
      }
    }

    getPlayer() {
      return this.playerActive;
    }

    getPlayerName() {
      return this.playerName;
    }

    //# get the player name via the id (eg return audio, video)
    playerIdToName(playerId) {
      let playerName;
      playerName;
      for (var name in this.playerIds) {
        var id = this.playerIds[name];
        if (id === playerId) {
          playerName = name;
        }
      }
      return playerName;
    }

    //# Namespace can be overridden when called
    getCommand(command, namespace = this.commandNameSpace) {
      return namespace + '.' + command;
    }

    //# Send a command
    sendCommand(command, params, callback, fail) {
      return this.singleCommand(this.getCommand(command), params, (resp => {
        return this.doCallback(callback, resp);
      }
      ), err => {
        return this.doCallback(fail, err);
      });
    }
  });
  Cls.initClass();


  //# Player commander.
  return (function() {
    Cls = (Api.Player = class Player extends Api.Commander {
      static initClass() {
  
        this.prototype.commandNameSpace = 'Player';
        this.prototype.playlistApi = {};
      }

      initialize(media = 'audio') {
        this.setPlayer(media);
        return this.playlistApi = App.request("playlist:kodi:entity:api");
      }

      getParams(params = [], callback) {
        let defaultParams;
        if (this.playerForced) {
          defaultParams = [this.playerActive];
          return this.doCallback(callback, defaultParams.concat(params));
        } else {
          return this.getActivePlayers(activeId => {
            defaultParams = [activeId];
            return this.doCallback(callback, defaultParams.concat(params));
          });
        }
      }

      getActivePlayers(callback) {
        return this.singleCommand(this.getCommand("GetActivePlayers"), {}, resp => {
          if (resp.length > 0) {
            this.playerActive = resp[0].playerid;
            this.playerName = this.playerIdToName(this.playerActive);
            this.triggerMethod("player:ready", this.playerActive);
            return this.doCallback(callback, this.playerActive);
          } else {
            return this.doCallback(callback, this.playerActive);
          }
        });
      }

      sendCommand(command, params = [], callback, fail) {
        return this.getParams(params, playerParams => {
          return this.singleCommand(this.getCommand(command), playerParams, (resp => {
            return this.doCallback(callback, resp);
          }
          ), err => {
            return this.doCallback(fail, err);
          });
        });
      }

      playEntity(type, value, options = {}, callback) {
        const params = {'item': this.paramObj(type, value), 'options': options};
        if (type === 'position') {
          params.item.playlistid = this.getPlayer();
        }
        return this.singleCommand(this.getCommand('Open', 'Player'), params, resp => {
          if (!App.request('sockets:active')) {
            // App.request 'player:kodi:timer', 'start'
            App.request('state:kodi:update');
          }
          return this.doCallback(callback, resp);
        });
      }

      setPartyMode(op = 'toggle', callback) {
        return this.sendCommand('SetPartymode', [op], resp => {
          return this.doCallback(callback, resp);
        });
      }

      getPlaying(callback) {
        const obj = {active: false, properties: false, item: false};
        return this.singleCommand(this.getCommand('GetActivePlayers'), {}, resp => {
          if (resp.length > 0) {
            obj.active = resp[0]; //# Only use the first active player (cant think of 2 running at the same time?)
            const commands = [];
            const itemFields = helpers.entities.getFields(this.playlistApi.fields, 'full');
            const playerFields = ["playlistid", "speed", "position", "totaltime", "time", "percentage", "shuffled", "repeat", "canrepeat", "canshuffle", "canseek", "partymode"];
            commands.push({method: this.getCommand('GetProperties'), params: [obj.active.playerid, playerFields]});
            commands.push({method: this.getCommand('GetItem'), params: [obj.active.playerid, itemFields]});
            return this.multipleCommands(commands, playing => {
              obj.properties = playing[0];
              obj.item = playing[1].item;
              return this.doCallback(callback, obj);
            });
          } else {
            return this.doCallback(callback, false);
          }
        });
      }
    });
    Cls.initClass();
    return Cls;
  })();
}); //# nothing playing
