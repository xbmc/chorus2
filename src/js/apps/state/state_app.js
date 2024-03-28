/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("StateApp", function(StateApp, App, Backbone, Marionette, $, _) {


  var API = {

    setState(player = 'kodi') {
      this.setBodyClasses(player);
      this.setPlayingContent(player);
      this.setPlayerPlaying(player);
      this.setAppProperties(player);
      return this.setTitle(player);
    },

    playerClass(className, player) {
      return player + '-' + className;
    },

    //# Set app level body state classes
    setBodyClasses(player) {
      const stateObj = App.request("state:" + player);
      const $body = App.getRegion('root').$el;
      //# Remove All
      $body.removeClassStartsWith(player + '-');
      //# Add based on state properties
      const newClasses = [];
      newClasses.push(( 'shuffled-' + (stateObj.getState('shuffled') ? 'on' : 'off')  ));
      newClasses.push(( 'partymode-' + (stateObj.getPlaying('partymode') ? 'on' : 'off')  ));
      newClasses.push(( 'mute-' + (stateObj.getState('muted') ? 'on' : 'off')  ));
      newClasses.push(( 'repeat-' + stateObj.getState('repeat') ));
      newClasses.push(( 'media-' + stateObj.getState('media') ));
      if (stateObj.isPlaying()) {
        newClasses.push(( stateObj.getPlaying('playState') ));
      } else {
        newClasses.push(('not-playing'));
      }
//      $body.removeClass('local-partymode-on')
      return newClasses.map((c) =>
        $body.addClass(this.playerClass(c, player)));
    },

    //# Set playing rows in content.
    setPlayingContent(player) {
      const stateObj = App.request("state:" + player);
      const $playlistCtx = $('.media-' + stateObj.getState('media') + ' .' + player + '-playlist');
      $('.can-play').removeClassStartsWith(player + '-row-');
      $('.item', $playlistCtx).removeClassStartsWith('row-');
      if (stateObj.isPlaying()) {
        const item = stateObj.getPlaying('item');
        const playState = stateObj.getPlaying('playState');
        //# library item
        const className = '.item-' + item.uid;
        $(className).addClass( this.playerClass('row-' + playState, player) );
        //# playlist item
        const $plItem = $('.pos-' + stateObj.getPlaying('position'), $playlistCtx).addClass( 'row-' + playState );
        //# force playing item thumb and title @see http://forum.kodi.tv/showthread.php?tid=300522
        if ($plItem.data('type') === 'file') {
          $('.thumb', $plItem).css("background-image", "url('" + item.thumbnail + "')");
          $('.title', $plItem).html(helpers.entities.playingLink(item));
        }
        return App.vent.trigger("state:" + player + ":playing:updated", stateObj);
      }
    },

    //# Set the now playing info in the player
    setPlayerPlaying(player) {
      const stateObj = App.request("state:" + player);
      const $playerCtx = $('#player-' + player);
      const $title = $('.playing-title', $playerCtx);
      const $subtitle = $('.playing-subtitle', $playerCtx);
      const $dur = $('.playing-time-duration', $playerCtx);
      const $img = $('.playing-thumb', $playerCtx);
      if (stateObj.isPlaying()) {
        const item = stateObj.getPlaying('item');
        $title.html(helpers.entities.playingLink(item));
        $subtitle.html(helpers.entities.getSubtitle(item));
        $dur.text(helpers.global.formatTime(stateObj.getPlaying('totaltime')));
        return $img.css("background-image", "url('" + item.thumbnail + "')");
      } else {
        $title.html(t.gettext('Nothing playing'));
        $subtitle.html('');
        $dur.text('0');
        return $img.attr('src', App.request("images:path:get"));
      }
    },


    setAppProperties(player) {
      const stateObj = App.request("state:" + player);
      const $playerCtx = $('#player-' + player);
      return $('.volume', $playerCtx).val(stateObj.getState('volume'));
    },

    setTitle(player) {
      if (player === 'kodi') {
        const stateObj = App.request("state:" + player);
        if (stateObj.isPlaying() && (stateObj.getPlaying('playState') === 'playing')) {
          return helpers.global.appTitle(stateObj.getPlaying('item'));
        } else {
          return helpers.global.appTitle();
        }
      }
    },

    //# Get the most appropriate player on first load.
    getDefaultPlayer() {
      let player = config.getLocal('defaultPlayer', 'auto');
      if (player === 'auto') {
        player = config.get('app', 'state:lastplayer', 'kodi');
      }
      return player;
    },

    //# Kick off all things kodi statewise
    initKodiState() {

      //# Set initial state
      App.kodiState = new StateApp.Kodi.State();
      App.localState = new StateApp.Local.State();

      //# Set the initial active player
      App.kodiState.setPlayer(this.getDefaultPlayer());

      //# Load up the Kodi state
      App.kodiState.getCurrentState(function(state) {
        API.setState('kodi');

        //# Attach sockets and polling (if req).
        App.kodiSockets = new StateApp.Kodi.Notifications();
        App.kodiPolling =  new StateApp.Kodi.Polling();

        //# Sockets unavailable, start polling.
        App.vent.on("sockets:unavailable", () => App.kodiPolling.startPolling());

        //# Playlist is available, set its state
        App.vent.on("playlist:rendered", () => App.request("playlist:refresh", App.kodiState.getState('player'), App.kodiState.getState('media')));

        //# Some new content has been rendered with a potential to be playing
        App.vent.on("state:content:updated", function() {
          API.setPlayingContent('kodi');
          return API.setPlayingContent('local');
        });

        //# Some kodi data has changed or needs updating.
        App.vent.on("state:kodi:changed", state => API.setState('kodi'));

        //# Some local data has changed or needs updating.
        App.vent.on("state:local:changed", state => API.setState('local'));

        //# Player data requires updating
        App.vent.on("state:player:updated", player => API.setPlayerPlaying(player));

        return App.vent.trigger("state:initialized");
      });


      //# Everything should use the state object.
      App.reqres.setHandler("state:kodi", () => App.kodiState);
      App.reqres.setHandler("state:local", () => App.localState);

      //# Everything should use the state object.
      App.reqres.setHandler("state:current", function() {
        const stateObj = App.kodiState.getPlayer() === 'kodi' ? App.kodiState : App.localState;
        return stateObj;
      });

      // Reconnect websockets.
      App.commands.setHandler('state:ws:init', () => App.kodiSockets = new StateApp.Kodi.Notifications());

      //# Let things know the state object is now available
      return App.vent.trigger("state:changed");
    }
  };



  //# Startup tasks.
  return App.addInitializer(() => //# Kodi state.
  API.initKodiState());
});
