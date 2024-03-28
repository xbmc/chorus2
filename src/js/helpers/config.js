/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Config Helpers.
  - Use config.get/set with 'app' as the type, to get/set persistent settings (localstorage)
  - Use config.getLocal/setLocal to get set temp storage
*/

// A wrapper for getting a config value.
config.get = function(type, id, defaultData = '', callback) {
  const data = Kodi.request(`config:${type}:get`, id, defaultData);
  if (callback != null) {
    callback(data);
  }
  return data;
};

// A wrapper for setting a config value.
config.set = function(type, id, data, callback) {
  const resp = Kodi.request(`config:${type}:set`, id, data);
  if (callback != null) {
    callback(resp);
  }
  return resp;
};

// A wrapper for getting a local setting (static)
config.getLocal = (id, defaultData, callback) => config.get('static', id, defaultData, callback);

// A wrapper for setting a local setting (static)
config.setLocal = (id, data, callback) => config.set('static', id, data, callback);

config.setLocalApp = () => config.set('static', id, data, callback);

// A wrapper for getting an API Key.
config.getAPIKey = function(id, defaultData = '') {
  const key = config.getLocal(id, '');
  if (key === '') { return atob(defaultData); } else { return key; }
};

// Wrapper for getting a config value before app has started.
// Should always try and use config.get() before this.
config.preStartGet = function(id, defaultData = '') {
  if ((typeof localStorage !== 'undefined' && localStorage !== null) && (localStorage.getItem('config:app-config:local') != null)) {
    const config = JSON.parse(localStorage.getItem('config:app-config:local')).data;
    if (config[id] != null) {
      return config[id];
    }
  }
  return defaultData;
};
