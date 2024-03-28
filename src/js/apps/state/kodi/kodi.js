// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("StateApp.Kodi", (StateApp, App, Backbone, Marionette, $, _) => //# Kodi state object
(function() {
  const Cls = (StateApp.State = class State extends App.StateApp.Base {
    static initClass() {

      this.prototype.playerController = {};
      this.prototype.applicationController = {};
      this.prototype.playlistApi = {};
    }

    initialize() {
      this.state = _.extend({}, this.state);
      this.playing = _.extend({}, this.playing);
      this.setState('player', 'kodi');
      this.playerController = App.request("command:kodi:controller", 'auto', 'Player');
      this.applicationController = App.request("command:kodi:controller", 'auto', 'Application');
      this.playlistApi = App.request("playlist:kodi:entity:api");
      //# Add a listener for others to trigger an update
      App.reqres.setHandler("state:kodi:update", callback => {
        return this.getCurrentState(callback);
      });
      //# Add a listener for others to trigger an update
      return App.reqres.setHandler("state:kodi:get", () => {
        return this.getCachedState();
      });
    }

    getCurrentState(callback) {
      return this.applicationController.getProperties(properties => {
        this.setState('volume', properties.volume);
        this.setState('muted', properties.muted);
        this.setState('version', properties.version);
        //# Stop the timer before an update
        App.reqres.setHandler('player:kodi:timer', 'stop');
        //# Get playing data and parse it
        return this.playerController.getPlaying(playing => {
          if (playing) {
            //# Mark basic playing info
            this.setPlaying('playing', true);
            this.setPlaying('paused', (playing.properties.speed === 0));
            this.setPlaying('playState', (playing.properties.speed === 0 ? 'paused' : 'playing'));
            //# Standard map
            const autoMap = ['canrepeat', 'canseek', 'canshuffle', 'partymode', 'percentage', 'playlistid', 'position', 'speed', 'time', 'totaltime'];
            for (var key of autoMap) {
              if (playing.properties[key] != null) {
                this.setPlaying(key, playing.properties[key]);
              }
            }
            this.setState('shuffled',  playing.properties.shuffled);
            this.setState('repeat',  playing.properties.repeat);
            //# Media type
            const media = this.playerController.playerIdToName(playing.properties.playlistid);
            if (media) {
              this.setState('media', media);
            }
            //# Item changed?
            if (playing.item.file !== this.getPlaying('lastPlaying')) {
              this.setPlaying('itemChanged', true);
              App.vent.trigger("state:kodi:itemchanged", this.getCachedState());
            } else {
              this.setPlaying('itemChanged', false);
            }
            this.setPlaying('lastPlaying', playing.item.file);
            //# Playing item
            this.setPlaying('item', this.parseItem(playing.item, {media, playlistid: playing.properties.playlistid}));
            //# Start the timer up again
            App.reqres.setHandler('player:kodi:timer', 'start');
          } else {
            //# Not playing
            this.setPlaying('playing', false);
            this.setPlaying('paused', false);
            this.setPlaying('item', this.defaultPlayingItem);
            this.setPlaying('lstPlaying', '');
          }
          //# Tell others something might have changed in the app state
          App.vent.trigger("state:kodi:changed", this.getCachedState());
          App.vent.trigger("state:changed");
          //# Return callback called with saved state
          return this.doCallback(callback, this.getCachedState());
        });
      });
    }

    //# Parse a playing item fixing the url and image
    parseItem(model, options) {
      model = this.playlistApi.parseItem(model, options);
      model = App.request("images:path:entity", model);
      model.url = helpers.url.get(model.type, model.id);
      model.url = helpers.url.playlistUrl(model);
      return model;
    }
  });
  Cls.initClass();
  return Cls;
})());
