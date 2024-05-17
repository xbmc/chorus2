// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  return Entities.Collection = class Collection extends Backbone.Collection {

    //# Return the raw entities stored against this collection
    //# as an array of json objects (not models)
    //# TODO: Remove this and use toJSON() instead
    getRawCollection() {
      const objs = [];
      if (this.models.length > 0) {
        for (var model of this.models) {
          objs.push(model.attributes);
        }
      }
      return objs;
    }

    //# Set our custom cache keys.
    getCacheKey(options) {
      const key = this.constructor.name;
      return key;
    }

    //# Automatically sort a collection based on the params
    //# passed from the controller.
    autoSort(params) {
      if (params.sort) {
        const order = params.order ? params.order : 'asc';
        return this.sortCollection(params.sort, order);
      }
    }

    //# Change sort comparator.
    sortCollection(property, order = 'asc') {
      if (property === 'random') {
        this.comparator = false;
        this.reset(this.shuffle(), {silent:true});
      } else {
        this.comparator = model => {
          return this.ignoreArticleParse(model.get(property));
        };
        if (order === 'desc') {
          this.comparator = this.reverseSortBy(this.comparator);
        }
        this.sort();
      }
    }

    //# Reverse descending sort
    //# http://stackoverflow.com/a/12220415
    reverseSortBy(sortByFunction) {
      return function(left, right) {
        const l = sortByFunction(left);
        const r = sortByFunction(right);
        if (l === undefined) {
          return -1;
        }
        if (r === undefined) {
          return 1;
        }
        if (l < r) { return 1; } else if (l > r) { return -1; } else { return 0; }
      };
    }

    //# Ignore article in list sorting.
    ignoreArticleParse(string) {
      const articles = ["'", '"', 'the ', 'a '];
      if ((typeof string === 'string') && config.get('static', 'ignoreArticle', true)) {
        string = string.toLowerCase();
        let parsed = false;
        for (var s of articles) {
          if (parsed) {
            continue;
          }
          if (helpers.global.stringStartsWith(s, string)) {
            string = helpers.global.stringStripStartsWith(s, string);
            parsed = true;
          }
        }
      }
      return string;
    }
  };
});
