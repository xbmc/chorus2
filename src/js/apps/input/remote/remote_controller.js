// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("InputApp.Remote", function(Remote, App, Backbone, Marionette, $, _) {

  return Remote.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      //# Watch the shell and render when ready.
      return App.vent.on("shell:ready", options => {
        return this.getRemote();
      });
    }

    getRemote() {
      const view = new Remote.Control();
      this.listenTo(view, "remote:input", type => App.execute("input:send", type));
      this.listenTo(view, "remote:player", type => App.request('command:kodi:player', type, []));
      this.listenTo(view, "remote:info", function() {
        // If playing show osd
        if (App.request("state:kodi").isPlaying()) {
          return App.execute('input:action', 'osd');
        } else {
          return App.execute("input:send", 'Info');
        }
      });
      this.listenTo(view, "remote:power", () => {
        return this.getShutdownMenu();
      });
      App.regionRemote.show(view);

      //# Change the fanart when the state changes.
      return App.vent.on("state:changed", function(state) {
        const stateObj = App.request("state:current");
        if (stateObj.isPlayingItemChanged()) {
          const playingItem = stateObj.getPlaying('item');
          const fanart = App.request("images:path:get", playingItem.fanart, 'fanart');
          return $('#remote-background').css('background-image', 'url(' + playingItem.fanart + ')');
        }
      });
    }

    getShutdownMenu() {
      const system = App.request("command:kodi:controller", 'auto', 'System');
      return system.getProperties(function(props) {
        const actions = [];
        const optionalActions = ['shutdown', 'reboot', 'suspend', 'hibernate'];
        actions.push({id: 'quit', title: 'Quit Kodi'});
        for (var action of optionalActions) {
          var prop = 'can' + action;
          if (props[prop]) {
            actions.push({id: action, title: action});
          }
        }
        // Build modal with options
        const model = new Backbone.Model({id: 1, actions});
        const view = new Remote.System({model});
        const $content = view.render().$el;
        // Open modal and bind actions
        App.execute("ui:modal:show", tr('Shutdown menu'), $content, '', false, 'system');
        return App.listenTo(view, 'system:action', action => {
          switch (action) {
            case 'quit':
              App.request("command:kodi:controller", 'auto', 'Application').quit();
              break;
            case 'shutdown':
              system.shutdown();
              break;
            case 'reboot':
              system.reboot();
              break;
            case 'suspend':
              system.suspend();
              break;
            case 'hibernate':
              system.hibernate();
              break;
            default:
          }
              // nothing
          return App.execute("ui:modal:close");
        });
      });
    }
  };
});



