/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Application commander.
(function() {
  const Cls = (Api.System = class System extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'System';
    }

    getProperties(callback) {
      const properties = ["canshutdown", "cansuspend", "canhibernate", "canreboot"];
      return this.singleCommand(this.getCommand('GetProperties'), [properties], resp => {
        return this.doCallback(callback, resp);
      });
    }

    hibernate(callback) {
      return this.singleCommand(this.getCommand('Hibernate'), [], resp => {
        return this.doCallback(callback, resp);
      });
    }

    reboot(callback) {
      return this.singleCommand(this.getCommand('Reboot'), [], resp => {
        return this.doCallback(callback, resp);
      });
    }

    shutdown(callback) {
      return this.singleCommand(this.getCommand('Shutdown'), [], resp => {
        return this.doCallback(callback, resp);
      });
    }

    suspend(callback) {
      return this.singleCommand(this.getCommand('Suspend'), [], resp => {
        return this.doCallback(callback, resp);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
