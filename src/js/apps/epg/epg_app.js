/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("EPGApp", function(EPGApp, App, Backbone, Marionette, $, _) {

  const Cls = (EPGApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "pvr/tv/:channelid"       : "tv",
        "pvr/radio/:channelid"    : "radio"
      };
    }
  });
  Cls.initClass();

  const API = {

    tv(channelid) {
      return new EPGApp.List.Controller({
        channelid,
        type: "tv"
      });
    },

    radio(channelid) {
      return new EPGApp.List.Controller({
        channelid,
        type: "radio"
      });
    },

    action(op, view) {
      const {
        model
      } = view;
      const player = App.request("command:kodi:controller", 'auto', 'Player');
      const pvr = App.request("command:kodi:controller", 'auto', 'PVR');
      switch (op) {
        case 'play':
          return player.playEntity('channelid', model.get('channelid'));
        case 'record':
          return pvr.setRecord(model.get('channelid'), {}, () => App.execute("notification:show", tr("Channel recording toggled")));
        case 'timer':
          return pvr.toggleTimer(model.get('id'));
        default:
      }
    }
  };
          // nothing

  //# This is shared with a channel action (sidebar)
  App.commands.setHandler('broadcast:action', (op, view) => API.action(op, view));

  return App.on("before:start", () => new EPGApp.Router({
    controller: API}));
});
