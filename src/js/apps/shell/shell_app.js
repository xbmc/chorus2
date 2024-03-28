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
this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {

  const Cls = (Shell.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        ""        : "homePage",
        "home"    : "homePage"
      };
    }
  });
  Cls.initClass();


  const API = {

    homePage() {
      const home = new Shell.HomepageLayout();
      App.regionContent.show(home);
      this.setFanart();
      //# Change the fanart when the state changes.
      App.vent.on("state:changed", state => {
        const stateObj = App.request("state:current");
        if (stateObj.isPlayingItemChanged() && (helpers.url.arg(0) === '')) {
          return this.setFanart();
        }
      });
      //# Ensure background removed when we leave.
      return App.listenTo(home, "destroy", () => {
        return App.execute("images:fanart:set", 'none');
      });
    },

    setFanart() {
      const stateObj = App.request("state:current");
      if (stateObj != null) {
        const playingItem = stateObj.getPlaying('item');
        return App.execute("images:fanart:set", playingItem.fanart);
      } else {
        return App.execute("images:fanart:set");
      }
    },

    //# Render the shell.
    renderLayout() {

      //# Render Shell and assign its regions to the app.
      const shellLayout = new Shell.Layout();
      App.root.show( shellLayout );
      App.addRegions(shellLayout.regions);

      //# Kick of loading.
      App.execute("loading:show:page");

      //# Set title.
      this.setAppTitle();

      //# Get playlist state.
      let playlistState = config.get('app', 'shell:playlist:state', 'open');
      if (playlistState === 'closed') {
        this.alterRegionClasses('add', "shell-playlist-closed");
      }

      //# Update config options
      this.configUpdated();
      App.vent.on("config:local:updated", data => {
        return this.configUpdated();
      });

      //# Listen for active filtering
      App.vent.on("filter:filtering:start", () => {
        return this.alterRegionClasses('add', "filters-loading");
      });
      App.vent.on("filter:filtering:stop", () => {
        return this.alterRegionClasses('remove', "filters-loading");
      });

      //# Listen for changes to the playlist state.
      App.listenTo(shellLayout, "shell:playlist:toggle", (child, args) => {
        playlistState = config.get('app', 'shell:playlist:state', 'open');
        const state = playlistState === 'open' ? 'closed' : 'open';
        config.set('app', 'shell:playlist:state', state);
        return this.alterRegionClasses('toggle', "shell-playlist-closed");
      });

      //# Listen to reconnect.
      App.listenTo(shellLayout, "shell:reconnect", () => {
        return App.execute('shell:reconnect');
      });

      //# Additional listeners
      this.bindListenersContextMenu(shellLayout);
      return this.bindListenersSelectedMenu(shellLayout);
    },


    //# Alter region classes.
    alterRegionClasses(op, classes, region = 'root') {
      const $body = App.getRegion(region).$el;
      const action = `${op}Class`;
      return $body[action](classes);
    },

    //# Config updated. We might need to add or remove some shell classes.
    configUpdated() {
      //# Are thumbs disabled.
      const disableThumbs = config.getLocal('disableThumbs', false);
      const disableThumbsClassOp = disableThumbs === true ? 'add' : 'remove';
      this.alterRegionClasses(disableThumbsClassOp, 'disable-thumbs');
      return this.setAppTitle();
    },

    //# Set app title.
    setAppTitle() {
      App.getRegion('regionTitle').$el.text('');
      if (config.getLocal('showDeviceName', false) === true) {
        const settingsController = App.request("command:kodi:controller", 'auto', 'Settings');
        return settingsController.getSettingValue('services.devicename', title => App.getRegion('regionTitle').$el.text(title));
      }
    },

    // Shell listeners for context menu.
    bindListenersContextMenu(shellLayout) {
      // Library
      App.listenTo(shellLayout, "shell:audio:scan", () => App.request("command:kodi:controller", 'auto', 'AudioLibrary').scan());
      App.listenTo(shellLayout, "shell:video:scan", () => App.request("command:kodi:controller", 'auto', 'VideoLibrary').scan());
      // Pages
      App.listenTo(shellLayout, "shell:goto:lab", () => App.navigate("#lab", {trigger: true}));
      App.listenTo(shellLayout, "shell:about", () => App.navigate("#help", {trigger: true}));
      // Input box
      return App.listenTo(shellLayout, "shell:send:input", () => App.execute("input:textbox", ''));
    },

    // Shell listeners for selected menu
    bindListenersSelectedMenu(shellLayout) {
      App.listenTo(shellLayout, "shell:selected:play", () => App.execute("selected:action:play"));
      App.listenTo(shellLayout, "shell:selected:add", () => App.execute("selected:action:add"));
      return App.listenTo(shellLayout, "shell:selected:localadd", () => App.execute("selected:action:localadd"));
    }
  };


  //# On start
  App.addInitializer(() => App.commands.setHandler("shell:view:ready", function() {

      //# Render components.
    API.renderLayout();

    //# Shell Router
    new Shell.Router({
      controller: API});

    //# Tell everyone, shell is ready.
    App.vent.trigger("shell:ready");

    //# Add, Remove, Toggle classes on body.
    return App.commands.setHandler("body:state", (op, state) => API.alterRegionClasses(op, state));
  }));


  //# Attempt Kodi reconnect
  App.commands.setHandler('shell:reconnect', function() {
    API.alterRegionClasses('add', 'reconnecting');
    return helpers.connection.reconnect(function() {
      // Success.
      API.alterRegionClasses('remove', 'lost-connection');
      return API.alterRegionClasses('remove', 'reconnecting');
    });
  });




  //# Kodi disconnected
  return App.commands.setHandler('shell:disconnect', function() {
    API.alterRegionClasses('add', 'lost-connection');
    API.alterRegionClasses('remove', 'reconnecting');
    return helpers.connection.disconnect(function() {});
  });
});
      // Kodi disconnect.
