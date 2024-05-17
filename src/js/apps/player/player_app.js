// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlayerApp", function(PlayerApp, App, Backbone, Marionette, $, _) {

  var API = {

    //# Get the kodi play bar
    getPlayer(player) {
      return new PlayerApp.Show.Player({
        player});
    },

    //# Send a player command.
    doCommand(player, command, params, callback) {
      return App.request(`command:${player}:player`, command, params, () => {
        return this.pollingUpdate(callback);
      });
    },

    //# Get the Kodi application controller
    getAppController(player) {
      return App.request(`command:${player}:controller`, 'auto', 'Application');
    },

    //# Wrapper for requesting a state update if no sockets
    pollingUpdate(callback) {
      const stateObj = App.request("state:current");
      if (stateObj.getPlayer() === 'kodi') {
        if (!App.request('sockets:active')) {
          return App.request('state:kodi:update', callback);
        }
      }
      else {}
    },
        //# Local player state update.

    //# Listen to the player commands
    initPlayer(player, playerView) {
      this.initProgress(player);
      this.initVolume(player);
      App.vent.trigger("state:player:updated", player);
      const appController = this.getAppController(player);
      App.vent.on("state:initialized", () => {
        const stateObj = App.request("state:kodi");
        if (stateObj.isPlaying()) {
          this.timerStop();
          return this.timerStart();
        }
      });

      //# Buttons
      App.listenTo(playerView, "control:play", () => {
        return this.doCommand(player, 'PlayPause', 'toggle');
      });
      App.listenTo(playerView, "control:prev", () => {
        return this.doCommand(player, 'GoTo', 'previous');
      });
      App.listenTo(playerView, "control:next", () => {
        return this.doCommand(player, 'GoTo', 'next');
      });
      App.listenTo(playerView, "control:repeat", () => {
        return this.doCommand(player, 'SetRepeat', 'cycle');
      });
      App.listenTo(playerView, "control:shuffle", () => {
        return this.doCommand(player, 'SetShuffle', 'toggle');
      });
      App.listenTo(playerView, "control:mute", () => {
        return appController.toggleMute(() => {
          return this.pollingUpdate();
        });
      });
      App.listenTo(playerView, 'control:menu', () => App.execute("ui:playermenu", 'toggle'));

      //# Remote toggle
      if (player === 'kodi') {
        App.listenTo(playerView, "remote:toggle", () => {
          return App.execute("input:remote:toggle");
        });
      }

      const $playerCtx = $('#player-' + player);
      const $progress = $('.playing-progress', $playerCtx);
      if (player === 'kodi') {
        //# Kodi Slider Progress change
        $progress.on('change', function() {
          API.timerStop();
          return API.doCommand(player, 'Seek', {percentage: Math.round(this.vGet())}, () => API.timerStart());
        });
        $progress.on('slide', () => API.timerStop());
      } else {
        //# Local slider progress change
        $progress.on('change', function() {
          return API.doCommand(player, 'Seek', {percentage: Math.round(this.vGet())});
      });
      }

      //# Slider volume
      const $volume = $('.volume', $playerCtx);
      return $volume.on('change', function() {
        return appController.setVolume(Math.round(this.vGet()), () => API.pollingUpdate());
      });
    },

    //# Start virtual timer
    timerStart() {
      return App.playingTimerInterval = setTimeout(( () => {
        return this.timerUpdate();
      }
      ), 1000);
    },

    //# Stop virtual timer
    timerStop() {
      return clearTimeout(App.playingTimerInterval);
    },

    //# Update virtual timer.
    timerUpdate() {
      const stateObj = App.request("state:kodi");
      // stop existing timers and restart if playing
      this.timerStop();
      // is playing
      if (stateObj.isPlaying() && (stateObj.getPlaying('time') != null)) {
        // parse time
        const cur = helpers.global.timeToSec(stateObj.getPlaying('time')) + 1;
        const dur = helpers.global.timeToSec(stateObj.getPlaying('totaltime'));
        const percent = Math.ceil((cur / dur) * 100);
        const curTimeObj = helpers.global.secToTime(cur);
        // update cache with new time
        stateObj.setPlaying('time', curTimeObj);
        // update ui
        this.setProgress('kodi', percent, curTimeObj);
        // Restart timer
        return this.timerStart();
      }
    },

    //# Set the current player progress.
    setProgress(player, percent = 0, currentTime = 0) {
      const $playerCtx = $('#player-' + player);
      $('.playing-progress', $playerCtx).val(percent);
      const $cur = $('.playing-time-current', $playerCtx);
      return $cur.text(helpers.global.formatTime(currentTime));
    },

    //# Init progress.
    initProgress(player, percent = 0) {
      const $playerCtx = $('#player-' + player);
      return $('.playing-progress', $playerCtx).noUiSlider({
        start: percent,
        connect: 'upper',
        step: 1,
        range: {
          min: 0,
          max: 100
        }
      });
    },

    //# Init Volume.
    initVolume(player, percent = 50) {
      const $playerCtx = $('#player-' + player);
      return $('.volume', $playerCtx).noUiSlider({
        start: percent,
        connect: 'upper',
        step: 1,
        range: {
          min: 0,
          max: 100
        }
      });
    }
  };


  //# Kick of the player on shell ready.
  return this.onStart = function(options) {

    App.vent.on("shell:ready", options => {

      //# Kodi player
      App.kodiPlayer = API.getPlayer('kodi');
      App.listenTo(App.kodiPlayer, "show", function() {
        API.initPlayer('kodi', App.kodiPlayer);
        return App.execute("player:kodi:timer", 'start');
      });
      App.regionPlayerKodi.show(App.kodiPlayer);

      //# Local player
      App.localPlayer = API.getPlayer('local');
      App.listenTo(App.localPlayer, "show", () => API.initPlayer('local', App.localPlayer));
      return App.regionPlayerLocal.show(App.localPlayer);
    });

    //# Handler for the virtual timer.
    App.commands.setHandler('player:kodi:timer', function(state = 'start') {
      if (state === 'start') {
        return API.timerStart();
      } else if (state === 'stop') {
        return API.timerStop();
      } else if (state === 'update') {
        return API.timerUpdate();
      }
    });

    //# Handler for changing the local progress.
    App.commands.setHandler('player:local:progress:update', (percent, currentTime) => API.setProgress('local', percent, currentTime));

    //# Handler for changing the kodi progress.
    return App.commands.setHandler('player:kodi:progress:update', (percent, callback) => API.doCommand('kodi', 'Seek', {percentage: percent}, callback));
  };
});
