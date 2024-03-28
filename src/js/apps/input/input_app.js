// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("InputApp", function(InputApp, App, Backbone, Marionette, $, _) {


  const Cls = (InputApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes =
        {"remote"        : "remotePage"};
    }
  });
  Cls.initClass();


  const API = {

    initKeyBind() {
      return $(document).keydown(e => {
        return this.keyBind(e);
      });
    },

    //# The input controller
    inputController() {
      return App.request("command:kodi:controller", 'auto', 'Input');
    },

    //# Do an input command
    doInput(type) {
      return this.inputController().sendInput(type, []);
    },

    //# Do an action
    //# http://kodi.wiki/view/JSON-RPC_API/v6#Input.Action
    doAction(action) {
      return this.inputController().sendInput('ExecuteAction', [action]);
    },

    //# Send a player command.
    doCommand(command, params, callback) {
      return App.request('command:kodi:player', command, params, () => {
        return this.pollingUpdate(callback);
      });
    },

    //# Get the Kodi application controller
    appController() {
      return App.request("command:kodi:controller", 'auto', 'Application');
    },

    //# Wrapper for requesting a state update if no sockets
    pollingUpdate(callback) {
      if (!App.request('sockets:active')) {
        return App.request('state:kodi:update', callback);
      }
    },

    //# Toggle remote visibility and path
    toggleRemote(open = 'auto') {
      const $body = $('body');
      const rClass = 'section-remote';
      if (open === 'auto') {
        open = ($body.hasClass(rClass));
      }
      if (open) {
        window.history.back();
        return helpers.backscroll.scrollToLast();
      } else {
        helpers.backscroll.setLast();
        return App.navigate("remote", {trigger: true});
      }
    },

    //# Page callback, open remote and clear content.
    remotePage() {
      this.toggleRemote('auto');
      return App.regionContent.empty();
    },

    //# The input binds
    keyBind(e) {

      // Get settings
      const kodiControl = config.getLocal('keyboardControl') === 'kodi';
      const remotePage = $('body').hasClass('page-remote');

      //# Don't do anything if forms in use or if we have a local only setting
      if ($(e.target).is("input, textarea, select")) {
        return;
      }

      //# Don't do anything for white listed commands like CTRL, ALT, SHIFT, etc
      const whiteListCommands = [17, 16, 91, 18, 70];
      if (helpers.global.inArray(e.which, whiteListCommands)) {
        return;
      }

      // If no Kodi control and not on the remote page
      if (!kodiControl && !remotePage) {
        return;
      }

      // If all keyboard controls are for kodi or on the remote page
      if (kodiControl || remotePage) {
        e.preventDefault();
      }

      //# Get stateObj - consider changing this to be current and work with local too?
      const stateObj = App.request("state:kodi");

      //# Respond to key code
      switch (e.which) {
        case 37: case 72: // left, h
          return this.doInput("Left");
        case 38: case 75: // up, k
          return this.doInput("Up");
        case 39: case 76: // right, l
          return this.doInput("Right");
        case 40: case 74: // down, j
          return this.doInput("Down");
        case 8: // backspace
          return this.doInput("Back");
        case 13: // enter
          return this.doInput("Select");
        case 67: // c (context)
          return this.doInput("ContextMenu");
        case 107: case 187: case 61: // + (vol up)
          var vol = stateObj.getState('volume') + 5;
          return this.appController().setVolume(((vol > 100 ? 100 : Math.ceil(vol))));
        case 109: case 189: case 173: // - (vol down)
          vol = stateObj.getState('volume') - 5;
          return this.appController().setVolume(((vol < 0 ? 0 : Math.ceil(vol))));
        case 77: // m (mute)
          return this.appController().toggleMute();
        case 32: // spacebar (play/pause)
          return this.doCommand("PlayPause", "toggle");
        case 88: // x (stop)
          return this.doCommand("Stop");
        case 84: // t (toggle subtitles)
          return this.doAction("showsubtitles");
        case 9: // tab (close osd)
          return this.doAction("close");
        case 190: // > (next)
          return this.doCommand("GoTo", "next");
        case 188: // < (prev)
          return this.doCommand("GoTo", "previous");
        case 220: case 160: // Backslash, ^ (firefox) (fullscreen)
          return this.doAction("fullscreen");
        case 79: // o (osd)
          return this.doAction("osd");
        default:
      }
    } // return everything else here
  };


  App.commands.setHandler("input:textbox", msg => App.execute("ui:textinput:show", "Input required", {msg}, function(text) {
    API.inputController().sendText(text);
    return App.execute("notification:show", t.gettext('Sent text') + ' "' + text + '" ' + t.gettext('to Kodi'));
  }));

  App.commands.setHandler("input:textbox:close", () => App.execute("ui:modal:close"));

  App.commands.setHandler("input:send", action => API.doInput(action));

  App.commands.setHandler("input:remote:toggle", () => API.toggleRemote());

  App.commands.setHandler("input:action", action => API.doAction(action));

  App.commands.setHandler("input:resume", function(model, idKey) {
    const controller = new InputApp.Resume.Controller();
    return controller.resumePlay(model, idKey);
  });

  //# Startup tasks.
  App.addInitializer(function() {

    //# Render remote
    const controller = new InputApp.Remote.Controller();

    //# Bind to the keyboard inputs
    return API.initKeyBind();
  });

  //# Start the router.
  return App.on("before:start", () => new InputApp.Router({
    controller: API}));
});
