/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("StateApp.Kodi", (StateApp, App, Backbone, Marionette, $, _) => //# Deal with notifications from Kodi
(function() {
  const Cls = (StateApp.Notifications = class Notifications extends App.StateApp.Base {
    static initClass() {

      this.prototype.wsActive = false;
      this.prototype.wsObj = {};
    }

    getConnection() {
      const host = config.getLocal('socketsHost');
      const socketPath = config.getLocal('jsonRpcEndpoint');
      const socketPort = config.getLocal('socketsPort');
      const socketHost = host === 'auto' ? location.hostname : host;
      const protocol = helpers.url.isSecureProtocol() ? "wss" : "ws";
      return `${protocol}://${socketHost}:${socketPort}/${socketPath}?kodi`;
    }

    initialize() {

      if (window.WebSocket) {

        const ws = new WebSocket(this.getConnection());

        ws.onopen = e => {
          //# Do an initial update prior to setting sockets to active
          //# TODO: update state.
          //# Websockets is working!
          helpers.debug.msg("Websockets Active");
          this.wsActive = true;
          return App.vent.trigger("sockets:available");
        };

        ws.onerror = resp => {
          helpers.debug.msg(this.socketConnectionErrorMsg(), "warning", resp);
          this.wsActive = false;
          return App.vent.trigger("sockets:unavailable");
        };

        ws.onmessage = resp => {
          return this.messageReceived(resp);
        };

        ws.onclose = resp => {
          helpers.debug.msg("Websockets Closed", "warning", resp);
          this.wsActive = false;
          App.execute("notification:show", tr("Lost websocket connection"));
          // Schedule an attempt at a reconnect to web sockets in 60 secs
          return setTimeout(function() {
            App.execute("notification:show", tr("Attempting websockets reconnect"));
            return App.execute('state:ws:init');
          }
          , 60000);
        };

      } else {
        //# Sockets not available
        const msg = "Your browser doesn't support websockets! Get with the times and update your browser.";
        helpers.debug.msg(t.gettext(msg), "warning", resp);
        App.vent.trigger("sockets:unavailable");
      }

      return App.reqres.setHandler("sockets:active", () => {
        return this.wsActive;
      });
    }

    //# Return the data from a response
    parseResponse(resp) {
      return jQuery.parseJSON(resp.data);
    }

    //# Deal with a message.
    messageReceived(resp) {
      const data = this.parseResponse(resp);
      return this.onMessage(data);
    }

    socketConnectionErrorMsg() {
      const msg = "Failed to connect to websockets";
      return t.gettext(msg);
    }

    //# Force a state refresh
    refreshStateNow(callback) {
      App.vent.trigger("state:kodi:changed", this.getCachedState());
      //# Do a full lookup 1s later, calling this immediately returns
      //# old data. TODO: Not robust, fix!
      return setTimeout(( () => {
        return App.request("state:kodi:update", state => {
          if (callback) {
            return callback(state);
          }
      });
      }
      ), 1000);
    }

    //# An item in the library has been updated, trigger a model refresh
    onLibraryUpdate(data) {
      // This feels like a bug (different structure for audio vs video) and might be fixed one day
      const model = data.params.data.item ? data.params.data.item : data.params.data;
      //# Trigger a update of model in ui
      model.uid = helpers.entities.createUid(model, model.type);
      App.vent.trigger('entity:kodi:update', model.uid);
      //# Episode updates might affect parent show and happen in bulk, so we defer a show update after 2 seconds.
      if (model.type === 'episode') {
        clearTimeout(App.episodeRecheckTimeout);
        return App.episodeRecheckTimeout = setTimeout(() => App.request('episode:entity', model.id, {success(epModel) {
          return App.vent.trigger('entity:kodi:update', 'tvshow-' + epModel.get('tvshowid'));
        }
        })
        , 2000);
      }
    }

    //# Deal with message responses.
    onMessage(data) {

      // Action based on method
      switch (data.method) {

        // playback started
        case 'Player.OnPlay':
          this.setPlaying('paused', false);
          this.setPlaying('playState', 'playing');
          App.execute("player:kodi:timer", 'start');
          this.refreshStateNow();
          break;

        // playback started
        case 'Player.OnResume':
          this.setPlaying('paused', false);
          this.setPlaying('playState', 'playing');
          App.execute("player:kodi:timer", 'start');
          this.refreshStateNow();
          break;

        // playback stopped
        case 'Player.OnStop':
          this.setPlaying('playing', false);
          App.execute("player:kodi:timer", 'stop');
          this.refreshStateNow();
          break;

        // e.g. shuffled, repeat, partymode
        case 'Player.OnPropertyChanged':
          this.refreshStateNow();
          break;

        // playback pause
        case 'Player.OnPause':
          this.setPlaying('paused', true);
          this.setPlaying('playState', 'paused');
          App.execute("player:kodi:timer", 'stop');
          this.refreshStateNow();
          break;

        // progress changed
        case 'Player.OnSeek':
          App.execute("player:kodi:timer", 'stop');
          this.refreshStateNow(() => App.execute("player:kodi:timer", 'start'));
          break;

        // list cleared, add, remove, use a timeout to prevent slowdown on bulk add
        case 'Playlist.OnClear': case 'Playlist.OnAdd': case 'Playlist.OnRemove':
          clearTimeout(App.playlistUpdateTimeout);
          App.playlistUpdateTimeout = setTimeout(e => {
            const playerController = App.request("command:kodi:controller", 'auto', 'Player');
            App.execute("playlist:refresh", 'kodi', playerController.playerIdToName(data.params.data.playlistid));
            return this.refreshStateNow();
          }
          , 500);
          break;

        // volume change
        case 'Application.OnVolumeChanged':
          App.request("state:kodi").getCurrentState();
          break;

        // Video Library scan
        case 'VideoLibrary.OnScanStarted':
          App.execute("notification:show", t.gettext("Video library scan started"));
          break;

        // Video Library scan end
        case 'VideoLibrary.OnScanFinished':
          App.execute("notification:show", t.gettext("Video library scan complete"));
          //# Clear video caches
          Backbone.fetchCache.clearItem('MovieCollection');
          Backbone.fetchCache.clearItem('TVShowCollection');
          break;

        // Audio Library scan
        case 'AudioLibrary.OnScanStarted':
          App.execute("notification:show", t.gettext("Audio library scan started"));
          break;

        // Audio Library scan end
        case 'AudioLibrary.OnScanFinished':
          App.execute("notification:show", t.gettext("Audio library scan complete"));
          //# Clear audio caches
          Backbone.fetchCache.clearItem('AlbumCollection');
          Backbone.fetchCache.clearItem('ArtistCollection');
          break;

        // Audio Library clean start
        case 'AudioLibrary.OnCleanStarted':
          App.execute("notification:show", t.gettext("Audio library clean started"));
          break;

        // Audio Library clean stop
        case 'AudioLibrary.OnCleanFinished':
          App.execute("notification:show", t.gettext("Audio library clean finished"));
          break;

        // Video Library clean start
        case 'VideoLibrary.OnCleanStarted':
          App.execute("notification:show", t.gettext("Video library clean started"));
          break;

        // Video Library clean stop
        case 'VideoLibrary.OnCleanFinished':
          App.execute("notification:show", t.gettext("Video library clean finished"));
          break;

        // Audio Library update
        case 'AudioLibrary.OnUpdate': case 'VideoLibrary.OnUpdate':
          this.onLibraryUpdate(data);
          break;

        // Input box has opened
        case 'Input.OnInputRequested':
          App.execute("input:textbox", '');
          var wait = 60;
          // We set a timeout for {wait} seconds for a fallback for no input
          // this is to prevent an open dialog preventing api requests
          // Instead of encouraging entering random shizzle how about it's just cancelled and a message saying why?
          App.inputTimeout = setTimeout((function() {
            const wotd = '<a href="http://goo.gl/PGE7wg" target="_blank">word of the day</a>';
            const msg = t.sprintf(tr(
              "%1$d seconds ago, an input dialog opened in Kodi and it is still open! To prevent " +
              "a mainframe implosion, you should probably give me some text. I don't really care what it " +
              "is at this point, why not be creative? Do you have a %2$s? I won't tell..."), wait, wotd
            );
            App.execute("input:textbox", msg);
          }), 1000 * wait);
          break;

        // Input box has closed
        case 'Input.OnInputFinished':
          clearTimeout(App.inputTimeout);
          App.execute("input:textbox:close");
          break;

        // Kodi shutdown
        case 'System.OnQuit':
          App.execute("notification:show", t.gettext("Kodi has quit"));
          App.execute("shell:disconnect");
          break;

        // Kodi wake or restart
        case 'System.OnWake': case 'System.OnRestart':
          App.execute("shell:reconnect");
          break;

        default:
      }
          //# do nothing.
    }
  });
  Cls.initClass();
  return Cls;
})());
