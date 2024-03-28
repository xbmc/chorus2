/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {

  return Api.VideoPlayer = class VideoPlayer extends Api.Player {

    // files controller
    getKodiFilesController() {
      return new App.CommandApp.Kodi.Files;
    }

    // Play wrapper to match kodi controller
    play(type, value, model) {
      return this.videoStream(model.get('file'), model.get('fanart'));
    }

    // Callback for video stream popup
    videoStream(file, background = '', player = 'html5') {
      const st = helpers.global.localVideoPopup('about:blank');
      return this.getKodiFilesController().downloadPath(file, path => st.location = "videoPlayer.html?player=" + player + '&src=' + encodeURIComponent(path) + '&bg=' + encodeURIComponent(background));
    }
  };
});
