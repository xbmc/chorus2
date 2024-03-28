// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Input commander
(function() {
  const Cls = (Api.Files = class Files extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'Files';
    }

    //# Prepare a file for download
    prepareDownload(file, callback) {
      return this.singleCommand(this.getCommand('PrepareDownload'), [file], resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Returns a download path for a file
    downloadPath(file, callback) {
      return this.prepareDownload(file, resp => {
        return this.doCallback(callback, resp.details.path);
      });
    }

    //# Callback for a download button, will initiate a download
    downloadFile(file) {
      const dl = window.open('about:blank', 'download');
      return this.downloadPath(file, path => dl.location = path);
    }

    //# Callback for video stream popup
    videoStream(file, background = '', player = 'html5') {
      const st = helpers.global.localVideoPopup('about:blank');
      return this.downloadPath(file, path => st.location = "videoPlayer.html?player=" + player + '&src=' + encodeURIComponent(path) + '&bg=' + encodeURIComponent(background));
    }
  });
  Cls.initClass();
  return Cls;
})());
