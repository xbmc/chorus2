/*!
  backbone.fetch-cache v1.4.1
  by Andy Appleton - https://github.com/mrappleton/backbone-fetch-cache.git
 */

// AMD wrapper from https://github.com/umdjs/umd/blob/master/amdWebGlobal.js

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module and set browser global
    define(['underscore', 'backbone', 'jquery'], function (_, Backbone, $) {
      return (root.Backbone = factory(_, Backbone, $));
    });
  } else if (typeof exports !== 'undefined' && typeof require !== 'undefined') {
    module.exports = factory(require('underscore'), require('backbone'), require('jquery'));
  } else {
    // Browser globals
    root.Backbone = factory(root._, root.Backbone, root.jQuery);
  }
}(this, function (_, Backbone, $) {

  // Setup
  var superMethods = {
    modelFetch: Backbone.Model.prototype.fetch,
    modelSync: Backbone.Model.prototype.sync,
    collectionFetch: Backbone.Collection.prototype.fetch
  },
  supportLocalStorage = (function() {
    var supported = typeof window.localStorage !== 'undefined';
    if (supported) {
      try {
        // impossible to write on some platforms when private browsing is on and
        // throws an exception = local storage not supported.
        localStorage.setItem('test_support', 'test_support');
        localStorage.removeItem('test_support');
      } catch (e) {
        supported = false;
      }
    }
    return supported;
  })();

  Backbone.fetchCache = (Backbone.fetchCache || {});
  Backbone.fetchCache._cache = (Backbone.fetchCache._cache || {});
  // Global flag to enable/disable caching
  Backbone.fetchCache.enabled = true;

  Backbone.fetchCache.priorityFn = function(a, b) {
    if (!a || !a.expires || !b || !b.expires) {
      return a;
    }

    return a.expires - b.expires;
  };

  Backbone.fetchCache._prioritize = function() {
    var sorted = _.values(this._cache).sort(this.priorityFn);
    var index = _.indexOf(_.values(this._cache), sorted[0]);
    return _.keys(this._cache)[index];
  };

  Backbone.fetchCache._deleteCacheWithPriority = function() {
    Backbone.fetchCache._cache[this._prioritize()] = null;
    delete Backbone.fetchCache._cache[this._prioritize()];
    Backbone.fetchCache.setLocalStorage();
  };

  Backbone.fetchCache.getLocalStorageKey = function() {
    return 'backboneCache';
  };

  if (typeof Backbone.fetchCache.localStorage === 'undefined') {
    Backbone.fetchCache.localStorage = true;
  }

  // Shared methods
  function getCacheKey(key, opts) {
    if (key && _.isObject(key)) {
      // If the model has its own, custom, cache key function, use it.
      if (_.isFunction(key.getCacheKey)) {
        return key.getCacheKey(opts);
      }
      // else, use the URL
      if (opts && opts.url) {
        key = opts.url;
      } else {
        key = _.isFunction(key.url) ? key.url() : key.url;
      }
    } else if (_.isFunction(key)) {
      return key(opts);
    }
    if (opts && opts.data) {
      if(typeof opts.data === 'string') {
        return key + '?' + opts.data;
      } else {
        return key + '?' + $.param(opts.data);
      }
    }
    return key;
  }

  function setCache(instance, opts, attrs) {
    opts = (opts || {});
    var key = Backbone.fetchCache.getCacheKey(instance, opts),
        expires = false,
        lastSync = (opts.lastSync || (new Date()).getTime()),
        prefillExpires = false;

    // Need url to use as cache key so return if we can't get it
    if (!key) { return; }

    // Never set the cache if user has explicitly said not to
    if (opts.cache === false) { return; }

    // Don't set the cache unless cache: true or prefill: true option is passed
    if (!(opts.cache || opts.prefill)) { return; }

    if (opts.expires !== false) {
      expires = (new Date()).getTime() + ((opts.expires || 5 * 60) * 1000);
    }

    if (opts.prefillExpires !== false) {
      prefillExpires = (new Date()).getTime() + ((opts.prefillExpires || 5 * 60) * 1000);
    }

    Backbone.fetchCache._cache[key] = {
      expires: expires,
      lastSync : lastSync,
      prefillExpires: prefillExpires,
      value: attrs
    };

    Backbone.fetchCache.setLocalStorage();
  }

  function getCache(key, opts) {
    if (_.isFunction(key)) {
      key = key();
    } else if (key && _.isObject(key)) {
      key = getCacheKey(key, opts);
    }

    return Backbone.fetchCache._cache[key];
  }

  function getLastSync(key, opts) {
    return getCache(key).lastSync;
  }

  function clearItem(key, opts) {
    if (_.isFunction(key)) {
      key = key();
    } else if (key && _.isObject(key)) {
      key = getCacheKey(key, opts);
    }
    delete Backbone.fetchCache._cache[key];
    Backbone.fetchCache.setLocalStorage();
  }

  function setLocalStorage() {
    if (!supportLocalStorage || !Backbone.fetchCache.localStorage) { return; }
    try {
      localStorage.setItem(Backbone.fetchCache.getLocalStorageKey(), JSON.stringify(Backbone.fetchCache._cache));
    } catch (err) {
      var code = err.code || err.number || err.message;
      if (code === 22 || code === 1014) {
        this._deleteCacheWithPriority();
      } else {
        throw(err);
      }
    }
  }

  function getLocalStorage() {
    if (!supportLocalStorage || !Backbone.fetchCache.localStorage) { return; }
    var json = localStorage.getItem(Backbone.fetchCache.getLocalStorageKey()) || '{}';
    Backbone.fetchCache._cache = JSON.parse(json);
  }

  function nextTick(fn) {
    return window.setTimeout(fn, 0);
  }

  // Instance methods
  Backbone.Model.prototype.fetch = function(opts) {
    //Bypass caching if it's not enabled
    if(!Backbone.fetchCache.enabled) {
      return superMethods.modelFetch.apply(this, arguments);
    }
    opts = _.defaults(opts || {}, { parse: true });
    var key = Backbone.fetchCache.getCacheKey(this, opts),
        data = getCache(key),
        expired = false,
        prefillExpired = false,
        attributes = false,
        deferred = new $.Deferred(),
        self = this;

    function isPrefilling() {
      return opts.prefill && (!opts.prefillExpires || prefillExpired);
    }

    function setData() {
      if (opts.parse) {
        attributes = self.parse(attributes, opts);
      }

      self.set(attributes, opts);
      if (_.isFunction(opts.prefillSuccess)) { opts.prefillSuccess(self, attributes, opts); }

      // Trigger sync events
      self.trigger('cachesync', self, attributes, opts);
      self.trigger('sync', self, attributes, opts);

      // Notify progress if we're still waiting for an AJAX call to happen...
      if (isPrefilling()) { deferred.notify(self); }
      // ...finish and return if we're not
      else {
        if (_.isFunction(opts.success)) { opts.success(self, attributes, opts); }
        deferred.resolve(self);
      }
    }

    if (data) {
      expired = data.expires;
      expired = expired && data.expires < (new Date()).getTime();
      prefillExpired = data.prefillExpires;
      prefillExpired = prefillExpired && data.prefillExpires < (new Date()).getTime();
      attributes = data.value;
    }

    if (!expired && (opts.cache || opts.prefill) && attributes) {
      // Ensure that cache resolution adhers to async option, defaults to true.
      if (opts.async == null) { opts.async = true; }

      if (opts.async) {
        nextTick(setData);
      } else {
        setData();
      }

      if (!isPrefilling()) {
        return deferred;
      }
    }

    // Delegate to the actual fetch method and store the attributes in the cache
    var jqXHR = superMethods.modelFetch.apply(this, arguments);
    // resolve the returned promise when the AJAX call completes
    jqXHR.done( _.bind(deferred.resolve, this, this) )
      // Set the new data in the cache
      .done( _.bind(Backbone.fetchCache.setCache, null, this, opts) )
      // Reject the promise on fail
      .fail( _.bind(deferred.reject, this, this) );

    deferred.abort = jqXHR.abort;

    // return a promise which provides the same methods as a jqXHR object
    return deferred;
  };

  // Override Model.prototype.sync and try to clear cache items if it looks
  // like they are being updated.
  Backbone.Model.prototype.sync = function(method, model, options) {
    // Only empty the cache if we're doing a create, update, patch or delete.
    // or caching is not enabled
    if (method === 'read' || !Backbone.fetchCache.enabled) {
      return superMethods.modelSync.apply(this, arguments);
    }

    var collection = model.collection,
        keys = [],
        i, len;

    // Build up a list of keys to delete from the cache, starting with this
    keys.push(Backbone.fetchCache.getCacheKey(model, options));

    // If this model has a collection, also try to delete the cache for that
    if (!!collection) {
      keys.push(Backbone.fetchCache.getCacheKey(collection));
    }

    // Empty cache for all found keys
    for (i = 0, len = keys.length; i < len; i++) { clearItem(keys[i]); }

    return superMethods.modelSync.apply(this, arguments);
  };

  Backbone.Collection.prototype.fetch = function(opts) {
    // Bypass caching if it's not enabled
    if(!Backbone.fetchCache.enabled) {
      return superMethods.collectionFetch.apply(this, arguments);
    }

    opts = _.defaults(opts || {}, { parse: true });
    var key = Backbone.fetchCache.getCacheKey(this, opts),
        data = getCache(key),
        expired = false,
        prefillExpired = false,
        attributes = false,
        deferred = new $.Deferred(),
        self = this;

    function isPrefilling() {
      return opts.prefill && (!opts.prefillExpires || prefillExpired);
    }

    function setData() {
      self[opts.reset ? 'reset' : 'set'](attributes, opts);
      if (_.isFunction(opts.prefillSuccess)) { opts.prefillSuccess(self); }

      // Trigger sync events
      self.trigger('cachesync', self, attributes, opts);
      self.trigger('sync', self, attributes, opts);

      // Notify progress if we're still waiting for an AJAX call to happen...
      if (isPrefilling()) { deferred.notify(self); }
      // ...finish and return if we're not
      else {
        if (_.isFunction(opts.success)) { opts.success(self, attributes, opts); }
        deferred.resolve(self);
      }
    }

    if (data) {
      expired = data.expires;
      expired = expired && data.expires < (new Date()).getTime();
      prefillExpired = data.prefillExpires;
      prefillExpired = prefillExpired && data.prefillExpires < (new Date()).getTime();
      attributes = data.value;
    }

    if (!expired && (opts.cache || opts.prefill) && attributes) {
      // Ensure that cache resolution adhers to async option, defaults to true.
      if (opts.async == null) { opts.async = true; }

      if (opts.async) {
        nextTick(setData);
      } else {
        setData();
      }

      if (!isPrefilling()) {
        return deferred;
      }
    }

    // Delegate to the actual fetch method and store the attributes in the cache
    var jqXHR = superMethods.collectionFetch.apply(this, arguments);
    // resolve the returned promise when the AJAX call completes
    jqXHR.done( _.bind(deferred.resolve, this, this) )
      // Set the new data in the cache
      .done( _.bind(Backbone.fetchCache.setCache, null, this, opts) )
      // Reject the promise on fail
      .fail( _.bind(deferred.reject, this, this) );

    deferred.abort = jqXHR.abort;

    // return a promise which provides the same methods as a jqXHR object
    return deferred;
  };

  // Prime the cache from localStorage on initialization
  getLocalStorage();

  // Exports

  Backbone.fetchCache._superMethods = superMethods;
  Backbone.fetchCache.setCache = setCache;
  Backbone.fetchCache.getCache = getCache;
  Backbone.fetchCache.getCacheKey = getCacheKey;
  Backbone.fetchCache.getLastSync = getLastSync;
  Backbone.fetchCache.clearItem = clearItem;
  Backbone.fetchCache.setLocalStorage = setLocalStorage;
  Backbone.fetchCache.getLocalStorage = getLocalStorage;

  return Backbone;
}));
