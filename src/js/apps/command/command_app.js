/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp", function(CommandApp, App, Backbone, Marionette, $, _) {

  const API = {
    // Return current playlist controller.
    currentAudioPlaylistController() {
      const stateObj = App.request("state:current");
      return App.request("command:" + stateObj.getPlayer() + ":controller", 'audio', 'PlayList');
    },

    // Return current playlist controller.
    currentVideoPlayerController() {
      const stateObj = App.request("state:current");
      // Switch method depending on player
      const method =  stateObj.getPlayer() === 'local' ? 'VideoPlayer' : 'PlayList';
      return App.request("command:" + stateObj.getPlayer() + ":controller", 'video', method);
    }
  };

  /*
    Kodi.
  */

  //# Kodi: Execute a command
  App.reqres.setHandler("command:kodi:player", function(method, params, callback) {
    const commander = new CommandApp.Kodi.Player('auto');
    return commander.sendCommand(method, params, callback);
  });

  //# Kodi: Get a controller for a specific player type and media
  App.reqres.setHandler("command:kodi:controller", (media = 'auto', controller) => new (CommandApp.Kodi[controller])(media));

  /*
    Local.
  */

  //# Local: Execute a command
  App.reqres.setHandler("command:local:player", function(method, params, callback) {
    const commander = new CommandApp.Local.Player('audio');
    return commander.sendCommand(method, params, callback);
  });

  //# Local: Get a controller for a specific player type and media
  App.reqres.setHandler("command:local:controller", (media = 'auto', controller) => new (CommandApp.Local[controller])(media));

  /*
    Wrappers single command for playing in kodi and local.
  */

  //# Play Audio in kodi or local depending on active player.
  App.commands.setHandler("command:audio:play", (type, value) => API.currentAudioPlaylistController().play(type, value));

  //# Queue Audio in kodi or local depending on active player.
  App.commands.setHandler("command:audio:add", (type, value) => API.currentAudioPlaylistController().add(type, value));

  //# Play Video in kodi or local depending on active player.
  App.commands.setHandler("command:video:play", function(model, type, resume = 0, callback) {
    const value = model.get(type);
    return API.currentVideoPlayerController().play(type, value, model, resume, function(resp) {
      // Problem: Home OSD to display when you 'add to playlist and play' when it is not empty
      // This might cause other issues but tested ok for me, so hack implemented!
      // TODO: Investigate, feels like a Kodi bug, but maybe not also.
      const stateObj = App.request("state:current");
      if (stateObj.getPlayer() === 'kodi') {
        // If player is kodi, force full screen to full. This hides the home OSD.
        const kodiVideo = App.request("command:kodi:controller", 'video', 'GUI');
        return kodiVideo.setFullScreen(true, callback);
      }
    });
  });

  /*
    Commands that are generally used by settings pages.
  */

  //# Clean audio library.
  App.commands.setHandler("command:kodi:audio:clean", () => App.request("command:kodi:controller", 'auto', 'AudioLibrary').clean());

  //# Clean audio library.
  App.commands.setHandler("command:kodi:video:clean", () => App.request("command:kodi:controller", 'auto', 'VideoLibrary').clean());


  //# Startup tasks.
  return App.addInitializer(function() {});
});
