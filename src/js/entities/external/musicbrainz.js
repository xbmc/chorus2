// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  var API = {

    // V2 of API
    baseURL: 'http://musicbrainz.org/ws/2/',

    // Max count
    maxCount: 1,

    //# Make a call to API
    call(path, params, callback) {
      const url = this.baseURL + path + helpers.url.buildParams(params) + '&fmt=json';
      return $.getJSON(url, resp => callback(resp));
    },

    //# Find an artist, key is the search key, eg 'artist' or 'mbid'. id is the search query eg artist name or mbid.
    findArtist(key, id, callback) {
      return this.call('artist/', {query: key + ':' + id}, function(resp) {
        const collection = new Entities.ExternalCollection(API.parseArtist(resp));
        return callback(collection);
      });
    },

    //# Parse artist xml response
    parseArtist(resp) {
      let items = [];
      if (resp.artists && resp.artists.length) {
        items = resp.artists;
        items = _.map(items, function(item) {
          item.artistType = item.type;
          item.title = item.name;
          item.type = 'artist';
          item.provider = 'musicbrainz';
          return item;
        });
      }
      return items;
    }
  };


  //# Return the first matching entity on a name lookup
  return App.commands.setHandler("musicbrainz:artist:entity", (name, callback) => API.findArtist('artist', name, collection => callback(collection.first())));
});
