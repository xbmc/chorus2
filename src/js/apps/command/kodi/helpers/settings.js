/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# GUI
(function() {
  const Cls = (Api.Settings = class Settings extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'Settings';
    }

    getSettingValue(value, callback) {
      return this.sendCommand("getSettingValue", [value], resp => {
        return this.doCallback(callback, resp.value);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
