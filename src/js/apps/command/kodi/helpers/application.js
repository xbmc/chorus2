// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Application commander.
(function() {
  const Cls = (Api.Application = class Application extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'Application';
    }

    getProperties(callback) {
      return this.singleCommand(this.getCommand('GetProperties'), [["volume", "muted", "version"]], resp => {
        return this.doCallback(callback, resp);
      });
    }

    setVolume(volume, callback) {
      return this.singleCommand(this.getCommand('SetVolume'), [volume], resp => {
        return this.doCallback(callback, resp);
      });
    }

    toggleMute(callback) {
      const stateObj = App.request("state:kodi");
      return this.singleCommand(this.getCommand('SetMute'), [!stateObj.getState('muted')], resp => {
        return this.doCallback(callback, resp);
      });
    }

    quit(callback) {
      return this.singleCommand(this.getCommand('Quit'), [], resp => {
        return this.doCallback(callback, resp);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
