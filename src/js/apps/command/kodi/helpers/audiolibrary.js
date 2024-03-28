// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Audio Library
(function() {
  const Cls = (Api.AudioLibrary = class AudioLibrary extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'AudioLibrary';
    }

    //# Set a album value
    setAlbumDetails(id, fields = {}, callback) {
      let params = {albumid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetAlbumDetails'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Set a artist value
    setArtistDetails(id, fields = {}, callback) {
      let params = {artistid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetArtistDetails'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Set a song value
    setSongDetails(id, fields = {}, callback) {
      let params = {songid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetSongDetails'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Scan library
    scan(callback) {
      return this.singleCommand(this.getCommand('Scan'), resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Clean library
    clean(callback) {
      return this.singleCommand(this.getCommand('Clean'), {showdialogs: false}, resp => {
        return this.doCallback(callback, resp);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
