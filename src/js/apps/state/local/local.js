/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("StateApp.Local", function(StateApp, App, Backbone, Marionette, $, _) {

  //# Local state object.
  return (StateApp.State = class State extends App.StateApp.Base {

    initialize() {
      this.state = _.extend({}, this.state);
      this.playing = _.extend({}, this.playing);
      this.setState('player', 'local');
      this.setState('currentPlaybackId', 'browser-none');
      this.setState('localPlay', false);

      //# Add a listener for others to trigger an update
      App.reqres.setHandler("state:local:update", callback => {
        return this.getCurrentState(callback);
      });
      //# Add a listener for others to trigger an update
      return App.reqres.setHandler("state:local:get", () => {
        return this.getCachedState();
      });
    }

    getCurrentState(callback) {
      //# Update from local player.

      return this.doCallback(callback, this.getCachedState());
    }
  });
});
