// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  Backbone.fetchCache.localStorage = false;

  return (function() {
    const Cls = (KodiEntities.Collection = class Collection extends App.Entities.Collection {
      static initClass() {
        this.prototype.rpc = new Backbone.Rpc({
          namespaceDelimiter: ''
        });
      }

      //# Common jsonrpc settings.
      url() { return helpers.url.baseKodiUrl(this.constructor.name); }

      //# Add the options to the collection so we can use their args with rpc calls.
      sync(method, model, options) {
        if (method === 'read') {
          this.options = options;
        }
        return Backbone.sync(method, model, options);
      }

      //# Set our custom cache keys.
      getCacheKey(options) {
        this.options = options;
        let key = this.constructor.name;
        for (var k of ['filter', 'sort', 'limit', 'file']) {
          if (options[k]) {
            for (var prop in options[k]) {
              var val = options[k][prop];
              key += ':' + prop + ':' + val;
            }
          }
        }
        return key;
      }

      //# When using cache, it doesn't respect the jsonrpc parsing
      //# so we use this to parse all collection results using cache.
      getResult(response, key) {
        this.responseKey = key;
        const result = response.jsonrpc && response.result ? response.result : response;
        return result[key];
      }

      //# Common arg patterns all checking if the params exist in options first.
      argCheckOption(option, fallback) {
        if ((this.options != null) && (this.options[option] != null)) {
          return this.options[option];
        } else {
          return fallback;
        }
      }

      //# Sort.
      argSort(method, order = 'ascending') {
        const arg = {method, order, ignorearticle: this.isIgnoreArticle()};
        return this.argCheckOption('sort', arg);
      }

      //# Limit.
      argLimit(start = 0, end = 'all') {
        const arg = {start};
        if (end !== 'all') {
          arg.end = end;
        }
        return this.argCheckOption('limit', arg);
      }

      //# Filter.
      argFilter(name, value) {
        let arg = {};
        if (name != null) {
          arg[name] = value;
        } else {
          arg = undefined;
        }
        return this.argCheckOption('filter', arg);
      }

      //# Allow replacing fields (fields) or adding additional fields (addFields) via options.
      //# Both expect an array.
      argFields(fields) {
        if ((this.options != null) && (this.options.fields != null)) {
          ({
            fields
          } = this.options);
        }
        if ((this.options != null) && (this.options.addFields != null)) {
          for (var field of this.options.addFields) {
            if (!helpers.global.inArray(field, fields)) {
              fields.push(field);
            }
          }
        }
        return fields;
      }

      //# Should we ignore article when sorting?
      isIgnoreArticle() {
        return config.getLocal('ignoreArticle', true);
      }

      //# Get Args
      getArgs(defaults) {
        const args = (this.options != null) ? _.extend(defaults, this.options) : defaults;
        return args;
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
