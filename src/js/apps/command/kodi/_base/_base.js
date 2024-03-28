/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Api.Base = class Base extends Marionette.Object {
    static initClass() {

      this.prototype.ajaxOptions = {};
    }

    initialize(options = {}) {
      $.jsonrpc.defaultUrl = helpers.url.baseKodiUrl("Base");
      return this.setOptions(options);
    }

    setOptions(options) {
      return this.ajaxOptions = options;
    }

    multipleCommands(commands, callback, fail) {
      const obj = $.jsonrpc(commands, this.ajaxOptions);
      obj.fail(error => {
        this.doCallback(fail, error);
        return this.onError(commands, error);
      });
      obj.done(response => {
        response = this.parseResponse(commands, response);
        this.triggerMethod("response:ready", response);
        if (callback != null) {
          return this.doCallback(callback, response);
        }
      });
      return obj;
    }

    singleCommand(command, params, callback, fail) {
      command = {method: command, url: helpers.url.baseKodiUrl(command)};
      if ((params != null) && ((params.length > 0) || _.isObject(params))) {
        command.params = params;
      }
      const obj = this.multipleCommands([command], callback, fail);
      return obj;
    }

    parseResponse(commands, response) {
      let results = [];
      for (var i in response) {
        var result = response[i];
        if (result.result || (result.result === false)) {
          results.push(result.result);
        } else {
          this.onError(commands[i], result);
        }
      }
      if ((commands.length === 1) && (results.length === 1)) {
        results = results[0];
      }
      return results;
    }

    paramObj(key, val) {
      return helpers.global.paramObj(key, val);
    }

    doCallback(callback, response) {
      if (callback != null) {
        return callback(response);
      }
    }

    onError(commands, error) {
      return helpers.debug.rpcError(commands, error);
    }
  });
  Cls.initClass();
  return Cls;
})());
