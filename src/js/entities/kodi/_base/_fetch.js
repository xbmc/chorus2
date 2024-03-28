/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  const API = {

    cacheSynced(entities, callback) {
      return entities.on('cachesync', function() {
        callback();
        return helpers.global.loading("end");
      });
    },

    xhrsFetch(entities, callback) {
      const xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
      return $.when(...xhrs).done(function() {
        callback();
        return helpers.global.loading("end");
      });
    }
  };


  //# When entity fetched use the xhrs response to trigger done.
  return App.commands.setHandler("when:entity:fetched", function(entities, callback) {
    helpers.global.loading("start");
    //# When collections are returned from cache they don't seem to have
    //# params so am using this as our check if it is an xhrs request or
    //# a cachehit.
    //# TODO: Keep an eye on this - https://github.com/madglory/backbone-fetch-cache/issues/113
    if (!entities.params) {
      return API.cacheSynced(entities, callback);
    } else {
      return API.xhrsFetch(entities, callback);
    }
  });
});
