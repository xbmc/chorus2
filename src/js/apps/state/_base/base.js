// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("StateApp", (StateApp, App, Backbone, Marionette, $, _) => //# This outlines the common structure and helpers to be shared
//# between the Kodi and local player states.
(function() {
  const Cls = (StateApp.Base = class Base extends Marionette.Object {
    static initClass() {

      this.prototype.instanceSettings = {};

      this.prototype.state = {
        player: 'kodi',
        media: 'audio',
        volume: 50,
        lastVolume: 50, //# used for toggling mute
        muted: false,
        shuffled: false,
        repeat: 'off', // 'off'/'one'/'all'
        version: {major: 15, minor: 0}
      };

      this.prototype.playing = {
        playing: false, // false = stopped, true = playing or paused
        paused: false,
        playState: '', // playing or paused
        item: {},
        media: 'audio',
        itemChanged: false, // if the item has changed since last check
        latPlaying: '', // What was playing last time we checked
        canrepeat: true,
        canseek: true,
        canshuffle: true,
        partymode: false,
        percentage: 0,
        playlistid: 0,
        position: 0,
        speed: 0, // 1 is playing, 0 is paused
        time: {
          hours: 0,
          milliseconds: 0,
          minutes: 0,
          seconds: 0
        },
        totaltime: {
          hours: 0,
          milliseconds: 0,
          minutes: 0,
          seconds: 0
        }
      };

      this.prototype.defaultPlayingItem = {
        thumbnail: '',
        fanart: '',
        id: 0,
        songid: 0,
        episodeid: 0,
        album: '',
        albumid: '',
        duration: 0,
        type: 'song'
      };
    }

    getState(key = 'all') {
      if (key === 'all') {
        return this.state;
      } else {
        return this.state[key];
      }
    }

    setState(key, value) {
      return this.state[key] = value;
    }

    getPlaying(key = 'all') {
      const ret = this.playing;
      if (ret.item.length === 0) {
        ret.item = this.defaultPlayingItem;
      }
      if (key === 'all') {
        return this.playing;
      } else {
        return this.playing[key];
      }
    }

    setPlaying(key, value) {
      return this.playing[key] = value;
    }

    isPlaying(media = 'auto'){
      if (media === 'auto') {
        return this.getPlaying('playing');
      } else {
        return (media === this.getState('media')) && this.getPlaying('playing');
      }
    }

    isPlayingItemChanged() {
      return this.getPlaying('itemChanged');
    }

    doCallback(callback, resp) {
      if (typeof callback === 'function') {
        return callback(resp);
      }
    }

    getCurrentState(callback) {}
      //# Override in extending module

    getCachedState() {
      return {state: this.state, playing: this.playing};
    }

    setPlayer(player = 'kodi') {
      const $body = App.getRegion('root').$el;
      $body.removeClassStartsWith('active-player-').addClass('active-player-' + player);
      config.set('state', 'lastplayer', player);
      return config.set('app', 'state:lastplayer', player);
    }

    getPlayer() {
      let player = 'kodi';
      const $body = App.getRegion('root').$el;
      if ($body.hasClass('active-player-local')) {
        player = 'local';
      }
      return player;
    }
  });
  Cls.initClass();
  return Cls;
})());
