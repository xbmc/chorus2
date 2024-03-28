/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Input commander
(function() {
  const Cls = (Api.Input = class Input extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'Input';
    }

    //# Send a text string
    sendText(text, callback) {
      return this.singleCommand(this.getCommand('SendText'), [text], resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Set a single input
    sendInput(type, params = [], callback) {
      return this.singleCommand(this.getCommand(type), params, resp => {
        this.doCallback(callback, resp);
        if (!App.request('sockets:active')) {
          return App.request('state:kodi:update', callback);
        }
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
