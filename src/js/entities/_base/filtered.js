// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  //# https://github.com/jmorrell/backbone-filtered-collection
  return Entities.Filtered = class Filtered extends FilteredCollection {

    //# Allows filtering against multiple values of the same key.
    filterByMultiple(key, values = []) {
      return this.filterBy(key, model => helpers.global.inArray(model.get(key), values));
    }

    //# Allows filtering against multiple values of the same key
    //# where the data is an array
    filterByMultipleArray(key, values = []) {
      return this.filterBy(key, function(model) {
        let match = false;
        for (var v of model.get(key)) {
          if (helpers.global.inArray(v, values)) {
            match = true;
          }
        }
        return match;
      });
    }

    //# Like filterbymultiplearray but allows for key to be an object
    //# picking out the key from that object.
    filterByMultipleObject(key, property, values = []) {
      return this.filterBy(key, function(model) {
        let match = false;
        const items = _.pluck(model.get(key), property);
        for (var v of items) {
          if (helpers.global.inArray(v, values)) {
            match = true;
          }
        }
        return match;
      });
    }

    filterByUnwatched() {
      return this.filterBy('unwatched', function(model) {
        let unwatched = 1;
        if (model.get('type') === 'tvshow') {
          unwatched = model.get('episode') - model.get('watchedepisodes');
        } else if ((model.get('type') === 'movie') || (model.get('type') === 'episode')) {
          unwatched = model.get('playcount') > 0 ? 0 : 1;
        }
        return unwatched > 0;
      });
    }

    filterByWatched() {
      return this.filterBy('watched', function(model) {
        let watched = 1;
        if (model.get('type') === 'tvshow') {
          watched = model.get('watchedepisodes');
        } else if ((model.get('type') === 'movie') || (model.get('type') === 'episode')) {
          watched = model.get('playcount') > 0 ? 1 : 0;
        }
        return watched > 0;
      });
    }

    filterByThumbsUp(key) {
      return this.filterBy(key, model => App.request("thumbsup:check", model));
    }

    filterByInProgress(key) {
      return this.filterBy(key, function(model) {
        const inprogress = (model.get('progress') > 0) && (model.get('progress') < 100) ? true : false;
        return inprogress;
      });
    }

    filterByString(key, query) {
      return this.filterBy('search', function(model) {
        if (query.length < 3) { //# 2 character min
          return false;
        } else {
          const value = model.get(key).toLowerCase();
          return (value.indexOf(query.toLowerCase()) > -1);
        }
      });
    }
  };
});
