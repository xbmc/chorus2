/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("StateApp.Kodi", (StateApp, App, Backbone, Marionette, $, _) => //# Poll for updates when websockets unavailable
//# As we need instance properties, for reference the instance is `App.kodiPolling`
(function() {
  const Cls = (StateApp.Polling = class Polling extends App.StateApp.Base {
    static initClass() {

      this.prototype.commander = {};
      this.prototype.checkInterval = 10000; //# 10 sec
      this.prototype.currentInterval = '';
      this.prototype.timeoutObj = {};
      this.prototype.failures = 0;
      this.prototype.maxFailures = 100;
    }

    initialize() {
      //# Set the current interval to default
      const interval = config.getLocal('pollInterval');
      this.checkInterval = parseInt(interval);
      return this.currentInterval = this.checkInterval;
    }

    startPolling() {
      return this.update();
    }

    //# The polling call.
    updateState() {
      const stateObj = App.request("state:kodi");
      return stateObj.getCurrentState();
    }

    //# As most of this is called out of context, we are calling everything
    //# around the timeout in the global instance scope.
    update() {
      if (config.getLocal('connected', true) === false) {
        return;
      }
      if (App.kodiPolling.failures < App.kodiPolling.maxFailures) {
        App.kodiPolling.updateState();
        //# Set the timeout.
        return App.kodiPolling.timeout = setTimeout(App.kodiPolling.ping, App.kodiPolling.currentInterval);
      } else {
        //# We have exceeded the failure count, probably dead!
        App.execute("notification:show", t.gettext("Unable to communicate with Kodi in a long time. I think it's dead Jim!"));
        return App.execute("shell:disconnect");
      }
    }

    //# Do a ping and deal with the results.
    ping() {
      const commander = App.request("command:kodi:controller", 'auto', 'Commander');
      commander.setOptions({
        timeout: 5000,
        error() {
          return App.kodiPolling.failure();
        }
      });
      commander.onError = function() {};
        //# replace current error handler so we don't pollute the console.
      return commander.sendCommand('Ping', [], () => App.kodiPolling.alive());
    }

    alive() {
      App.kodiPolling.failures = 0; // reset failures
      App.kodiPolling.currentInterval = App.kodiPolling.checkInterval; // reset interval
      return App.kodiPolling.update(); //# update again
    }

    failure() {
      App.kodiPolling.failures++;
      //# Increment the check interval the more failures we get
      if (App.kodiPolling.failures > 10) {
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 5;
      }
      if (App.kodiPolling.failures > 20) {
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 10;
      }
      if (App.kodiPolling.failures > 30) {
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 30;
      }
      return App.kodiPolling.update();
    }
  });
  Cls.initClass();
  return Cls;
})()); //# update again


