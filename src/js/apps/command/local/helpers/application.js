/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {

  //# Application commander.
  return Api.Application = class Application extends Api.Commander {

    getProperties(callback) {
      const stateObj = App.request("state:local");
      const resp = {
        volume: stateObj.getState('volume'),
        muted: stateObj.getState('muted')
      };
      return this.doCallback(callback, resp);
    }

    setVolume(volume, callback) {
      const stateObj = App.request("state:local");
      stateObj.setState('volume', volume);
      this.localSetVolume(volume);
      return this.doCallback(callback, volume);
    }

    toggleMute(callback) {
      const stateObj = App.request("state:local");
      let volume = 0;
      if (stateObj.getState('muted')) {
        //# unmute (last vol)
        volume = stateObj.getState('lastVolume');
        stateObj.setState('muted', false);
      } else {
        //# set mute
        stateObj.setState('lastVolume', stateObj.getState('volume'));
        stateObj.setState('muted', true);
        volume = 0;
      }
      this.localSetVolume(volume);
      return this.doCallback(callback, volume);
    }
  };
});
