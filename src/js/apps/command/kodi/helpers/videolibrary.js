// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) => //# Video Library
(function() {
  const Cls = (Api.VideoLibrary = class VideoLibrary extends Api.Commander {
    static initClass() {

      this.prototype.commandNameSpace = 'VideoLibrary';
    }

    //# Set a episode value
    setEpisodeDetails(id, fields = {}, callback) {
      let params = {episodeid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetEpisodeDetails'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Set a movie value
    setMovieDetails(id, fields = {}, callback) {
      let params = {movieid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetMovieDetails'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Set a tvshow value
    setTVShowDetails(id, fields = {}, callback) {
      let params = {tvshowid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetTVShowDetails'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Set a music video value
    setMusicVideoDetails(id, fields = {}, callback) {
      let params = {musicvideoid: id};
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetMusicVideoDetails'), params, resp => {
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

    //# Toggle watched on a collection. op is 'watched' or 'unwatched'
    toggleWatchedCollection(collection, op, callback) {
      for (var i in collection.models) {
        var model = collection.models[i];
        this.toggleWatched(model, op);
      }
      return this.doCallback(callback, true);
    }

    //# Toggle watched status. op is 'watched' or 'unwatched'
    toggleWatched(model, op = 'auto', callback) {
      let setPlaycount;
      if (op === 'auto') {
        setPlaycount = model.get('playcount') > 0 ? 0 : 1;
      } else if (op === 'watched') {
        setPlaycount = 1;
      } else if (op === 'unwatched') {
        setPlaycount = 0;
      }
      const fields = helpers.global.paramObj('playcount', setPlaycount);
      if (model.get('type') === 'movie') {
        this.setMovieDetails(model.get('id'), fields, () => {
          App.vent.trigger('entity:kodi:update', model.get('uid'));
          return this.doCallback(callback, setPlaycount);
        });
      }
      if (model.get('type') === 'episode') {
        return this.setEpisodeDetails(model.get('id'), fields, () => {
          App.vent.trigger('entity:kodi:update', model.get('uid'));
          return this.doCallback(callback, setPlaycount);
        });
      }
    }

    //# Refresh a movie
    refreshMovie(id, params, callback) {
      params = _.extend({movieid: id, ignorenfo: false}, params);
      return this.singleCommand(this.getCommand('RefreshMovie'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Refresh a tvshow
    refreshTVShow(id, params, callback) {
      params = _.extend({tvshowid: id, ignorenfo: false}, params);
      return this.singleCommand(this.getCommand('RefreshTVShow'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }

    //# Refresh an episode
    refreshEpisode(id, params, callback) {
      params = _.extend({episodeid: id, ignorenfo: false}, params);
      return this.singleCommand(this.getCommand('RefreshEpisode'), params, resp => {
        return this.doCallback(callback, resp);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
