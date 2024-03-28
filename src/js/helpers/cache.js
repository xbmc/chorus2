/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Our cache storage, persists only for app lifecycle
  Eg. gets wiped when page reloaded.
*/
helpers.cache = {
  store: {},
  defaultExpiry: 406800 //# 7days
};

//# Set a cached object
helpers.cache.set = function(key, data, expires) {
  if (expires == null) { expires = helpers.cache.defaultExpiry; }
  helpers.cache.store[key] = {
    data,
    expires: expires + helpers.global.time(),
    key
  };
  return data;
};

//# Get a cached object
helpers.cache.get = function(key, fallback) {
  if (fallback == null) { fallback = false; }
  if ((helpers.cache.store[key] != null) && (helpers.cache.store[key].expires >= helpers.global.time())) {
    return helpers.cache.store[key].data;
  } else {
    return fallback;
  }
};

//# Delete a cached object
helpers.cache.del = function(key) {
  if (helpers.cache.store[key] != null) {
    return delete helpers.cache.store[key];
  }
};

//# Clear all caches
helpers.cache.clear = () => helpers.cache.store = {};

//# Update a property of a model in a backbone collection so we don't
//# have to clear the entire collection cache.
//# TODO: See if this can be replaced with: Backbone.fetchCache.clearItem(updatedModel)
helpers.cache.updateCollection = function(collectionKey, responseKey, modelId, property, value) {
  if ((Backbone.fetchCache._cache != null) && (Backbone.fetchCache._cache[collectionKey] != null) && (Backbone.fetchCache._cache[collectionKey].value.result != null)) {
    if (Backbone.fetchCache._cache[collectionKey].value.result[responseKey] != null) {
      return (() => {
        const result = [];
        for (var i in Backbone.fetchCache._cache[collectionKey].value.result[responseKey]) {
          var item = Backbone.fetchCache._cache[collectionKey].value.result[responseKey][i];
          if (item.id === modelId) {
            result.push(Backbone.fetchCache._cache[collectionKey].value.result[responseKey][parseInt(i)][property] = value);
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
};
