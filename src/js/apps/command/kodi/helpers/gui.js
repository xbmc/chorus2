// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# GUI
(function() {
  const Cls = (Api.GUI = class GUI extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'GUI';
    }

    setFullScreen(fullscreen = true, callback) {
      return this.sendCommand("SetFullscreen", [fullscreen], resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# See http://kodi.wiki/view/JSON-RPC_API/v6#GUI.Window for types
    activateWindow(window, params = [], callback) {
      return this.sendCommand("ActivateWindow", [window, params], resp => {
        return this.doCallback(callback, resp);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
