var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

this.helpers = {};

this.config = {
  "static": {
    appTitle: 'Kodi',
    jsonRpcEndpoint: 'jsonrpc',
    socketsHost: location.hostname,
    socketsPort: 9090,
    ajaxTimeout: 5000,
    hashKey: 'kodi',
    defaultPlayer: 'auto',
    ignoreArticle: true,
    pollInterval: 10000,
    reverseProxy: false,
    albumAtristsOnly: true,
    searchIndexCacheExpiry: 24 * 60 * 60,
    collectionCacheExpiry: 7 * 24 * 60 * 60,
    addOnsLoaded: false,
    lang: "en"
  }
};

this.Kodi = (function(Backbone, Marionette) {
  var App;
  App = new Backbone.Marionette.Application();
  App.addRegions({
    root: "body"
  });
  App.on("before:start", function() {
    return config["static"] = _.extend(config["static"], config.get('app', 'config:local', config["static"]));
  });
  App.vent.on("shell:ready", (function(_this) {
    return function(options) {
      return App.startHistory();
    };
  })(this));
  return App;
})(Backbone, Marionette);

$(document).ready((function(_this) {
  return function() {
    return helpers.translate.init(function() {
      Kodi.start();
      return $.material.init();
    });
  };
})(this));


/*
  Helper to return you to the same scroll position on the last page.
 */

helpers.backscroll = {
  lastPath: '',
  lastScroll: 0,
  setLast: function() {
    this.lastPath = location.hash;
    return this.lastScroll = document.body.scrollTop;
  },
  scrollToLast: function() {
    var scrollPos;
    scrollPos = this.lastPath === location.hash ? this.lastScroll : 0;
    return window.scrollTo(0, scrollPos);
  }
};


/*
  Our cache storage, persists only for app lifycle
  Eg. gets wiped when page reloaded.
 */

helpers.cache = {
  store: {},
  defaultExpiry: 406800
};

helpers.cache.set = function(key, data, expires) {
  if (expires == null) {
    expires = helpers.cache.defaultExpiry;
  }
  helpers.cache.store[key] = {
    data: data,
    expires: expires + helpers.global.time(),
    key: key
  };
  return data;
};

helpers.cache.get = function(key, fallback) {
  if (fallback == null) {
    fallback = false;
  }
  if ((helpers.cache.store[key] != null) && helpers.cache.store[key].expires >= helpers.global.time()) {
    return helpers.cache.store[key].data;
  } else {
    return fallback;
  }
};

helpers.cache.del = function(key) {
  if (helpers.cache.store[key] != null) {
    return delete helpers.cache.store[key];
  }
};

helpers.cache.clear = function() {
  return helpers.cache.store = {};
};

helpers.cache.updateCollection = function(collectionKey, responseKey, modelId, property, value) {
  var i, item, _ref, _results;
  if ((Backbone.fetchCache._cache != null) && (Backbone.fetchCache._cache[collectionKey] != null) && (Backbone.fetchCache._cache[collectionKey].value.result != null)) {
    if (Backbone.fetchCache._cache[collectionKey].value.result[responseKey] != null) {
      _ref = Backbone.fetchCache._cache[collectionKey].value.result[responseKey];
      _results = [];
      for (i in _ref) {
        item = _ref[i];
        if (item.id === modelId) {
          _results.push(Backbone.fetchCache._cache[collectionKey].value.result[responseKey][parseInt(i)][property] = value);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  }
};


/*
  Config Helpers.
 */

config.get = function(type, id, defaultData, callback) {
  var data;
  if (defaultData == null) {
    defaultData = '';
  }
  data = Kodi.request("config:" + type + ":get", id, defaultData);
  if (callback != null) {
    callback(data);
  }
  return data;
};

config.set = function(type, id, data, callback) {
  var resp;
  resp = Kodi.request("config:" + type + ":set", id, data);
  if (callback != null) {
    callback(resp);
  }
  return resp;
};


/*
  Entities mixins, all the common things we do/need on almost every collection

  example of usage:

  collection = new KodiCollection()
    .setEntityType 'collection'
    .setEntityKey 'movie'
    .setEntityFields 'small', ['thumbnail', 'title']
    .setEntityFields 'full', ['fanart', 'genre']
    .setMethod 'VideoLibrary.GetMovies'
    .setArgHelper 'fields'
    .setArgHelper 'limit'
    .setArgHelper 'sort'
    .applySettings()
 */

if (this.KodiMixins == null) {
  this.KodiMixins = {};
}

KodiMixins.Entities = {
  url: function() {
    return helpers.url.baseKodiUrl("Mixins");
  },
  rpc: new Backbone.Rpc({
    useNamedParameters: true,
    namespaceDelimiter: ''
  }),

  /*
    Overrides!
   */

  /*
    Apply all the defined settings.
   */
  applySettings: function() {
    if (this.entityType === 'model') {
      return this.setModelDefaultFields();
    }
  },

  /*
    What kind of entity are we dealing with. collection or model
   */
  entityType: 'model',
  setEntityType: function(type) {
    this.entityType = type;
    return this;
  },

  /*
    Entity Keys, properties that change between the entities
   */
  entityKeys: {
    type: '',
    modelResponseProperty: '',
    collectionResponseProperty: '',
    idProperty: ''
  },
  setEntityKey: function(key, value) {
    this.entityKeys[key] = value;
    return this;
  },
  getEntityKey: function(key) {
    var ret, type;
    type = this.entityKeys.type;
    switch (key) {
      case 'modelResponseProperty':
        ret = this.entityKeys[key] != null ? this.entityKeys[key] : type + 'details';
        break;
      case 'collectionResponseProperty':
        ret = this.entityKeys[key] != null ? this.entityKeys[key] : type + 's';
        break;
      case 'idProperty':
        ret = this.entityKeys[key] != null ? this.entityKeys[key] : type + 'id';
        break;
      default:
        ret = type;
    }
    return ret;
  },

  /*
    The types of fields we request, minimal for search, small for list, full for page.
   */
  entitiyFields: {
    minimal: [],
    small: [],
    full: []
  },
  setEntityFields: function(type, fields) {
    if (fields == null) {
      fields = [];
    }
    this.entitiyFields[type] = fields;
    return this;
  },
  getEntityFields: function(type) {
    var fields;
    fields = this.entitiyFields.minimal;
    if (type === 'full') {
      return fields.concat(this.entitiyFields.small).concat(this.entitiyFields.full);
    } else if (type === 'small') {
      return fields.concat(this.entitiyFields.small);
    } else {
      return fields;
    }
  },
  modelDefaults: {
    id: 0,
    fullyloaded: false,
    thumbnail: '',
    thumbsUp: false
  },
  setModelDefaultFields: function(defaultFields) {
    var field, _i, _len, _ref, _results;
    if (defaultFields == null) {
      defaultFields = {};
    }
    defaultFields = _.extend(this.modelDefaults, defaultFields);
    _ref = this.getEntityFields('full');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      field = _ref[_i];
      _results.push(this.defaults[field] = '');
    }
    return _results;
  },

  /*
    JsonRPC common paterns and helpers.
   */
  callMethodName: '',
  callArgs: [],
  callIgnoreArticle: true,
  setMethod: function(method) {
    this.callMethodName = method;
    return this;
  },
  setArgStatic: function(callback) {
    this.callArgs.push(callback);
    return this;
  },
  setArgHelper: function(helper, param1, param2) {
    var func;
    func = 'argHelper' + helper;
    this.callArgs.push(this[func](param1, param2));
    return this;
  },
  argCheckOption: function(option, fallback) {
    if ((this.options != null) && (this.options[option] != null)) {
      return this.options[option];
    } else {
      return fallback;
    }
  },
  argHelperfields: function(type) {
    var arg;
    if (type == null) {
      type = 'small';
    }
    arg = this.getEntityFields(type);
    return this.argCheckOption('fields', arg);
  },
  argHelpersort: function(method, order) {
    var arg;
    if (order == null) {
      order = 'ascending';
    }
    arg = {
      method: method,
      order: order,
      ignorearticle: this.callIgnoreArticle
    };
    return this.argCheckOption('sort', arg);
  },
  argHelperlimit: function(start, end) {
    var arg;
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = 'all';
    }
    arg = {
      start: start
    };
    if (end !== 'all') {
      arg.end = end;
    }
    return this.argCheckOption('limit', arg);
  },
  argHelperfilter: function(name, value) {
    var arg;
    arg = {};
    if (name != null) {
      arg[name] = value;
    }
    return this.argCheckOption('filter', arg);
  },
  buildRpcRequest: function(type) {
    var arg, func, key, req, _i, _len, _ref;
    if (type == null) {
      type = 'read';
    }
    req = [this.callMethodName];
    _ref = this.callArgs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      arg = _ref[_i];
      func = 'argHelper' + arg;
      if (typeof func === 'function') {
        key = 'arg' + req.length;
        req.push(key);
        this[key] = func;
      } else {
        req.push(arg);
      }
    }
    return req;
  }
};


/*
  Handle errors.
 */

helpers.debug = {
  verbose: false
};


/*
  Debug styles

  @param severity
  The severity level: info, success, warning, error
 */

helpers.debug.consoleStyle = function(severity) {
  var defaults, mods, prop, styles;
  if (severity == null) {
    severity = 'error';
  }
  defaults = {
    background: "#ccc",
    padding: "0 5px",
    color: "#444",
    "font-weight": "bold",
    "font-size": "110%"
  };
  styles = [];
  mods = {
    info: "#D8FEFE",
    success: "#CCFECD",
    warning: "#FFFDD9",
    error: "#FFCECD"
  };
  defaults.background = mods[severity];
  for (prop in defaults) {
    styles.push(prop + ": " + defaults[prop]);
  }
  return styles.join("; ");
};


/*
  Basic debug message
 */

helpers.debug.msg = function(msg, severity, data) {
  if (severity == null) {
    severity = 'info';
  }
  if (typeof console !== "undefined" && console !== null) {
    console.log("%c " + msg, helpers.debug.consoleStyle(severity));
    if (data != null) {
      return console.log(data);
    }
  }
};


/*
  Log a deubg error message.
 */

helpers.debug.log = function(msg, data, severity, caller) {
  if (data == null) {
    data = 'No data provided';
  }
  if (severity == null) {
    severity = 'error';
  }
  if (caller == null) {
    caller = arguments.callee.caller.toString();
  }
  if ((data[0] != null) && data[0].error === "Internal server error") {

  } else {
    if (typeof console !== "undefined" && console !== null) {
      console.log("%c Error in: " + msg, helpers.debug.consoleStyle(severity), data);
      if (helpers.debug.verbose && caller !== false) {
        return console.log(caller);
      }
    }
  }
};


/*
  Request Error.
 */

helpers.debug.rpcError = function(commands, data) {
  var detail, msg;
  detail = {
    called: commands
  };
  msg = '';
  if (data.error && data.error.message) {
    msg = '"' + data.error.message + '"';
    detail.error = data.error;
  } else {
    detail.error = data;
  }
  return helpers.debug.log("jsonRPC request - " + msg, detail, 'error');
};


/*
  Entity Helpers
 */

helpers.entities = {};

helpers.entities.getFields = function(set, type) {
  var fields;
  if (type == null) {
    type = 'small';
  }
  fields = set.minimal;
  if (type === 'full') {
    return fields.concat(set.small).concat(set.full);
  } else if (type === 'small') {
    return fields.concat(set.small);
  } else {
    return fields;
  }
};

helpers.entities.getSubtitle = function(model) {
  var subtitle;
  switch (model.type) {
    case 'song':
      subtitle = model.artist.join(',');
      break;
    default:
      subtitle = '';
  }
  return subtitle;
};

helpers.entities.playingLink = function(model) {
  return "<a href='#" + model.url + "'>" + model.label + "</a>";
};

helpers.entities.isWatched = function(model) {
  var watched;
  watched = false;
  if ((model != null) && model.get('playcount')) {
    watched = model.get('playcount') > 0 ? true : false;
  }
  return watched;
};


/*
  Our generic global helpers so we dont have add complexity to our app.
 */

helpers.global = {};

helpers.global.shuffle = function(array) {
  var i, j, temp;
  i = array.length - 1;
  while (i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    i--;
  }
  return array;
};

helpers.global.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

helpers.global.time = function() {
  var timestamp;
  timestamp = new Date().getTime();
  return timestamp / 1000;
};

helpers.global.inArray = function(needle, haystack) {
  return _.indexOf(haystack, needle) > -1;
};

helpers.global.loading = (function(_this) {
  return function(state) {
    var op;
    if (state == null) {
      state = 'start';
    }
    op = state === 'start' ? 'add' : 'remove';
    if (_this.Kodi != null) {
      return _this.Kodi.execute("body:state", op, "loading");
    }
  };
})(this);

helpers.global.numPad = function(num, size) {
  var s;
  s = "000000000" + num;
  return s.substr(s.length - size);
};

helpers.global.secToTime = function(totalSec) {
  var hours, minutes, seconds;
  if (totalSec == null) {
    totalSec = 0;
  }
  totalSec = Math.round(totalSec);
  hours = parseInt(totalSec / 3600) % 24;
  minutes = parseInt(totalSec / 60) % 60;
  seconds = totalSec % 60;
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
};

helpers.global.timeToSec = function(time) {
  var hours, minutes;
  hours = parseInt(time.hours) * (60 * 60);
  minutes = parseInt(time.minutes) * 60;
  return parseInt(hours) + parseInt(minutes) + parseInt(time.seconds);
};

helpers.global.epgDateTimeToJS = function(datetime) {
  if (!datetime) {
    return new Date(0);
  } else {
    return new Date(datetime.replace(" ", "t"));
  }
};

helpers.global.formatTime = function(time) {
  var hrStr;
  if (time == null) {
    return 0;
  } else {
    hrStr = "";
    if (time.hours > 0) {
      if (time.hours < 10) {
        hrStr = "0";
      }
      hrStr += time.hours + ':';
    }
    return hrStr + (time.minutes<10 ? '0' : '') + time.minutes + ':' + (time.seconds<10 ? '0' : '') + time.seconds;
  }
};

helpers.global.paramObj = function(key, value) {
  var obj;
  obj = {};
  obj[key] = value;
  return obj;
};

helpers.global.stringStartsWith = function(start, data) {
  return new RegExp('^' + start).test(data);
};

helpers.global.stringStripStartsWith = function(start, data) {
  return data.substring(start.length);
};

helpers.global.hash = function(op, value) {
  if (op === 'encode') {
    return encodeURIComponent(value);
  } else {
    return decodeURIComponent(value);
  }
};

helpers.global.rating = function(rating) {
  return Math.round(rating * 10) / 10;
};

helpers.global.appTitle = function(playingItem) {
  var titlePrefix;
  if (playingItem == null) {
    playingItem = false;
  }
  titlePrefix = '';
  if (_.isObject(playingItem) && (playingItem.label != null)) {
    titlePrefix = '▶ ' + playingItem.label + ' | ';
  }
  return document.title = titlePrefix + config.get('static', 'appTitle');
};

helpers.global.localVideoPopup = function(path, height) {
  if (height == null) {
    height = 545;
  }
  return window.open(path, "_blank", "toolbar=no, scrollbars=no, resizable=yes, width=925, height=" + height + ", top=100, left=100");
};

helpers.global.stripTags = function(string) {
  if (string != null) {
    return string.replace(/(<([^>]+)>)/ig, "");
  } else {
    return '';
  }
};


/*
  A collection of small jquery plugin helpers.
 */

$.fn.removeClassRegex = function(regex) {
  return $(this).removeClass(function(index, classes) {
    return classes.split(/\s+/).filter(function(c) {
      return regex.test(c);
    }).join(' ');
  });
};

$.fn.removeClassStartsWith = function(startsWith) {
  var regex;
  regex = new RegExp('^' + startsWith, 'g');
  return $(this).removeClassRegex(regex);
};

$.fn.scrollStopped = function(callback) {
  var $this, self;
  $this = $(this);
  self = this;
  return $this.scroll(function() {
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    return $this.data('scrollTimeout', setTimeout(callback, 250, self));
  });
};

$.fn.resizeStopped = function(callback) {
  var $this, self;
  $this = $(this);
  self = this;
  return $this.resize(function() {
    if ($this.data('resizeTimeout')) {
      clearTimeout($this.data('resizeTimeout'));
    }
    return $this.data('resizeTimeout', setTimeout(callback, 250, self));
  });
};

$(document).ready(function() {
  $('.dropdown li').on('click', function() {
    return $(this).closest('.dropdown').removeClass('open');
  });
  return $('.dropdown').on('click', function() {
    return $(this).removeClass('open').trigger('hide.bs.dropdown');
  });
});


/*
  Stream helpers
 */

helpers.stream = {};


/*
  Maps.
 */

helpers.stream.videoSizeMap = [
  {
    min: 0,
    max: 360,
    label: 'SD'
  }, {
    min: 361,
    max: 480,
    label: '480'
  }, {
    min: 481,
    max: 720,
    label: '720p'
  }, {
    min: 721,
    max: 1080,
    label: '1080p'
  }, {
    min: 1081,
    max: 100000,
    label: '4K'
  }
];

helpers.stream.audioChannelMap = [
  {
    channels: 6,
    label: '5.1'
  }, {
    channels: 8,
    label: '7.1'
  }, {
    channels: 2,
    label: '2.1'
  }, {
    channels: 1,
    label: 'mono'
  }
];

helpers.stream.langMap = {
  'eng': 'English',
  'und': 'Unknown',
  'bul': 'Bulgaria',
  'ara': 'Arabic',
  'zho': 'Chinese',
  'ces': 'Czech',
  'dan': 'Danish',
  'nld': 'Netherland',
  'fin': 'Finish',
  'fra': 'French',
  'deu': 'German',
  'nor': 'Norwegian',
  'pol': 'Polish',
  'por': 'Portuguese',
  'ron': 'Romanian',
  'spa': 'Spanish',
  'swe': 'Swedish',
  'tur': 'Turkish',
  'vie': 'Vietnamese'
};


/*
  Formatters.
 */

helpers.stream.videoFormat = function(videoStreams) {
  var i, match, stream;
  for (i in videoStreams) {
    stream = videoStreams[i];
    match = {
      label: 'SD'
    };
    if (stream.height && stream.height > 0) {
      match = _.find(helpers.stream.videoSizeMap, function(res) {
        var _ref;
        if ((res.min < (_ref = stream.height) && _ref <= res.max)) {
          return true;
        } else {
          return false;
        }
      });
    }
    videoStreams[i].label = stream.codec + ' ' + match.label + ' (' + stream.width + ' x ' + stream.height + ')';
    videoStreams[i].shortlabel = stream.codec + ' ' + match.label;
    videoStreams[i].res = match.label;
  }
  return videoStreams;
};

helpers.stream.formatLanguage = function(lang) {
  if (helpers.stream.langMap[lang]) {
    return helpers.stream.langMap[lang];
  } else {
    return lang;
  }
};

helpers.stream.audioFormat = function(audioStreams) {
  var ch, i, lang, stream;
  for (i in audioStreams) {
    stream = audioStreams[i];
    ch = _.findWhere(helpers.stream.audioChannelMap, {
      channels: stream.channels
    });
    ch = ch ? ch.label : stream.channels;
    lang = '';
    if (stream.language !== '') {
      lang = ' (' + helpers.stream.formatLanguage(stream.language) + ')';
    }
    audioStreams[i].label = stream.codec + ' ' + ch + lang;
    audioStreams[i].shortlabel = stream.codec + ' ' + ch;
    audioStreams[i].ch = ch;
  }
  return audioStreams;
};

helpers.stream.subtitleFormat = function(subtitleStreams) {
  var i, stream;
  for (i in subtitleStreams) {
    stream = subtitleStreams[i];
    subtitleStreams[i].label = helpers.stream.formatLanguage(stream.language);
    subtitleStreams[i].shortlabel = helpers.stream.formatLanguage(stream.language);
  }
  return subtitleStreams;
};

helpers.stream.streamFormat = function(streams) {
  var streamTypes, type, _i, _len;
  streamTypes = ['audio', 'video', 'subtitle'];
  for (_i = 0, _len = streamTypes.length; _i < _len; _i++) {
    type = streamTypes[_i];
    if (streams[type] && streams[type].length > 0) {
      streams[type] = helpers.stream[type + 'Format'](streams[type]);
    } else {
      streams[type] = [];
    }
  }
  return streams;
};


/*
  For everything translatable.
 */

helpers.translate = {};

helpers.translate.getLanguages = function() {
  return {
    en: "English",
    gr: "German",
    fr: "French"
  };
};

helpers.translate.init = function(callback) {
  var defaultLang, lang;
  defaultLang = config.get("static", "lang", "en");
  lang = JSON.parse(localStorage.getItem('config:app-config:local')).data.lang || defaultLang;
  return $.getJSON("lang/" + lang + ".json", function(data) {
    window.t = new Jed(data);
    t.options["missing_key_callback"] = function(key) {
      return console.error(key);
    };
    return callback();
  });
};


/*
  Handle urls.
 */

helpers.url = {};

helpers.url.map = {
  artist: 'music/artist/:id',
  album: 'music/album/:id',
  song: 'music/song/:id',
  movie: 'movie/:id',
  tvshow: 'tvshow/:id',
  season: 'tvshow/:id',
  episode: 'tvshow/:tvshowid/:season/:id',
  channeltv: 'tvshows/live/:id',
  channelradio: 'music/radio/:id',
  file: 'browser/file/:id',
  playlist: 'playlist/:id'
};

helpers.url.baseKodiUrl = function(query) {
  var path;
  if (query == null) {
    query = 'Kodi';
  }
  path = (config.get('static', 'jsonRpcEndpoint')) + "?" + query;
  if (config.get('static', 'reverseProxy')) {
    return path;
  } else {
    return "/" + path;
  }
};

helpers.url.get = function(type, id, replacements) {
  var path, token;
  if (id == null) {
    id = '';
  }
  if (replacements == null) {
    replacements = {};
  }
  path = '';
  if (helpers.url.map[type] != null) {
    path = helpers.url.map[type];
  }
  replacements[':id'] = id;
  for (token in replacements) {
    id = replacements[token];
    path = path.replace(token, id);
  }
  return path;
};

helpers.url.filterLinks = function(entities, key, items, limit) {
  var baseUrl, i, item, links;
  if (limit == null) {
    limit = 5;
  }
  baseUrl = '#' + entities + '?' + key + '=';
  links = [];
  for (i in items) {
    item = items[i];
    if (i < limit) {
      links.push('<a href="' + baseUrl + encodeURIComponent(item) + '">' + item + '</a>');
    }
  }
  return links.join(', ');
};

helpers.url.playlistUrl = function(item) {
  if (item.type === 'song') {
    if (item.albumid !== '') {
      item.url = helpers.url.get('album', item.albumid);
    } else {
      item.url('music/albums');
    }
  }
  return item.url;
};

helpers.url.arg = function(arg) {
  var args, hash;
  if (arg == null) {
    arg = 'none';
  }
  hash = location.hash;
  args = hash.substring(1).split('/');
  if (arg === 'none') {
    return args;
  } else if (args[arg] != null) {
    return args[arg];
  } else {
    return '';
  }
};

helpers.url.params = function(params) {
  var p, path, query, _ref;
  if (params == null) {
    params = 'auto';
  }
  if (params === 'auto') {
    p = document.location.href;
    if (p.indexOf('?') === -1) {
      return {};
    } else {
      _ref = p.split('?'), path = _ref[0], query = _ref[1];
    }
  }
  if (query == null) {
    query = params;
  }
  return _.object(_.compact(_.map(query.split('&'), function(item) {
    if (item) {
      return item.split('=');
    }
  })));
};

helpers.url.buildParams = function(params) {
  var key, q, val;
  q = [];
  for (key in params) {
    val = params[key];
    q.push(key + '=' + encodeURIComponent(val));
  }
  return '?' + q.join('&');
};

helpers.url.alterParams = function(add, remove) {
  var curParams, k, params, _i, _len;
  if (add == null) {
    add = {};
  }
  if (remove == null) {
    remove = [];
  }
  curParams = helpers.url.params();
  if (remove.length > 0) {
    for (_i = 0, _len = remove.length; _i < _len; _i++) {
      k = remove[_i];
      delete curParams[k];
    }
  }
  params = _.extend(curParams, add);
  return helpers.url.path() + helpers.url.buildParams(params);
};

helpers.url.path = function() {
  var p, path, query, _ref;
  p = document.location.hash;
  _ref = p.split('?'), path = _ref[0], query = _ref[1];
  return path.substring(1);
};

helpers.url.imdbUrl = function(imdbNumber, text) {
  var url;
  url = "http://www.imdb.com/title/" + imdbNumber + "/";
  return "<a href='" + url + "' class='imdblink' target='_blank'>" + (t.gettext(text)) + "</a>";
};

helpers.url.parseTrailerUrl = function(trailer) {
  var ret, urlParts;
  ret = {
    source: '',
    id: '',
    img: '',
    url: ''
  };
  urlParts = helpers.url.params(trailer);
  if (trailer.indexOf('youtube') > -1) {
    ret.source = 'youtube';
    ret.id = urlParts.videoid;
    ret.img = "http://img.youtube.com/vi/" + ret.id + "/0.jpg";
    ret.url = "https://www.youtube.com/watch?v=" + ret.id;
  }
  return ret;
};

Cocktail.patch(Backbone);

(function(Backbone) {
  var methods, _sync;
  _sync = Backbone.sync;
  Backbone.sync = function(method, entity, options) {
    var sync;
    if (options == null) {
      options = {};
    }
    _.defaults(options, {
      beforeSend: _.bind(methods.beforeSend, entity),
      complete: _.bind(methods.complete, entity)
    });
    sync = _sync(method, entity, options);
    if (!entity._fetch && method === "read") {
      return entity._fetch = sync;
    }
  };
  return methods = {
    beforeSend: function() {
      return this.trigger("sync:start", this);
    },
    complete: function() {
      return this.trigger("sync:stop", this);
    }
  };
})(Backbone);

(function(Backbone) {
  return _.extend(Backbone.Marionette.Application.prototype, {
    navigate: function(route, options) {
      if (options == null) {
        options = {};
      }
      return Backbone.history.navigate(route, options);
    },
    getCurrentRoute: function() {
      var frag;
      frag = Backbone.history.fragment;
      if (_.isEmpty(frag)) {
        return null;
      } else {
        return frag;
      }
    },
    startHistory: function() {
      if (Backbone.history) {
        return Backbone.history.start();
      }
    },
    register: function(instance, id) {
      if (this._registry == null) {
        this._registry = {};
      }
      return this._registry[id] = instance;
    },
    unregister: function(instance, id) {
      return delete this._registry[id];
    },
    resetRegistry: function() {
      var controller, key, msg, oldCount, _ref;
      oldCount = this.getRegistrySize();
      _ref = this._registry;
      for (key in _ref) {
        controller = _ref[key];
        controller.region.close();
      }
      msg = "There were " + oldCount + " controllers in the registry, there are now " + (this.getRegistrySize());
      if (this.getRegistrySize() > 0) {
        return console.warn(msg, this._registry);
      } else {
        return console.log(msg);
      }
    },
    getRegistrySize: function() {
      return _.size(this._registry);
    }
  });
})(Backbone);

(function(Marionette) {
  return _.extend(Marionette.Renderer, {
    extension: [".jst"],
    render: function(template, data) {
      var path;
      path = this.getTemplate(template);
      if (!path) {
        throw "Template " + template + " not found!";
      }
      return path(data);
    },
    getTemplate: function(template) {
      var path;
      path = this.insertAt(template.split("/"), -1, "tpl").join("/");
      path = path + this.extension;
      if (JST[path]) {
        return JST[path];
      }
    },
    insertAt: function(array, index, item) {
      array.splice(index, 0, item);
      return array;
    }
  });
})(Marionette);

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  return Entities.Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.getRawCollection = function() {
      var model, objs, _i, _len, _ref;
      objs = [];
      if (this.models.length > 0) {
        _ref = this.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          objs.push(model.attributes);
        }
      }
      return objs;
    };

    Collection.prototype.getCacheKey = function(options) {
      var key;
      key = this.constructor.name;
      return key;
    };

    Collection.prototype.autoSort = function(params) {
      var order;
      if (params.sort) {
        order = params.order ? params.order : 'asc';
        return this.sortCollection(params.sort, order);
      }
    };

    Collection.prototype.sortCollection = function(property, order) {
      if (order == null) {
        order = 'asc';
      }
      this.comparator = (function(_this) {
        return function(model) {
          return _this.ignoreArticleParse(model.get(property));
        };
      })(this);
      if (order === 'desc') {
        this.comparator = this.reverseSortBy(this.comparator);
      }
      this.sort();
    };

    Collection.prototype.reverseSortBy = function(sortByFunction) {
      return function(left, right) {
        var l, r;
        l = sortByFunction(left);
        r = sortByFunction(right);
        if (l === void 0) {
          return -1;
        }
        if (r === void 0) {
          return 1;
        }
        if (l < r) {
          return 1;
        } else if (l > r) {
          return -1;
        } else {
          return 0;
        }
      };
    };

    Collection.prototype.ignoreArticleParse = function(string) {
      var articles, parsed, s, _i, _len;
      articles = ["'", '"', 'the ', 'a '];
      if (typeof string === 'string' && config.get('static', 'ignoreArticle', true)) {
        string = string.toLowerCase();
        parsed = false;
        for (_i = 0, _len = articles.length; _i < _len; _i++) {
          s = articles[_i];
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
    };

    return Collection;

  })(Backbone.Collection);
});

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  return Entities.Filtered = (function(_super) {
    __extends(Filtered, _super);

    function Filtered() {
      return Filtered.__super__.constructor.apply(this, arguments);
    }

    Filtered.prototype.filterByMultiple = function(key, values) {
      if (values == null) {
        values = [];
      }
      return this.filterBy(key, function(model) {
        return helpers.global.inArray(model.get(key), values);
      });
    };

    Filtered.prototype.filterByMultipleArray = function(key, values) {
      if (values == null) {
        values = [];
      }
      return this.filterBy(key, function(model) {
        var match, v, _i, _len, _ref;
        match = false;
        _ref = model.get(key);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          if (helpers.global.inArray(v, values)) {
            match = true;
          }
        }
        return match;
      });
    };

    Filtered.prototype.filterByMultipleObject = function(key, property, values) {
      if (values == null) {
        values = [];
      }
      return this.filterBy(key, function(model) {
        var items, match, v, _i, _len;
        match = false;
        items = _.pluck(model.get(key), property);
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          v = items[_i];
          if (helpers.global.inArray(v, values)) {
            match = true;
          }
        }
        return match;
      });
    };

    Filtered.prototype.filterByUnwatched = function() {
      return this.filterBy('unwatched', function(model) {
        var unwatched;
        unwatched = 1;
        if (model.get('type') === 'tvshow') {
          unwatched = model.get('episode') - model.get('watchedepisodes');
        } else if (model.get('type') === 'movie' || model.get('type') === 'episode') {
          unwatched = model.get('playcount') > 0 ? 0 : 1;
        }
        return unwatched > 0;
      });
    };

    Filtered.prototype.filterByString = function(key, query) {
      return this.filterBy('search', function(model) {
        var value;
        if (query.length < 3) {
          return false;
        } else {
          value = model.get(key).toLowerCase();
          return value.indexOf(query.toLowerCase()) > -1;
        }
      });
    };

    return Filtered;

  })(FilteredCollection);
});

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  return Entities.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      this.saveError = __bind(this.saveError, this);
      this.saveSuccess = __bind(this.saveSuccess, this);
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.getCacheKey = function(options) {
      var key;
      key = this.constructor.name;
      return key;
    };

    Model.prototype.destroy = function(options) {
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        wait: true
      });
      this.set({
        _destroy: true
      });
      return Model.__super__.destroy.call(this, options);
    };

    Model.prototype.isDestroyed = function() {
      return this.get("_destroy");
    };

    Model.prototype.save = function(data, options) {
      var isNew;
      if (options == null) {
        options = {};
      }
      isNew = this.isNew();
      _.defaults(options, {
        wait: true,
        success: _.bind(this.saveSuccess, this, isNew, options.collection),
        error: _.bind(this.saveError, this)
      });
      this.unset("_errors");
      return Model.__super__.save.call(this, data, options);
    };

    Model.prototype.saveSuccess = function(isNew, collection) {
      if (isNew) {
        if (collection) {
          collection.add(this);
        }
        if (collection) {
          collection.trigger("model:created", this);
        }
        return this.trigger("created", this);
      } else {
        if (collection == null) {
          collection = this.collection;
        }
        if (collection) {
          collection.trigger("model:updated", this);
        }
        return this.trigger("updated", this);
      }
    };

    Model.prototype.saveError = function(model, xhr, options) {
      var _ref;
      if (!(xhr.status === 500 || xhr.status === 404)) {
        return this.set({
          _errors: (_ref = $.parseJSON(xhr.responseText)) != null ? _ref.errors : void 0
        });
      }
    };

    return Model;

  })(Backbone.Model);
});


/*
  App configuration settings, items stored in local storage and are
  specific to the browser/user instance. Not Kodi settings.
 */

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    storageKey: 'config:app',
    getCollection: function() {
      var collection;
      collection = new Entities.ConfigAppCollection();
      collection.fetch();
      return collection;
    },
    getConfig: function(id, collection) {
      if (collection == null) {
        collection = API.getCollection();
      }
      return collection.find({
        id: id
      });
    }
  };
  Entities.ConfigApp = (function(_super) {
    __extends(ConfigApp, _super);

    function ConfigApp() {
      return ConfigApp.__super__.constructor.apply(this, arguments);
    }

    ConfigApp.prototype.defaults = {
      data: {}
    };

    return ConfigApp;

  })(Entities.Model);
  Entities.ConfigAppCollection = (function(_super) {
    __extends(ConfigAppCollection, _super);

    function ConfigAppCollection() {
      return ConfigAppCollection.__super__.constructor.apply(this, arguments);
    }

    ConfigAppCollection.prototype.model = Entities.ConfigApp;

    ConfigAppCollection.prototype.localStorage = new Backbone.LocalStorage(API.storageKey);

    return ConfigAppCollection;

  })(Entities.Collection);
  App.reqres.setHandler("config:app:get", function(configId, defaultData) {
    var model;
    model = API.getConfig(configId);
    if (model != null) {
      return model.get('data');
    } else {
      return defaultData;
    }
  });
  App.reqres.setHandler("config:app:set", function(configId, configData) {
    var collection, model;
    collection = API.getCollection();
    model = API.getConfig(configId, collection);
    if (model != null) {
      return model.save({
        data: configData
      });
    } else {
      collection.create({
        id: configId,
        data: configData
      });
      return configData;
    }
  });
  App.reqres.setHandler("config:static:get", function(configId, defaultData) {
    var data;
    data = config["static"][configId] != null ? config["static"][configId] : defaultData;
    return data;
  });
  return App.reqres.setHandler("config:static:set", function(configId, data) {
    config["static"][configId] = data;
    return data;
  });
});


/*
  Youtube collection
 */

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    apiKey: 'AIzaSyBxvaR6mCnUWN8cv2TiPRmuEh0FykBTAH0',
    searchUrl: 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDefinition=any&videoEmbeddable=true&order=relevance&safeSearch=none',
    getSearchUrl: function() {
      return this.searchUrl + '&key=' + this.apiKey;
    },
    parseItems: function(response) {
      var i, item, items, resp, _ref;
      items = [];
      console.log(response);
      _ref = response.items;
      for (i in _ref) {
        item = _ref[i];
        resp = {
          id: item.id.videoId,
          title: item.snippet.title,
          desc: item.snippet.description,
          thumbnail: item.snippet.thumbnails["default"].url
        };
        items.push(resp);
      }
      return items;
    }
  };
  Entities.youtubeItem = (function(_super) {
    __extends(youtubeItem, _super);

    function youtubeItem() {
      return youtubeItem.__super__.constructor.apply(this, arguments);
    }

    youtubeItem.prototype.defaults = {
      id: '',
      title: '',
      desc: '',
      thumbnail: ''
    };

    return youtubeItem;

  })(Entities.Model);
  Entities.youtubeCollection = (function(_super) {
    __extends(youtubeCollection, _super);

    function youtubeCollection() {
      return youtubeCollection.__super__.constructor.apply(this, arguments);
    }

    youtubeCollection.prototype.model = Entities.youtubeItem;

    youtubeCollection.prototype.url = API.getSearchUrl();

    youtubeCollection.prototype.sync = function(method, collection, options) {
      options.dataType = "jsonp";
      options.timeout = 5000;
      return Backbone.sync(method, collection, options);
    };

    youtubeCollection.prototype.parse = function(resp) {
      return API.parseItems(resp);
    };

    return youtubeCollection;

  })(Entities.Collection);
  return App.commands.setHandler("youtube:search:entities", function(query, callback) {
    var yt;
    yt = new Entities.youtubeCollection();
    return yt.fetch({
      data: {
        q: query
      },
      success: function(collection) {
        return callback(collection);
      },
      error: function(collection) {
        return helpers.debug.log('Youtube search error', 'error', collection);
      }
    });
  });
});

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  Entities.Filter = (function(_super) {
    __extends(Filter, _super);

    function Filter() {
      return Filter.__super__.constructor.apply(this, arguments);
    }

    Filter.prototype.defaults = {
      alias: '',
      type: 'string',
      key: '',
      sortOrder: 'asc',
      title: '',
      active: false
    };

    return Filter;

  })(Entities.Model);
  Entities.FilterCollection = (function(_super) {
    __extends(FilterCollection, _super);

    function FilterCollection() {
      return FilterCollection.__super__.constructor.apply(this, arguments);
    }

    FilterCollection.prototype.model = Entities.Filter;

    return FilterCollection;

  })(Entities.Collection);
  Entities.FilterOption = (function(_super) {
    __extends(FilterOption, _super);

    function FilterOption() {
      return FilterOption.__super__.constructor.apply(this, arguments);
    }

    FilterOption.prototype.defaults = {
      key: '',
      value: '',
      title: ''
    };

    return FilterOption;

  })(Entities.Model);
  Entities.FilterOptionCollection = (function(_super) {
    __extends(FilterOptionCollection, _super);

    function FilterOptionCollection() {
      return FilterOptionCollection.__super__.constructor.apply(this, arguments);
    }

    FilterOptionCollection.prototype.model = Entities.Filter;

    return FilterOptionCollection;

  })(Entities.Collection);
  Entities.FilterSort = (function(_super) {
    __extends(FilterSort, _super);

    function FilterSort() {
      return FilterSort.__super__.constructor.apply(this, arguments);
    }

    FilterSort.prototype.defaults = {
      alias: '',
      type: 'string',
      defaultSort: false,
      defaultOrder: 'asc',
      key: '',
      active: false,
      order: 'asc',
      title: ''
    };

    return FilterSort;

  })(Entities.Model);
  Entities.FilterSortCollection = (function(_super) {
    __extends(FilterSortCollection, _super);

    function FilterSortCollection() {
      return FilterSortCollection.__super__.constructor.apply(this, arguments);
    }

    FilterSortCollection.prototype.model = Entities.FilterSort;

    return FilterSortCollection;

  })(Entities.Collection);
  Entities.FilterActive = (function(_super) {
    __extends(FilterActive, _super);

    function FilterActive() {
      return FilterActive.__super__.constructor.apply(this, arguments);
    }

    FilterActive.prototype.defaults = {
      key: '',
      values: [],
      title: ''
    };

    return FilterActive;

  })(Entities.Model);
  Entities.FilterActiveCollection = (function(_super) {
    __extends(FilterActiveCollection, _super);

    function FilterActiveCollection() {
      return FilterActiveCollection.__super__.constructor.apply(this, arguments);
    }

    FilterActiveCollection.prototype.model = Entities.FilterActive;

    return FilterActiveCollection;

  })(Entities.Collection);
  App.reqres.setHandler('filter:filters:entities', function(collection) {
    return new Entities.FilterCollection(collection);
  });
  App.reqres.setHandler('filter:filters:options:entities', function(collection) {
    return new Entities.FilterOptionCollection(collection);
  });
  App.reqres.setHandler('filter:sort:entities', function(collection) {
    return new Entities.FilterSortCollection(collection);
  });
  return App.reqres.setHandler('filter:active:entities', function(collection) {
    return new Entities.FilterActiveCollection(collection);
  });
});

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  var API;
  Entities.FormItem = (function(_super) {
    __extends(FormItem, _super);

    function FormItem() {
      return FormItem.__super__.constructor.apply(this, arguments);
    }

    FormItem.prototype.defaults = {
      id: 0,
      title: '',
      type: '',
      element: '',
      options: [],
      defaultValue: '',
      description: '',
      children: [],
      attributes: {}
    };

    return FormItem;

  })(Entities.Model);
  Entities.Form = (function(_super) {
    __extends(Form, _super);

    function Form() {
      return Form.__super__.constructor.apply(this, arguments);
    }

    Form.prototype.model = Entities.FormItem;

    return Form;

  })(Entities.Collection);
  API = {
    applyState: function(item, formState) {
      if (formState[item.id] != null) {
        item.defaultValue = formState[item.id];
        item.defaultsApplied = true;
      }
      return item;
    },
    processItems: function(items, formState, isChild) {
      var collection, item, _i, _len;
      if (formState == null) {
        formState = {};
      }
      if (isChild == null) {
        isChild = false;
      }
      collection = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        item = this.applyState(item, formState);
        if (item.children && item.children.length > 0) {
          item.children = API.processItems(item.children, formState, true);
        }
        collection.push(item);
      }
      return collection;
    },
    toCollection: function(items) {
      var childCollection, i, item;
      for (i in items) {
        item = items[i];
        if (item.children && item.children.length > 0) {
          childCollection = new Entities.Form(item.children);
          items[i].children = childCollection;
        }
      }
      return new Entities.Form(items);
    }
  };
  return App.reqres.setHandler("form:item:entites", function(form, formState) {
    if (form == null) {
      form = [];
    }
    if (formState == null) {
      formState = {};
    }
    return API.toCollection(API.processItems(form, formState));
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    cacheSynced: function(entities, callback) {
      return entities.on('cachesync', function() {
        callback();
        return helpers.global.loading("end");
      });
    },
    xhrsFetch: function(entities, callback) {
      var xhrs;
      xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
      return $.when.apply($, xhrs).done(function() {
        callback();
        return helpers.global.loading("end");
      });
    }
  };
  return App.commands.setHandler("when:entity:fetched", function(entities, callback) {
    helpers.global.loading("start");
    if (!entities.params) {
      return API.cacheSynced(entities, callback);
    } else {
      return API.xhrsFetch(entities, callback);
    }
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  Backbone.fetchCache.localStorage = false;
  return KodiEntities.Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.url = function() {
      return helpers.url.baseKodiUrl("Collection");
    };

    Collection.prototype.rpc = new Backbone.Rpc({
      useNamedParameters: true,
      namespaceDelimiter: ''
    });

    Collection.prototype.sync = function(method, model, options) {
      if (method === 'read') {
        this.options = options;
      }
      return Backbone.sync(method, model, options);
    };

    Collection.prototype.getCacheKey = function(options) {
      var k, key, prop, val, _i, _len, _ref, _ref1;
      this.options = options;
      key = this.constructor.name;
      _ref = ['filter', 'sort', 'limit', 'file'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        if (options[k]) {
          _ref1 = options[k];
          for (prop in _ref1) {
            val = _ref1[prop];
            key += ':' + prop + ':' + val;
          }
        }
      }
      return key;
    };

    Collection.prototype.getResult = function(response, key) {
      var result;
      result = response.jsonrpc && response.result ? response.result : response;
      return result[key];
    };

    Collection.prototype.argCheckOption = function(option, fallback) {
      if ((this.options != null) && (this.options[option] != null)) {
        return this.options[option];
      } else {
        return fallback;
      }
    };

    Collection.prototype.argSort = function(method, order) {
      var arg;
      if (order == null) {
        order = 'ascending';
      }
      arg = {
        method: method,
        order: order,
        ignorearticle: this.isIgnoreArticle()
      };
      return this.argCheckOption('sort', arg);
    };

    Collection.prototype.argLimit = function(start, end) {
      var arg;
      if (start == null) {
        start = 0;
      }
      if (end == null) {
        end = 'all';
      }
      arg = {
        start: start
      };
      if (end !== 'all') {
        arg.end = end;
      }
      return this.argCheckOption('limit', arg);
    };

    Collection.prototype.argFilter = function(name, value) {
      var arg;
      arg = {};
      if (name != null) {
        arg[name] = value;
      }
      return this.argCheckOption('filter', arg);
    };

    Collection.prototype.isIgnoreArticle = function() {
      return config.get('static', 'ignoreArticle', true);
    };

    return Collection;

  })(App.Entities.Collection);
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  return KodiEntities.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.url = function() {
      return helpers.url.baseKodiUrl("Model");
    };

    Model.prototype.rpc = new Backbone.Rpc({
      useNamedParameters: true,
      namespaceDelimiter: ''
    });

    Model.prototype.modelDefaults = {
      fullyloaded: false,
      thumbnail: '',
      thumbsUp: false,
      parsed: false
    };

    Model.prototype.parseModel = function(type, model, id) {
      if (!model.parsed) {
        if (id !== 'mixed') {
          model.id = id;
        }
        if (model.rating) {
          model.rating = helpers.global.rating(model.rating);
        }
        if (model.streamdetails && _.isObject(model.streamdetails)) {
          model.streamdetails = helpers.stream.streamFormat(model.streamdetails);
        }
        if (model.resume) {
          model.progress = model.resume.position === 0 ? 0 : Math.round((model.resume.position / model.resume.total) * 100);
        }
        if (model.trailer) {
          model.trailer = helpers.url.parseTrailerUrl(model.trailer);
        }
        if (type === 'episode') {
          model.url = helpers.url.get(type, id, {
            ':tvshowid': model.tvshowid,
            ':season': model.season
          });
        } else if (type === 'channel') {
          if (model.channeltype === 'tv') {
            type = "channeltv";
          } else {
            type = "channelradio";
          }
          model.url = helpers.url.get(type, id);
        } else {
          model.url = helpers.url.get(type, id);
        }
        model = App.request("images:path:entity", model);
        model.type = type;
        model.parsed = true;
      }
      return model;
    };

    Model.prototype.parseFieldsToDefaults = function(fields, defaults) {
      var field, _i, _len;
      if (defaults == null) {
        defaults = {};
      }
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        defaults[field] = '';
      }
      return defaults;
    };

    return Model;

  })(App.Entities.Model);
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getAlbumFields: function(type) {
      var baseFields, extraFields, fields;
      if (type == null) {
        type = 'small';
      }
      baseFields = ['thumbnail', 'playcount', 'artistid', 'artist', 'genre', 'albumlabel', 'year'];
      extraFields = ['fanart', 'style', 'mood', 'description', 'genreid', 'rating'];
      if (type === 'full') {
        fields = baseFields.concat(extraFields);
        return fields;
      } else {
        return baseFields;
      }
    },
    getAlbum: function(id, options) {
      var album;
      album = new App.KodiEntities.Album();
      album.set({
        albumid: parseInt(id),
        properties: API.getAlbumFields('full')
      });
      album.fetch(options);
      return album;
    },
    getAlbums: function(options) {
      var albums, defaultOptions;
      defaultOptions = {
        cache: true,
        expires: config.get('static', 'collectionCacheExpiry')
      };
      options = _.extend(defaultOptions, options);
      albums = new KodiEntities.AlbumCollection();
      albums.fetch(options);
      return albums;
    },
    getRecentlyAddedAlbums: function(options) {
      var albums;
      albums = new KodiEntities.AlbumRecentlyAddedCollection();
      albums.fetch(options);
      return albums;
    },
    getRecentlyPlayedAlbums: function(options) {
      var albums;
      albums = new KodiEntities.AlbumRecentlyPlayedCollection();
      albums.fetch(options);
      return albums;
    }
  };
  KodiEntities.Album = (function(_super) {
    __extends(Album, _super);

    function Album() {
      return Album.__super__.constructor.apply(this, arguments);
    }

    Album.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        albumid: 1,
        album: ''
      });
      return this.parseFieldsToDefaults(API.getAlbumFields('full'), fields);
    };

    Album.prototype.methods = {
      read: ['AudioLibrary.GetAlbumDetails', 'albumid', 'properties']
    };

    Album.prototype.arg2 = API.getAlbumFields('full');

    Album.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.albumdetails != null ? resp.albumdetails : resp;
      if (resp.albumdetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('album', obj, obj.albumid);
    };

    return Album;

  })(App.KodiEntities.Model);
  KodiEntities.AlbumCollection = (function(_super) {
    __extends(AlbumCollection, _super);

    function AlbumCollection() {
      return AlbumCollection.__super__.constructor.apply(this, arguments);
    }

    AlbumCollection.prototype.model = KodiEntities.Album;

    AlbumCollection.prototype.methods = {
      read: ['AudioLibrary.GetAlbums', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    AlbumCollection.prototype.arg1 = function() {
      return API.getAlbumFields('small');
    };

    AlbumCollection.prototype.arg2 = function() {
      return this.argLimit();
    };

    AlbumCollection.prototype.arg3 = function() {
      return this.argSort("title", "ascending");
    };

    AlbumCollection.prototype.arg3 = function() {
      return this.argFilter();
    };

    AlbumCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'albums');
    };

    return AlbumCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.AlbumRecentlyAddedCollection = (function(_super) {
    __extends(AlbumRecentlyAddedCollection, _super);

    function AlbumRecentlyAddedCollection() {
      return AlbumRecentlyAddedCollection.__super__.constructor.apply(this, arguments);
    }

    AlbumRecentlyAddedCollection.prototype.model = KodiEntities.Album;

    AlbumRecentlyAddedCollection.prototype.methods = {
      read: ['AudioLibrary.GetRecentlyAddedAlbums', 'arg1', 'arg2']
    };

    AlbumRecentlyAddedCollection.prototype.arg1 = function() {
      return API.getAlbumFields('small');
    };

    AlbumRecentlyAddedCollection.prototype.arg2 = function() {
      return this.argLimit(0, 21);
    };

    AlbumRecentlyAddedCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'albums');
    };

    return AlbumRecentlyAddedCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.AlbumRecentlyPlayedCollection = (function(_super) {
    __extends(AlbumRecentlyPlayedCollection, _super);

    function AlbumRecentlyPlayedCollection() {
      return AlbumRecentlyPlayedCollection.__super__.constructor.apply(this, arguments);
    }

    AlbumRecentlyPlayedCollection.prototype.model = KodiEntities.Album;

    AlbumRecentlyPlayedCollection.prototype.methods = {
      read: ['AudioLibrary.GetRecentlyPlayedAlbums', 'arg1', 'arg2']
    };

    AlbumRecentlyPlayedCollection.prototype.arg1 = function() {
      return API.getAlbumFields('small');
    };

    AlbumRecentlyPlayedCollection.prototype.arg2 = function() {
      return this.argLimit(0, 21);
    };

    AlbumRecentlyPlayedCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'albums');
    };

    return AlbumRecentlyPlayedCollection;

  })(App.KodiEntities.Collection);
  App.reqres.setHandler("album:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getAlbum(id, options);
  });
  App.reqres.setHandler("album:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getAlbums(options);
  });
  App.reqres.setHandler("album:recentlyadded:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getRecentlyAddedAlbums(options);
  });
  App.reqres.setHandler("album:recentlyplayed:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getRecentlyPlayedAlbums(options);
  });
  return App.commands.setHandler("album:search:entities", function(query, limit, callback) {
    var collection;
    collection = API.getAlbums({});
    return App.execute("when:entity:fetched", collection, (function(_this) {
      return function() {
        var filtered;
        filtered = new App.Entities.Filtered(collection);
        filtered.filterByString('label', query);
        if (callback) {
          return callback(filtered);
        }
      };
    })(this));
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getArtistFields: function(type) {
      var baseFields, extraFields, fields;
      if (type == null) {
        type = 'small';
      }
      baseFields = ['thumbnail', 'mood', 'genre', 'style'];
      extraFields = ['fanart', 'born', 'formed', 'description'];
      if (type === 'full') {
        fields = baseFields.concat(extraFields);
        return fields;
      } else {
        return baseFields;
      }
    },
    getArtist: function(id, options) {
      var artist;
      artist = new App.KodiEntities.Artist();
      artist.set({
        artistid: parseInt(id),
        properties: API.getArtistFields('full')
      });
      artist.fetch(options);
      return artist;
    },
    getArtists: function(options) {
      var artists, defaultOptions;
      defaultOptions = {
        cache: true,
        expires: config.get('static', 'collectionCacheExpiry')
      };
      options = _.extend(defaultOptions, options);
      artists = helpers.cache.get("artist:entities");
      if (artists === false || options.reset === true) {
        artists = new KodiEntities.ArtistCollection();
        artists.fetch(options);
      }
      helpers.cache.set("artist:entities", artists);
      return artists;
    }
  };
  KodiEntities.Artist = (function(_super) {
    __extends(Artist, _super);

    function Artist() {
      return Artist.__super__.constructor.apply(this, arguments);
    }

    Artist.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        artistid: 1,
        artist: ''
      });
      return this.parseFieldsToDefaults(API.getArtistFields('full'), fields);
    };

    Artist.prototype.methods = {
      read: ['AudioLibrary.GetArtistDetails', 'artistid', 'properties']
    };

    Artist.prototype.arg2 = API.getArtistFields('full');

    Artist.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.artistdetails != null ? resp.artistdetails : resp;
      if (resp.artistdetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('artist', obj, obj.artistid);
    };

    return Artist;

  })(App.KodiEntities.Model);
  KodiEntities.ArtistCollection = (function(_super) {
    __extends(ArtistCollection, _super);

    function ArtistCollection() {
      return ArtistCollection.__super__.constructor.apply(this, arguments);
    }

    ArtistCollection.prototype.model = KodiEntities.Artist;

    ArtistCollection.prototype.methods = {
      read: ['AudioLibrary.GetArtists', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    ArtistCollection.prototype.arg1 = function() {
      return config.get('static', 'albumAtristsOnly', true);
    };

    ArtistCollection.prototype.arg2 = function() {
      return API.getArtistFields('small');
    };

    ArtistCollection.prototype.arg3 = function() {
      return this.argLimit();
    };

    ArtistCollection.prototype.arg4 = function() {
      return this.argSort("artist", "ascending");
    };

    ArtistCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'artists');
    };

    return ArtistCollection;

  })(App.KodiEntities.Collection);
  App.reqres.setHandler("artist:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getArtist(id, options);
  });
  App.reqres.setHandler("artist:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getArtists(options);
  });
  return App.commands.setHandler("artist:search:entities", function(query, limit, callback) {
    var collection;
    collection = API.getArtists({});
    return App.execute("when:entity:fetched", collection, (function(_this) {
      return function() {
        var filtered;
        filtered = new App.Entities.Filtered(collection);
        filtered.filterByString('label', query);
        if (callback) {
          return callback(filtered);
        }
      };
    })(this));
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['name'],
      small: ['order', 'role', 'thumbnail', 'origin', 'url'],
      full: []
    },
    getCollection: function(cast, origin) {
      var collection, i, item;
      for (i in cast) {
        item = cast[i];
        cast[i].origin = origin;
      }
      collection = new KodiEntities.CastCollection(cast);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.Cast = (function(_super) {
    __extends(Cast, _super);

    function Cast() {
      return Cast.__super__.constructor.apply(this, arguments);
    }

    Cast.prototype.idAttribute = "order";

    Cast.prototype.defaults = function() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'small'), {});
    };

    Cast.prototype.parse = function(obj, xhr) {
      obj.url = '?cast=' + obj.name;
      return obj;
    };

    return Cast;

  })(App.KodiEntities.Model);
  KodiEntities.CastCollection = (function(_super) {
    __extends(CastCollection, _super);

    function CastCollection() {
      return CastCollection.__super__.constructor.apply(this, arguments);
    }

    CastCollection.prototype.model = KodiEntities.Cast;

    return CastCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  return App.reqres.setHandler("cast:entities", function(cast, origin) {
    return API.getCollection(cast, origin);
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: [],
      small: ['title', 'runtime', 'starttime', 'endtime', 'genre'],
      full: ['plot', 'progress', 'progresspercentage', 'episodename', 'episodenum', 'episodepart', 'firstaired', 'hastimer', 'isactive', 'parentalrating', 'wasactive', 'thumbnail']
    },

    /*getEntity: (collection, channel) ->
      collection.findWhere({channel: channel})
     */
    getEntity: function(channelid, options) {
      var entity;
      entity = new App.KodiEntities.Broadcast();
      entity.set({
        channelid: parseInt(channelid),
        properties: helpers.entities.getFields(API.fields, 'full')
      });
      entity.fetch(options);
      return entity;
    },
    getCollection: function(options) {
      var collection;
      collection = new KodiEntities.BroadcastCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.Broadcast = (function(_super) {
    __extends(Broadcast, _super);

    function Broadcast() {
      return Broadcast.__super__.constructor.apply(this, arguments);
    }

    Broadcast.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        channelid: 1,
        channel: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    Broadcast.prototype.methods = {
      read: ['PVR.GetBroadcasts', 'channelid', 'properties']
    };

    Broadcast.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.broadcasts != null ? resp.broadcasts : resp;
      if (resp.broadcasts != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('broadcast', obj, obj.channelid);
    };


    /*defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), {}
    parse: (obj, xhr) ->
      obj.fullyloaded = true
      @parseModel 'broadcast', obj, obj.channelid
     */

    return Broadcast;

  })(App.KodiEntities.Model);
  KodiEntities.BroadcastCollection = (function(_super) {
    __extends(BroadcastCollection, _super);

    function BroadcastCollection() {
      return BroadcastCollection.__super__.constructor.apply(this, arguments);
    }

    BroadcastCollection.prototype.model = KodiEntities.Broadcast;

    BroadcastCollection.prototype.methods = {
      read: ['PVR.GetBroadcasts', 'arg1', 'arg2', 'arg3']
    };

    BroadcastCollection.prototype.arg1 = function() {
      return parseInt(this.argCheckOption('channelid', 0));
    };

    BroadcastCollection.prototype.arg2 = function() {
      return helpers.entities.getFields(API.fields, 'full');
    };

    BroadcastCollection.prototype.arg3 = function() {
      return this.argLimit();
    };

    BroadcastCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'broadcasts');
    };

    return BroadcastCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("broadcast:entity", function(collection, channelid) {
    return API.getEntity(collection, channelid);
  });
  return App.reqres.setHandler("broadcast:entities", function(channelid, options) {
    if (options == null) {
      options = {};
    }
    options.channelid = channelid;
    return API.getCollection(options);
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['title'],
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'season', 'rating', 'file', 'cast', 'showtitle', 'tvshowid', 'uniqueid', 'resume'],
      full: ['fanart', 'plot', 'firstaired', 'director', 'writer', 'runtime', 'streamdetails']
    },
    getEntity: function(id, options) {
      var entity;
      entity = new App.KodiEntities.Episode();
      entity.set({
        episodeid: parseInt(id),
        properties: helpers.entities.getFields(API.fields, 'full')
      });
      entity.fetch(options);
      return entity;
    },
    getCollection: function(options) {
      var collection, defaultOptions;
      defaultOptions = {
        cache: false,
        expires: config.get('static', 'collectionCacheExpiry')
      };
      options = _.extend(defaultOptions, options);
      collection = new KodiEntities.EpisodeCollection();
      collection.fetch(options);
      return collection;
    },
    getRecentlyAddedCollection: function(options) {
      var collection;
      collection = new KodiEntities.EpisodeRecentlyAddedCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.Episode = (function(_super) {
    __extends(Episode, _super);

    function Episode() {
      return Episode.__super__.constructor.apply(this, arguments);
    }

    Episode.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        episodeid: 1,
        episode: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    Episode.prototype.methods = {
      read: ['VideoLibrary.GetEpisodeDetails', 'episodeid', 'properties']
    };

    Episode.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.episodedetails != null ? resp.episodedetails : resp;
      if (resp.episodedetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.playcount > 0 ? 0 : 1;
      return this.parseModel('episode', obj, obj.episodeid);
    };

    return Episode;

  })(App.KodiEntities.Model);
  KodiEntities.EpisodeCollection = (function(_super) {
    __extends(EpisodeCollection, _super);

    function EpisodeCollection() {
      return EpisodeCollection.__super__.constructor.apply(this, arguments);
    }

    EpisodeCollection.prototype.model = KodiEntities.Episode;

    EpisodeCollection.prototype.methods = {
      read: ['VideoLibrary.GetEpisodes', 'arg1', 'arg2', 'arg3']
    };

    EpisodeCollection.prototype.arg1 = function() {
      return this.argCheckOption('tvshowid', 0);
    };

    EpisodeCollection.prototype.arg2 = function() {
      return this.argCheckOption('season', 0);
    };

    EpisodeCollection.prototype.arg3 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    EpisodeCollection.prototype.arg4 = function() {
      return this.argLimit();
    };

    EpisodeCollection.prototype.arg5 = function() {
      return this.argSort("episode", "ascending");
    };

    EpisodeCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'episodes');
    };

    return EpisodeCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.EpisodeRecentlyAddedCollection = (function(_super) {
    __extends(EpisodeRecentlyAddedCollection, _super);

    function EpisodeRecentlyAddedCollection() {
      return EpisodeRecentlyAddedCollection.__super__.constructor.apply(this, arguments);
    }

    EpisodeRecentlyAddedCollection.prototype.model = KodiEntities.Episode;

    EpisodeRecentlyAddedCollection.prototype.methods = {
      read: ['VideoLibrary.GetRecentlyAddedEpisodes', 'arg1', 'arg2']
    };

    EpisodeRecentlyAddedCollection.prototype.arg1 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    EpisodeRecentlyAddedCollection.prototype.arg2 = function() {
      return this.argLimit();
    };

    EpisodeRecentlyAddedCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'episodes');
    };

    return EpisodeRecentlyAddedCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("episode:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getEntity(id, options);
  });
  App.reqres.setHandler("episode:entities", function(tvshowid, season, options) {
    if (options == null) {
      options = {};
    }
    options.tvshowid = tvshowid;
    options.season = season;
    return API.getCollection(options);
  });
  return App.reqres.setHandler("episode:recentlyadded:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getRecentlyAddedCollection(options);
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['title', 'file', 'mimetype'],
      small: ['thumbnail'],
      full: ['fanart', 'streamdetails']
    },
    addonFields: ['path', 'name'],
    sources: [
      {
        media: 'video',
        label: 'Video',
        type: 'source',
        provides: 'video'
      }, {
        media: 'music',
        label: 'Music',
        type: 'source',
        provides: 'audio'
      }, {
        media: 'music',
        label: 'Audio Addons',
        type: 'addon',
        provides: 'audio',
        addonType: 'xbmc.addon.audio',
        content: 'unknown'
      }, {
        media: 'video',
        label: 'Video Addons',
        type: 'addon',
        provides: 'files',
        addonType: 'xbmc.addon.video',
        content: 'unknown'
      }
    ],
    directorySeperator: '/',
    getEntity: function(id, options) {
      var entity;
      entity = new App.KodiEntities.File();
      entity.set({
        file: id,
        properties: helpers.entities.getFields(API.fields, 'full')
      });
      entity.fetch(options);
      return entity;
    },
    getCollection: function(type, options) {
      var collection, defaultOptions;
      defaultOptions = {
        cache: true
      };
      options = _.extend(defaultOptions, options);
      if (type === 'sources') {
        collection = new KodiEntities.SourceCollection();
      } else {
        collection = new KodiEntities.FileCollection();
      }
      collection.fetch(options);
      return collection;
    },
    parseToFilesAndFolders: function(collection) {
      var all, collections;
      all = collection.getRawCollection();
      collections = {};
      collections.file = new KodiEntities.FileCustomCollection(_.where(all, {
        filetype: 'file'
      }));
      collections.directory = new KodiEntities.FileCustomCollection(_.where(all, {
        filetype: 'directory'
      }));
      return collections;
    },
    getSources: function() {
      var collection, commander, commands, source, _i, _len, _ref;
      commander = App.request("command:kodi:controller", 'auto', 'Commander');
      commands = [];
      collection = new KodiEntities.SourceCollection();
      _ref = this.sources;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        if (source.type === 'source') {
          commands.push({
            method: 'Files.GetSources',
            params: [source.media]
          });
        }
        if (source.type === 'addon') {
          commands.push({
            method: 'Addons.GetAddons',
            params: [source.addonType, source.content, true, this.addonFields]
          });
        }
      }
      commander.multipleCommands(commands, (function(_this) {
        return function(resp) {
          var i, item, model, repsonseKey, _j, _len1, _ref1;
          for (i in resp) {
            item = resp[i];
            source = _this.sources[i];
            repsonseKey = source.type + 's';
            if (item[repsonseKey]) {
              _ref1 = item[repsonseKey];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                model = _ref1[_j];
                model.media = source.media;
                model.sourcetype = source.type;
                if (source.type === 'addon') {
                  model.file = _this.createAddonFile(model);
                  model.label = model.name;
                }
                model.url = _this.createFileUrl(source.media, model.file);
                collection.add(model);
              }
            }
          }
          return collection.trigger('cachesync');
        };
      })(this));
      return collection;
    },
    parseSourceCollection: function(collection) {
      var all, items, source, _i, _len, _ref;
      all = collection.getRawCollection();
      collection = [];
      _ref = this.sources;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        items = _.where(all, {
          media: source.media
        });
        if (items.length > 0 && source.type === 'source') {
          source.sources = new KodiEntities.SourceCollection(items);
          source.url = 'browser/' + source.media;
          collection.push(source);
        }
      }
      return new KodiEntities.SourceSetCollection(collection);
    },
    createFileUrl: function(media, file) {
      return 'browser/' + media + '/' + helpers.global.hash('encode', file);
    },
    createAddonFile: function(addon) {
      return 'plugin://' + addon.addonid;
    },
    parseFiles: function(items, media) {
      var i, item;
      for (i in items) {
        item = items[i];
        if (!item.parsed) {
          item = App.request("images:path:entity", item);
          items[i] = this.correctFileType(item);
          items[i].media = media;
          items[i].player = this.getPlayer(media);
          items[i].url = this.createFileUrl(media, item.file);
          items[i].parsed = true;
        }
      }
      return items;
    },
    correctFileType: function(item) {
      var directoryMimeTypes;
      directoryMimeTypes = ['x-directory/normal'];
      if (item.mimetype && helpers.global.inArray(item.mimetype, directoryMimeTypes)) {
        item.filetype = 'directory';
      }
      return item;
    },
    createPathCollection: function(file, sourcesCollection) {
      var allSources, basePath, items, parentSource, part, pathParts, source, _i, _j, _len, _len1;
      items = [];
      parentSource = {};
      allSources = sourcesCollection.getRawCollection();
      for (_i = 0, _len = allSources.length; _i < _len; _i++) {
        source = allSources[_i];
        if (parentSource.file) {
          continue;
        }
        if (helpers.global.stringStartsWith(source.file, file)) {
          parentSource = source;
        }
      }
      if (parentSource.file) {
        items.push(parentSource);
        basePath = parentSource.file;
        pathParts = helpers.global.stringStripStartsWith(parentSource.file, file).split(this.directorySeperator);
        for (_j = 0, _len1 = pathParts.length; _j < _len1; _j++) {
          part = pathParts[_j];
          if (part !== '') {
            basePath += part + this.directorySeperator;
            items.push(this.createPathModel(parentSource.media, part, basePath));
          }
        }
      }
      return new KodiEntities.FileCustomCollection(items);
    },
    createPathModel: function(media, label, file) {
      var model;
      model = {
        label: label,
        file: file,
        media: media,
        url: this.createFileUrl(media, file)
      };
      console.log(model);
      return model;
    },
    getPlayer: function(media) {
      if (media === 'music') {
        'audio';
      }
      return media;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.EmptyFile = (function(_super) {
    __extends(EmptyFile, _super);

    function EmptyFile() {
      return EmptyFile.__super__.constructor.apply(this, arguments);
    }

    EmptyFile.prototype.idAttribute = "file";

    EmptyFile.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        filetype: 'directory',
        media: '',
        label: '',
        url: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    return EmptyFile;

  })(App.KodiEntities.Model);
  KodiEntities.File = (function(_super) {
    __extends(File, _super);

    function File() {
      return File.__super__.constructor.apply(this, arguments);
    }

    File.prototype.methods = {
      read: ['Files.GetFileDetails', 'file', 'properties']
    };

    File.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.filedetails != null ? resp.filedetails : resp;
      if (resp.filedetails != null) {
        obj.fullyloaded = true;
      }
      return obj;
    };

    return File;

  })(KodiEntities.EmptyFile);
  KodiEntities.FileCollection = (function(_super) {
    __extends(FileCollection, _super);

    function FileCollection() {
      return FileCollection.__super__.constructor.apply(this, arguments);
    }

    FileCollection.prototype.model = KodiEntities.File;

    FileCollection.prototype.methods = {
      read: ['Files.GetDirectory', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    FileCollection.prototype.arg1 = function() {
      return this.argCheckOption('file', '');
    };

    FileCollection.prototype.arg2 = function() {
      return this.argCheckOption('media', '');
    };

    FileCollection.prototype.arg3 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    FileCollection.prototype.arg4 = function() {
      return this.argSort("label", "ascending");
    };

    FileCollection.prototype.parse = function(resp, xhr) {
      var items;
      items = this.getResult(resp, 'files');
      return API.parseFiles(items, this.options.media);
    };

    return FileCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.FileCustomCollection = (function(_super) {
    __extends(FileCustomCollection, _super);

    function FileCustomCollection() {
      return FileCustomCollection.__super__.constructor.apply(this, arguments);
    }

    FileCustomCollection.prototype.model = KodiEntities.File;

    return FileCustomCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.Source = (function(_super) {
    __extends(Source, _super);

    function Source() {
      return Source.__super__.constructor.apply(this, arguments);
    }

    Source.prototype.idAttribute = "file";

    Source.prototype.defaults = {
      label: '',
      file: '',
      media: '',
      url: ''
    };

    return Source;

  })(App.KodiEntities.Model);
  KodiEntities.SourceCollection = (function(_super) {
    __extends(SourceCollection, _super);

    function SourceCollection() {
      return SourceCollection.__super__.constructor.apply(this, arguments);
    }

    SourceCollection.prototype.model = KodiEntities.Source;

    return SourceCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.SourceSet = (function(_super) {
    __extends(SourceSet, _super);

    function SourceSet() {
      return SourceSet.__super__.constructor.apply(this, arguments);
    }

    SourceSet.prototype.idAttribute = "file";

    SourceSet.prototype.defaults = {
      label: '',
      sources: ''
    };

    return SourceSet;

  })(App.KodiEntities.Model);
  KodiEntities.SourceSetCollection = (function(_super) {
    __extends(SourceSetCollection, _super);

    function SourceSetCollection() {
      return SourceSetCollection.__super__.constructor.apply(this, arguments);
    }

    SourceSetCollection.prototype.model = KodiEntities.Source;

    return SourceSetCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("file:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getEntity(id, options);
  });
  App.reqres.setHandler("file:url:entity", function(media, hash) {
    var file;
    console.log(hash, decodeURIComponent(hash));
    file = helpers.global.hash('decode', hash);
    return new KodiEntities.EmptyFile({
      media: media,
      file: file,
      url: API.createFileUrl(media, file)
    });
  });
  App.reqres.setHandler("file:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getCollection('files', options);
  });
  App.reqres.setHandler("file:path:entities", function(file, sourceCollection) {
    return API.createPathCollection(file, sourceCollection);
  });
  App.reqres.setHandler("file:parsed:entities", function(collection) {
    return API.parseToFilesAndFolders(collection);
  });
  App.reqres.setHandler("file:source:entities", function(media) {
    return API.getSources();
  });
  App.reqres.setHandler("file:source:media:entities", function(collection) {
    return API.parseSourceCollection(collection);
  });
  return App.reqres.setHandler("file:source:mediatypes", function() {
    return API.availableSources;
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['title'],
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'resume', 'rating', 'year', 'file', 'genre', 'writer', 'director', 'cast', 'set'],
      full: ['fanart', 'plotoutline', 'studio', 'mpaa', 'imdbnumber', 'runtime', 'streamdetails', 'plot', 'trailer']
    },
    getEntity: function(id, options) {
      var entity;
      entity = new App.KodiEntities.Movie();
      entity.set({
        movieid: parseInt(id),
        properties: helpers.entities.getFields(API.fields, 'full')
      });
      entity.fetch(options);
      return entity;
    },
    getCollection: function(options) {
      var collection, defaultOptions;
      defaultOptions = {
        cache: true,
        expires: config.get('static', 'collectionCacheExpiry')
      };
      options = _.extend(defaultOptions, options);
      collection = new KodiEntities.MovieCollection();
      collection.fetch(options);
      return collection;
    },
    getRecentlyAddedCollection: function(options) {
      var collection;
      collection = new KodiEntities.MovieRecentlyAddedCollection();
      collection.fetch(options);
      return collection;
    },
    getFilteredCollection: function(options) {
      var collection;
      collection = new KodiEntities.MovieFilteredCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.Movie = (function(_super) {
    __extends(Movie, _super);

    function Movie() {
      return Movie.__super__.constructor.apply(this, arguments);
    }

    Movie.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        movieid: 1,
        movie: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    Movie.prototype.methods = {
      read: ['VideoLibrary.GetMovieDetails', 'movieid', 'properties']
    };

    Movie.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.moviedetails != null ? resp.moviedetails : resp;
      if (resp.moviedetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.playcount > 0 ? 0 : 1;
      return this.parseModel('movie', obj, obj.movieid);
    };

    return Movie;

  })(App.KodiEntities.Model);
  KodiEntities.MovieCollection = (function(_super) {
    __extends(MovieCollection, _super);

    function MovieCollection() {
      return MovieCollection.__super__.constructor.apply(this, arguments);
    }

    MovieCollection.prototype.model = KodiEntities.Movie;

    MovieCollection.prototype.methods = {
      read: ['VideoLibrary.GetMovies', 'arg1', 'arg2', 'arg3']
    };

    MovieCollection.prototype.arg1 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    MovieCollection.prototype.arg2 = function() {
      return this.argLimit();
    };

    MovieCollection.prototype.arg3 = function() {
      return this.argSort("title", "ascending");
    };

    MovieCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'movies');
    };

    return MovieCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.MovieRecentlyAddedCollection = (function(_super) {
    __extends(MovieRecentlyAddedCollection, _super);

    function MovieRecentlyAddedCollection() {
      return MovieRecentlyAddedCollection.__super__.constructor.apply(this, arguments);
    }

    MovieRecentlyAddedCollection.prototype.model = KodiEntities.Movie;

    MovieRecentlyAddedCollection.prototype.methods = {
      read: ['VideoLibrary.GetRecentlyAddedMovies', 'arg1', 'arg2']
    };

    MovieRecentlyAddedCollection.prototype.arg1 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    MovieRecentlyAddedCollection.prototype.arg2 = function() {
      return this.argLimit();
    };

    MovieRecentlyAddedCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'movies');
    };

    return MovieRecentlyAddedCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.MovieFilteredCollection = (function(_super) {
    __extends(MovieFilteredCollection, _super);

    function MovieFilteredCollection() {
      return MovieFilteredCollection.__super__.constructor.apply(this, arguments);
    }

    MovieFilteredCollection.prototype.methods = {
      read: ['VideoLibrary.GetMovies', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    MovieFilteredCollection.prototype.arg4 = function() {
      return this.argFilter();
    };

    return MovieFilteredCollection;

  })(KodiEntities.MovieCollection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("movie:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getEntity(id, options);
  });
  App.reqres.setHandler("movie:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getCollection(options);
  });
  App.reqres.setHandler("movie:filtered:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getFilteredCollection(options);
  });
  App.reqres.setHandler("movie:recentlyadded:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getRecentlyAddedCollection(options);
  });
  return App.commands.setHandler("movie:search:entities", function(query, limit, callback) {
    var collection;
    collection = API.getCollection({});
    return App.execute("when:entity:fetched", collection, (function(_this) {
      return function() {
        var filtered;
        filtered = new App.Entities.Filtered(collection);
        filtered.filterByString('label', query);
        if (callback) {
          return callback(filtered);
        }
      };
    })(this));
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['title', 'thumbnail', 'file'],
      small: ['artist', 'genre', 'year', 'rating', 'album', 'track', 'duration', 'playcount', 'dateadded', 'episode', 'artistid', 'albumid', 'tvshowid'],
      full: ['fanart']
    },
    getCollection: function(options) {
      var collection, defaultOptions;
      defaultOptions = {
        cache: false
      };
      options = _.extend(defaultOptions, options);
      collection = new KodiEntities.PlaylistCollection();
      collection.fetch(options);
      return collection;
    },
    getType: function(item, media) {
      var type;
      type = 'file';
      if (item.id !== void 0 && item.id !== '') {
        if (media === 'audio') {
          type = 'song';
        } else if (media === 'video') {
          if (item.episode !== '') {
            type = 'episode';
          } else {
            type = 'movie';
          }
        }
      }
      return type;
    },
    parseItems: function(items, options) {
      var i, item;
      for (i in items) {
        item = items[i];
        item.position = parseInt(i);
        items[i] = this.parseItem(item, options);
      }
      return items;
    },
    parseItem: function(item, options) {
      item.playlistid = options.playlistid;
      item.media = options.media;
      item.player = 'kodi';
      if (!item.type || item.type === 'unknown') {
        item.type = API.getType(item, options.media);
      }
      if (item.type === 'file') {
        item.id = item.file;
      }
      return item;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.PlaylistItem = (function(_super) {
    __extends(PlaylistItem, _super);

    function PlaylistItem() {
      return PlaylistItem.__super__.constructor.apply(this, arguments);
    }

    PlaylistItem.prototype.idAttribute = "position";

    PlaylistItem.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        position: 0
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    PlaylistItem.prototype.parse = function(resp, xhr) {
      var model;
      resp.fullyloaded = true;
      model = this.parseModel(resp.type, resp, resp.id);
      model.url = helpers.url.playlistUrl(model);
      return model;
    };

    return PlaylistItem;

  })(App.KodiEntities.Model);
  KodiEntities.PlaylistCollection = (function(_super) {
    __extends(PlaylistCollection, _super);

    function PlaylistCollection() {
      return PlaylistCollection.__super__.constructor.apply(this, arguments);
    }

    PlaylistCollection.prototype.model = KodiEntities.PlaylistItem;

    PlaylistCollection.prototype.methods = {
      read: ['Playlist.GetItems', 'arg1', 'arg2', 'arg3']
    };

    PlaylistCollection.prototype.arg1 = function() {
      return this.argCheckOption('playlistid', 0);
    };

    PlaylistCollection.prototype.arg2 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    PlaylistCollection.prototype.arg3 = function() {
      return this.argLimit();
    };

    PlaylistCollection.prototype.arg4 = function() {
      return this.argSort("position", "ascending");
    };

    PlaylistCollection.prototype.parse = function(resp, xhr) {
      var items;
      items = this.getResult(resp, 'items');
      return API.parseItems(items, this.options);
    };

    return PlaylistCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("playlist:kodi:entities", function(media) {
    var collection, options, playlist;
    if (media == null) {
      media = 'audio';
    }
    playlist = App.request("command:kodi:controller", media, 'PlayList');
    options = {};
    options.media = media;
    options.playlistid = playlist.getPlayer();
    collection = API.getCollection(options);
    collection.sortCollection('position', 'asc');
    return collection;
  });
  return App.reqres.setHandler("playlist:kodi:entity:api", function() {
    return API;
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['thumbnail'],
      small: ['channeltype', 'hidden', 'locked', 'channel', 'lastplayed', 'broadcastnow'],
      full: []
    },
    getEntity: function(collection, channel) {
      return collection.findWhere({
        channel: channel
      });
    },
    getCollection: function(options) {
      var collection;
      collection = new KodiEntities.ChannelCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.Channel = (function(_super) {
    __extends(Channel, _super);

    function Channel() {
      return Channel.__super__.constructor.apply(this, arguments);
    }

    Channel.prototype.defaults = function() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), {});
    };

    Channel.prototype.parse = function(obj, xhr) {
      obj.fullyloaded = true;
      return this.parseModel('channel', obj, obj.channelid);
    };

    return Channel;

  })(App.KodiEntities.Model);
  KodiEntities.ChannelCollection = (function(_super) {
    __extends(ChannelCollection, _super);

    function ChannelCollection() {
      return ChannelCollection.__super__.constructor.apply(this, arguments);
    }

    ChannelCollection.prototype.model = KodiEntities.Channel;

    ChannelCollection.prototype.methods = {
      read: ['PVR.GetChannels', 'arg1', 'arg2', 'arg3']
    };

    ChannelCollection.prototype.arg1 = function() {
      return this.argCheckOption('group', 0);
    };

    ChannelCollection.prototype.arg2 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    ChannelCollection.prototype.arg3 = function() {
      return this.argLimit();
    };

    ChannelCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'channels');
    };

    return ChannelCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("channel:entity", function(collection, channel) {
    return API.getEntity(collection, channel);
  });
  return App.reqres.setHandler("channel:entities", function(group, options) {
    if (group == null) {
      group = 'alltv';
    }
    if (options == null) {
      options = {};
    }
    options.group = group;
    return API.getCollection(options);
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['season'],
      small: ['showtitle', 'playcount', 'thumbnail', 'tvshowid', 'episode', 'watchedepisodes', 'fanart'],
      full: []
    },
    getEntity: function(collection, season) {
      return collection.findWhere({
        season: season
      });
    },
    getCollection: function(options) {
      var collection, defaultOptions;
      defaultOptions = {
        cache: false,
        expires: config.get('static', 'collectionCacheExpiry')
      };
      options = _.extend(defaultOptions, options);
      collection = new KodiEntities.SeasonCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.Season = (function(_super) {
    __extends(Season, _super);

    function Season() {
      return Season.__super__.constructor.apply(this, arguments);
    }

    Season.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        seasonid: 1,
        season: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    Season.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.seasondetails != null ? resp.seasondetails : resp;
      if (resp.seasondetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.episode - obj.watchedepisodes;
      return this.parseModel('season', obj, obj.tvshowid + '/' + obj.season);
    };

    return Season;

  })(App.KodiEntities.Model);
  KodiEntities.SeasonCollection = (function(_super) {
    __extends(SeasonCollection, _super);

    function SeasonCollection() {
      return SeasonCollection.__super__.constructor.apply(this, arguments);
    }

    SeasonCollection.prototype.model = KodiEntities.Season;

    SeasonCollection.prototype.methods = {
      read: ['VideoLibrary.GetSeasons', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    SeasonCollection.prototype.arg1 = function() {
      return this.argCheckOption('tvshowid', 0);
    };

    SeasonCollection.prototype.arg2 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    SeasonCollection.prototype.arg3 = function() {
      return this.argLimit();
    };

    SeasonCollection.prototype.arg4 = function() {
      return this.argSort("season", "ascending");
    };

    SeasonCollection.prototype.parse = function(resp, xhr) {
      console.log(resp);
      return this.getResult(resp, 'seasons');
    };

    return SeasonCollection;

  })(App.KodiEntities.Collection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("season:entity", function(collection, season) {
    return API.getEntity(collection, season);
  });
  return App.reqres.setHandler("season:entities", function(tvshowid, options) {
    if (options == null) {
      options = {};
    }
    options.tvshowid = tvshowid;
    return API.getCollection(options);
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    songsByIdMax: 50,
    fields: {
      minimal: ['title', 'file'],
      small: ['thumbnail', 'artist', 'artistid', 'album', 'albumid', 'lastplayed', 'track', 'year', 'duration'],
      full: ['fanart', 'genre', 'style', 'mood', 'born', 'formed', 'description', 'lyrics']
    },
    getSong: function(id, options) {
      var artist;
      artist = new App.KodiEntities.Song();
      artist.set({
        songid: parseInt(id),
        properties: helpers.entities.getFields(API.fields, 'full')
      });
      artist.fetch(options);
      return artist;
    },
    getFilteredSongs: function(options) {
      var defaultOptions, songs;
      defaultOptions = {
        cache: true
      };
      options = _.extend(defaultOptions, options);
      if (options.indexOnly) {
        options.expires = config.get('static', 'searchIndexCacheExpiry', 86400);
        songs = new KodiEntities.SongSearchIndexCollection();
      } else {
        songs = new KodiEntities.SongFilteredCollection();
      }
      songs.fetch(options);
      return songs;
    },
    parseSongsToAlbumSongs: function(songs) {
      var albumid, collections, parsedRaw, song, songSet, songsRaw, _i, _len;
      songsRaw = songs.getRawCollection();
      parsedRaw = {};
      collections = {};
      for (_i = 0, _len = songsRaw.length; _i < _len; _i++) {
        song = songsRaw[_i];
        if (!parsedRaw[song.albumid]) {
          parsedRaw[song.albumid] = [];
        }
        parsedRaw[song.albumid].push(song);
      }
      for (albumid in parsedRaw) {
        songSet = parsedRaw[albumid];
        collections[albumid] = new KodiEntities.SongCustomCollection(songSet);
      }
      return collections;
    },
    getSongsByIds: function(songIds, max, callback) {
      var cache, cacheKey, collection, commander, commands, id, items, model, _i, _len;
      if (songIds == null) {
        songIds = [];
      }
      if (max == null) {
        max = -1;
      }
      commander = App.request("command:kodi:controller", 'auto', 'Commander');
      songIds = this.getLimitIds(songIds, max);
      cacheKey = 'songs-' + songIds.join('-');
      items = [];
      cache = helpers.cache.get(cacheKey, false);
      if (cache) {
        collection = new KodiEntities.SongCustomCollection(cache);
        if (callback) {
          callback(collection);
        }
      } else {
        model = new KodiEntities.Song();
        commands = [];
        for (_i = 0, _len = songIds.length; _i < _len; _i++) {
          id = songIds[_i];
          commands.push({
            method: 'AudioLibrary.GetSongDetails',
            params: [id, helpers.entities.getFields(API.fields, 'small')]
          });
        }
        if (commands.length > 0) {
          commander.multipleCommands(commands, (function(_this) {
            return function(resp) {
              var item, _j, _len1, _ref;
              _ref = _.flatten([resp]);
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                item = _ref[_j];
                items.push(model.parseModel('song', item.songdetails, item.songdetails.songid));
              }
              helpers.cache.set(cacheKey, items);
              collection = new KodiEntities.SongCustomCollection(items);
              if (callback) {
                return callback(collection);
              }
            };
          })(this));
        }
      }
      return collection;
    },
    getLimitIds: function(ids, max) {
      var i, id, ret;
      max = max === -1 ? this.songsByIdMax : max;
      ret = [];
      for (i in ids) {
        id = ids[i];
        if (i < max) {
          ret.push(id);
        }
      }
      return ret;
    }
  };
  KodiEntities.Song = (function(_super) {
    __extends(Song, _super);

    function Song() {
      return Song.__super__.constructor.apply(this, arguments);
    }

    Song.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        songid: 1,
        artist: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    Song.prototype.methods = {
      read: ['AudioLibrary.GetSongDetails', 'songidid', 'properties']
    };

    Song.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.songdetails != null ? resp.songdetails : resp;
      if (resp.songdetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('song', obj, obj.songid);
    };

    return Song;

  })(App.KodiEntities.Model);
  KodiEntities.SongFilteredCollection = (function(_super) {
    __extends(SongFilteredCollection, _super);

    function SongFilteredCollection() {
      return SongFilteredCollection.__super__.constructor.apply(this, arguments);
    }

    SongFilteredCollection.prototype.model = KodiEntities.Song;

    SongFilteredCollection.prototype.methods = {
      read: ['AudioLibrary.GetSongs', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    SongFilteredCollection.prototype.arg1 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    SongFilteredCollection.prototype.arg2 = function() {
      return this.argLimit();
    };

    SongFilteredCollection.prototype.arg3 = function() {
      return this.argSort("track", "ascending");
    };

    SongFilteredCollection.prototype.arg4 = function() {
      return this.argFilter();
    };

    SongFilteredCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'songs');
    };

    return SongFilteredCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.SongCustomCollection = (function(_super) {
    __extends(SongCustomCollection, _super);

    function SongCustomCollection() {
      return SongCustomCollection.__super__.constructor.apply(this, arguments);
    }

    SongCustomCollection.prototype.model = KodiEntities.Song;

    return SongCustomCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.SongSearchIndexCollection = (function(_super) {
    __extends(SongSearchIndexCollection, _super);

    function SongSearchIndexCollection() {
      return SongSearchIndexCollection.__super__.constructor.apply(this, arguments);
    }

    SongSearchIndexCollection.prototype.methods = {
      read: ['AudioLibrary.GetSongs']
    };

    return SongSearchIndexCollection;

  })(KodiEntities.SongFilteredCollection);
  App.reqres.setHandler("song:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getSong(id, options);
  });
  App.reqres.setHandler("song:filtered:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getFilteredSongs(options);
  });
  App.reqres.setHandler("song:byid:entities", function(songIds, callback) {
    if (songIds == null) {
      songIds = [];
    }
    return API.getSongsByIds(songIds, -1, callback);
  });
  App.reqres.setHandler("song:albumparse:entities", function(songs) {
    return API.parseSongsToAlbumSongs(songs);
  });
  return App.commands.setHandler("song:search:entities", function(query, limit, callback) {
    var allLimit, collection, options;
    allLimit = 20;
    options = helpers.global.paramObj('indexOnly', true);
    collection = API.getFilteredSongs(options);
    App.execute("when:entity:fetched", collection, (function(_this) {
      return function() {
        var count, filtered, ids;
        filtered = new App.Entities.Filtered(collection);
        filtered.filterByString('label', query);
        ids = filtered.pluck('songid');
        count = limit === 'limit' ? allLimit : -1;
        return API.getSongsByIds(ids, count, function(loaded) {
          if (ids.length > allLimit && limit === 'limit') {
            loaded.more = true;
          }
          if (callback) {
            return callback(loaded);
          }
        });
      };
    })(this));
    return collection;
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
   */
  var API;
  API = {
    fields: {
      minimal: ['title'],
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'rating', 'year', 'file', 'genre', 'watchedepisodes', 'cast'],
      full: ['fanart', 'studio', 'mpaa', 'imdbnumber', 'episodeguide', 'plot']
    },
    getEntity: function(id, options) {
      var entity;
      entity = new App.KodiEntities.TVShow();
      entity.set({
        tvshowid: parseInt(id),
        properties: helpers.entities.getFields(API.fields, 'full')
      });
      entity.fetch(options);
      return entity;
    },
    getCollection: function(options) {
      var collection, defaultOptions;
      defaultOptions = {
        cache: true,
        expires: config.get('static', 'collectionCacheExpiry')
      };
      options = _.extend(defaultOptions, options);
      collection = new KodiEntities.TVShowCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
   */
  KodiEntities.TVShow = (function(_super) {
    __extends(TVShow, _super);

    function TVShow() {
      return TVShow.__super__.constructor.apply(this, arguments);
    }

    TVShow.prototype.defaults = function() {
      var fields;
      fields = _.extend(this.modelDefaults, {
        tvshowid: 1,
        tvshow: ''
      });
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    };

    TVShow.prototype.methods = {
      read: ['VideoLibrary.GetTVShowDetails', 'tvshowid', 'properties']
    };

    TVShow.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.tvshowdetails != null ? resp.tvshowdetails : resp;
      if (resp.tvshowdetails != null) {
        obj.fullyloaded = true;
      }
      obj.unwatched = obj.episode - obj.watchedepisodes;
      return this.parseModel('tvshow', obj, obj.tvshowid);
    };

    return TVShow;

  })(App.KodiEntities.Model);
  KodiEntities.TVShowCollection = (function(_super) {
    __extends(TVShowCollection, _super);

    function TVShowCollection() {
      return TVShowCollection.__super__.constructor.apply(this, arguments);
    }

    TVShowCollection.prototype.model = KodiEntities.TVShow;

    TVShowCollection.prototype.methods = {
      read: ['VideoLibrary.GetTVShows', 'arg1', 'arg2', 'arg3']
    };

    TVShowCollection.prototype.arg1 = function() {
      return helpers.entities.getFields(API.fields, 'small');
    };

    TVShowCollection.prototype.arg2 = function() {
      return this.argLimit();
    };

    TVShowCollection.prototype.arg3 = function() {
      return this.argSort("title", "ascending");
    };

    TVShowCollection.prototype.parse = function(resp, xhr) {
      return this.getResult(resp, 'tvshows');
    };

    return TVShowCollection;

  })(App.KodiEntities.Collection);
  KodiEntities.TVShowFilteredCollection = (function(_super) {
    __extends(TVShowFilteredCollection, _super);

    function TVShowFilteredCollection() {
      return TVShowFilteredCollection.__super__.constructor.apply(this, arguments);
    }

    TVShowFilteredCollection.prototype.methods = {
      read: ['VideoLibrary.GetTVShowss', 'arg1', 'arg2', 'arg3', 'arg4']
    };

    TVShowFilteredCollection.prototype.arg4 = function() {
      return this.argFilter();
    };

    return TVShowFilteredCollection;

  })(KodiEntities.TVShowCollection);

  /*
   Request Handlers.
   */
  App.reqres.setHandler("tvshow:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getEntity(id, options);
  });
  App.reqres.setHandler("tvshow:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getCollection(options);
  });
  return App.commands.setHandler("tvshow:search:entities", function(query, limit, callback) {
    var collection;
    collection = API.getCollection({});
    return App.execute("when:entity:fetched", collection, (function(_this) {
      return function() {
        var filtered;
        filtered = new App.Entities.Filtered(collection);
        filtered.filterByString('label', query);
        if (callback) {
          return callback(filtered);
        }
      };
    })(this));
  });
});


/*
  Custom saved playlists, saved in local storage
 */

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    savedFields: ['id', 'position', 'file', 'type', 'label', 'thumbnail', 'artist', 'album', 'artistid', 'artistid', 'tvshowid', 'tvshow', 'year', 'rating', 'duration', 'track', 'url'],
    playlistKey: 'localplaylist:list',
    playlistItemNamespace: 'localplaylist:item:',
    thumbsUpNamespace: 'thumbs:',
    localPlayerNamespace: 'localplayer:',
    getPlaylistKey: function(key) {
      return this.playlistItemNamespace + key;
    },
    getThumbsKey: function(media) {
      return this.thumbsUpNamespace + media;
    },
    getlocalPlayerKey: function(media) {
      if (media == null) {
        media = 'audio';
      }
      return this.localPlayerNamespace + media;
    },
    getListCollection: function(type) {
      var collection;
      if (type == null) {
        type = 'list';
      }
      collection = new Entities.localPlaylistCollection();
      collection.fetch();
      collection.where({
        type: type
      });
      return collection;
    },
    addList: function(model) {
      var collection;
      collection = this.getListCollection();
      model.id = this.getNextId();
      collection.create(model);
      return model.id;
    },
    getNextId: function() {
      var collection, items, lastItem, nextId;
      collection = API.getListCollection();
      items = collection.getRawCollection();
      if (items.length === 0) {
        nextId = 1;
      } else {
        lastItem = _.max(items, function(item) {
          return item.id;
        });
        nextId = lastItem.id + 1;
      }
      return nextId;
    },
    getItemCollection: function(listId) {
      var collection;
      collection = new Entities.localPlaylistItemCollection([], {
        key: listId
      });
      collection.fetch();
      return collection;
    },
    addItemsToPlaylist: function(playlistId, collection) {
      var item, items, pos, _i, _len;
      if (_.isArray(collection)) {
        items = collection;
      } else {
        items = collection.getRawCollection();
      }
      collection = this.getItemCollection(playlistId);
      pos = collection.length;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        collection.create(API.getSavedModelFromSource(item, pos));
        pos++;
      }
      return collection;
    },
    getSavedModelFromSource: function(item, position) {
      var fieldName, idfield, newItem, _i, _len, _ref;
      newItem = {};
      _ref = this.savedFields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fieldName = _ref[_i];
        if (item[fieldName]) {
          newItem[fieldName] = item[fieldName];
        }
      }
      newItem.position = parseInt(position);
      idfield = item.type + 'id';
      newItem[idfield] = item[idfield];
      return newItem;
    },
    clearPlaylist: function(playlistId) {
      var collection, model;
      collection = this.getItemCollection(playlistId);
      while (model = collection.first()) {
        model.destroy();
      }
    }
  };
  Entities.localPlaylist = (function(_super) {
    __extends(localPlaylist, _super);

    function localPlaylist() {
      return localPlaylist.__super__.constructor.apply(this, arguments);
    }

    localPlaylist.prototype.defaults = {
      id: 0,
      name: '',
      media: '',
      type: 'list'
    };

    return localPlaylist;

  })(Entities.Model);
  Entities.localPlaylistCollection = (function(_super) {
    __extends(localPlaylistCollection, _super);

    function localPlaylistCollection() {
      return localPlaylistCollection.__super__.constructor.apply(this, arguments);
    }

    localPlaylistCollection.prototype.model = Entities.localPlaylist;

    localPlaylistCollection.prototype.localStorage = new Backbone.LocalStorage(API.playlistKey);

    return localPlaylistCollection;

  })(Entities.Collection);
  Entities.localPlaylistItem = (function(_super) {
    __extends(localPlaylistItem, _super);

    function localPlaylistItem() {
      return localPlaylistItem.__super__.constructor.apply(this, arguments);
    }

    localPlaylistItem.prototype.idAttribute = "position";

    localPlaylistItem.prototype.defaults = function() {
      var f, fields, _i, _len, _ref;
      fields = {};
      _ref = API.savedFields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        fields[f] = '';
      }
      return fields;
    };

    return localPlaylistItem;

  })(Entities.Model);
  Entities.localPlaylistItemCollection = (function(_super) {
    __extends(localPlaylistItemCollection, _super);

    function localPlaylistItemCollection() {
      return localPlaylistItemCollection.__super__.constructor.apply(this, arguments);
    }

    localPlaylistItemCollection.prototype.model = Entities.localPlaylistItem;

    localPlaylistItemCollection.prototype.initialize = function(model, options) {
      return this.localStorage = new Backbone.LocalStorage(API.getPlaylistKey(options.key));
    };

    return localPlaylistItemCollection;

  })(Entities.Collection);

  /*
    Saved Playlists
   */
  App.reqres.setHandler("localplaylist:add:entity", function(name, media, type) {
    if (type == null) {
      type = 'list';
    }
    return API.addList({
      name: name,
      media: media,
      type: type
    });
  });
  App.commands.setHandler("localplaylist:remove:entity", function(id) {
    var collection, model;
    collection = API.getListCollection();
    model = collection.findWhere({
      id: parseInt(id)
    });
    return model.destroy();
  });
  App.reqres.setHandler("localplaylist:entities", function() {
    return API.getListCollection();
  });
  App.commands.setHandler("localplaylist:clear:entities", function(playlistId) {
    return API.clearPlaylist(playlistId);
  });
  App.reqres.setHandler("localplaylist:entity", function(id) {
    var collection;
    collection = API.getListCollection();
    return collection.findWhere({
      id: parseInt(id)
    });
  });
  App.reqres.setHandler("localplaylist:item:entities", function(key) {
    return API.getItemCollection(key);
  });
  App.reqres.setHandler("localplaylist:item:add:entities", function(playlistId, collection) {
    return API.addItemsToPlaylist(playlistId, collection);
  });

  /*
    Thumbs up lists
   */
  App.reqres.setHandler("thumbsup:toggle:entity", function(model) {
    var collection, existing, media, position;
    media = model.get('type');
    collection = API.getItemCollection(API.getThumbsKey(media));
    position = collection ? collection.length + 1 : 1;
    existing = collection.findWhere({
      id: model.get('id')
    });
    if (existing) {
      existing.destroy();
    } else {
      collection.create(API.getSavedModelFromSource(model.attributes, position));
    }
    return collection;
  });
  App.reqres.setHandler("thumbsup:get:entities", function(media) {
    return API.getItemCollection(API.getThumbsKey(media));
  });
  App.reqres.setHandler("thumbsup:check", function(model) {
    var collection, existing;
    if (model != null) {
      collection = API.getItemCollection(API.getThumbsKey(model.get('type')));
      existing = collection.findWhere({
        id: model.get('id')
      });
      return _.isObject(existing);
    } else {
      return false;
    }
  });

  /*
    Local player lists
   */
  App.reqres.setHandler("localplayer:get:entities", function(media) {
    if (media == null) {
      media = 'audio';
    }
    return API.getItemCollection(API.getlocalPlayerKey(media));
  });
  App.commands.setHandler("localplayer:clear:entities", function(media) {
    if (media == null) {
      media = 'audio';
    }
    return API.clearPlaylist(API.getlocalPlayerKey(media));
  });
  return App.reqres.setHandler("localplayer:item:add:entities", function(collection, media) {
    if (media == null) {
      media = 'audio';
    }
    return API.addItemsToPlaylist(API.getlocalPlayerKey(media), collection);
  });
});

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  var API;
  Entities.NavMain = (function(_super) {
    __extends(NavMain, _super);

    function NavMain() {
      return NavMain.__super__.constructor.apply(this, arguments);
    }

    NavMain.prototype.defaults = {
      id: 0,
      title: 'Untitled',
      path: '',
      icon: '',
      classes: '',
      parent: 0,
      children: []
    };

    return NavMain;

  })(Entities.Model);
  Entities.NavMainCollection = (function(_super) {
    __extends(NavMainCollection, _super);

    function NavMainCollection() {
      return NavMainCollection.__super__.constructor.apply(this, arguments);
    }

    NavMainCollection.prototype.model = Entities.NavMain;

    return NavMainCollection;

  })(Entities.Collection);
  API = {
    getItems: function() {
      var nav;
      nav = [];
      nav.push({
        id: 1,
        title: "Music",
        path: 'music',
        icon: 'mdi-av-my-library-music',
        classes: 'nav-music',
        parent: 0
      });
      nav.push({
        id: 2,
        title: "Recent",
        path: 'music',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 3,
        title: "Artists",
        path: 'music/artists',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 4,
        title: "Albums",
        path: 'music/albums',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 5,
        title: "Digital Radio",
        path: 'music/radio',
        icon: '',
        classes: 'pvr-link',
        parent: 1,
        visibility: "addon:pvr:enabled"
      });
      nav.push({
        id: 11,
        title: "Movies",
        path: 'movies/recent',
        icon: 'mdi-av-movie',
        classes: 'nav-movies',
        parent: 0
      });
      nav.push({
        id: 12,
        title: "Recent Movies",
        path: 'movies/recent',
        icon: '',
        classes: '',
        parent: 11
      });
      nav.push({
        id: 13,
        title: "All Movies",
        path: 'movies',
        icon: '',
        classes: '',
        parent: 11
      });
      nav.push({
        id: 21,
        title: "TV Shows",
        path: 'tvshows/recent',
        icon: 'mdi-hardware-tv',
        classes: 'nav-tv',
        parent: 0
      });
      nav.push({
        id: 22,
        title: "Recent Episodes",
        path: 'tvshows/recent',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 23,
        title: "All TVShows",
        path: 'tvshows',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 24,
        title: "Live TV",
        path: 'tvshows/live',
        icon: '',
        classes: 'pvr-link',
        parent: 21,
        visibility: "addon:pvr:enabled"
      });
      nav.push({
        id: 31,
        title: "Browser",
        path: 'browser',
        icon: 'mdi-action-view-list',
        classes: 'nav-browser',
        parent: 0
      });
      nav.push({
        id: 41,
        title: "Thumbs Up",
        path: 'thumbsup',
        icon: 'mdi-action-thumb-up',
        classes: 'nav-thumbs-up',
        parent: 0
      });
      nav.push({
        id: 42,
        title: "Playlists",
        path: 'playlists',
        icon: 'mdi-action-assignment',
        classes: 'playlists',
        parent: 0
      });
      nav.push({
        id: 51,
        title: "Settings",
        path: 'settings/web',
        icon: 'mdi-action-settings',
        classes: 'nav-browser',
        parent: 0
      });
      nav.push({
        id: 52,
        title: "Web Settings",
        path: 'settings/web',
        icon: '',
        classes: '',
        parent: 51
      });
      nav.push({
        id: 53,
        title: "Kodi Settings",
        path: 'settings/kodi',
        icon: '',
        classes: '',
        parent: 51
      });
      return this.checkVisibility(nav);
    },
    checkVisibility: function(items) {
      var item, newItems, _i, _len;
      newItems = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item.visibility != null) {
          if (App.request(item.visibility)) {
            newItems.push(item);
          }
        } else {
          newItems.push(item);
        }
      }
      return newItems;
    },
    getDefaultStructure: function() {
      var navCollection, navParsed;
      navParsed = this.sortStructure(this.getItems());
      navCollection = new Entities.NavMainCollection(navParsed);
      return navCollection;
    },
    getChildStructure: function(parentId) {
      var childItems, nav, parent;
      nav = this.getItems();
      parent = _.findWhere(nav, {
        id: parentId
      });
      childItems = _.where(nav, {
        parent: parentId
      });
      parent.items = new Entities.NavMainCollection(childItems);
      return new Entities.NavMain(parent);
    },
    sortStructure: function(structure) {
      var children, i, model, newParents, _i, _len, _name;
      children = {};
      for (_i = 0, _len = structure.length; _i < _len; _i++) {
        model = structure[_i];
        if (!((model.path != null) && model.parent !== 0)) {
          continue;
        }
        model.title = t.gettext(model.title);
        if (children[_name = model.parent] == null) {
          children[_name] = [];
        }
        children[model.parent].push(model);
      }
      newParents = [];
      for (i in structure) {
        model = structure[i];
        if (model.path != null) {
          if (model.parent === 0) {
            model.children = children[model.id];
            newParents.push(model);
          }
        }
      }
      return newParents;
    }
  };
  return App.reqres.setHandler("navMain:entities", function(parentId) {
    if (parentId == null) {
      parentId = 'all';
    }
    if (parentId === 'all') {
      return API.getDefaultStructure();
    } else {
      return API.getChildStructure(parentId);
    }
  });
});

this.Kodi.module("Controllers", function(Controllers, App, Backbone, Marionette, $, _) {
  return Controllers.Base = (function(_super) {
    __extends(Base, _super);

    Base.prototype.params = {};

    function Base(options) {
      if (options == null) {
        options = {};
      }
      this.region = options.region || App.request("default:region");
      this.params = helpers.url.params();
      Base.__super__.constructor.call(this, options);
      this._instance_id = _.uniqueId("controller");
      App.execute("register:instance", this, this._instance_id);
    }

    Base.prototype.close = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      delete this.region;
      delete this.options;
      Base.__super__.close.call(this, args);
      return App.execute("unregister:instance", this, this._instance_id);
    };

    Base.prototype.show = function(view) {
      this.listenTo(view, "close", this.close);
      return this.region.show(view);
    };

    return Base;

  })(Backbone.Marionette.Controller);
});

this.Kodi.module("Router", function(Router, App, Backbone, Marionette, $, _) {
  return Router.Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype.before = function(route, params) {
      return App.execute("loading:show:page");
    };

    Base.prototype.after = function(route, params) {
      return this.setBodyClasses();
    };

    Base.prototype.setBodyClasses = function() {
      var $body, section;
      $body = App.getRegion('root').$el;
      $body.removeClassRegex(/^section-/);
      $body.removeClassRegex(/^page-/);
      section = helpers.url.arg(0);
      if (section === '') {
        section = 'home';
      }
      $body.addClass('section-' + section);
      return $body.addClass('page-' + helpers.url.arg().join('-'));
    };

    return Base;

  })(Marionette.AppRouter);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.itemViewEventPrefix = "childview";

    CollectionView.prototype.onShow = function() {
      return $("img.lazy").lazyload({
        threshold: 200
      });
    };

    return CollectionView;

  })(Backbone.Marionette.CollectionView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.CompositeView = (function(_super) {
    __extends(CompositeView, _super);

    function CompositeView() {
      return CompositeView.__super__.constructor.apply(this, arguments);
    }

    CompositeView.prototype.itemViewEventPrefix = "childview";

    return CompositeView;

  })(Backbone.Marionette.CompositeView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.ItemView = (function(_super) {
    __extends(ItemView, _super);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    return ItemView;

  })(Backbone.Marionette.ItemView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.LayoutView = (function(_super) {
    __extends(LayoutView, _super);

    function LayoutView() {
      return LayoutView.__super__.constructor.apply(this, arguments);
    }

    return LayoutView;

  })(Backbone.Marionette.LayoutView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  var _remove;
  _remove = Marionette.View.prototype.remove;
  return _.extend(Marionette.View.prototype, {
    themeLink: function(name, url, options) {
      var attrs;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        external: false,
        className: ''
      });
      attrs = !options.external ? {
        href: "#" + url
      } : void 0;
      if (options.className !== '') {
        attrs["class"] = options.className;
      }
      return this.themeTag('a', attrs, name);
    },
    parseAttributes: function(attrs) {
      var a, attr, val;
      a = [];
      for (attr in attrs) {
        val = attrs[attr];
        a.push("" + attr + "='" + val + "'");
      }
      return a.join(' ');
    },
    themeTag: function(el, attrs, value) {
      var attrsString;
      attrsString = this.parseAttributes(attrs);
      return "<" + el + " " + attrsString + ">" + value + "</" + el + ">";
    }
  });
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.VirtualListView = (function(_super) {
    __extends(VirtualListView, _super);

    function VirtualListView() {
      return VirtualListView.__super__.constructor.apply(this, arguments);
    }

    VirtualListView.prototype.originalCollection = {};

    VirtualListView.prototype.preload = 20;

    VirtualListView.prototype.originalChildView = {};

    VirtualListView.prototype.buffer = 30;

    VirtualListView.prototype.isTicking = false;

    VirtualListView.prototype.addChild = function(child, ChildView, index) {
      if (index > this.preload) {
        ChildView = App.Views.CardViewPlaceholder;
      }
      return Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    };

    VirtualListView.prototype.bindScroll = function() {
      $(window).scrollStopped((function(_this) {
        return function() {
          return _this.requestTick();
        };
      })(this));
      return $(window).resizeStopped((function(_this) {
        return function() {
          return _this.requestTick();
        };
      })(this));
    };

    VirtualListView.prototype.initialize = function() {
      this.originalChildView = this.getOption('childView');
      this.placeholderChildView = App.Views.CardViewPlaceholder;
      return this.bindScroll();
    };

    VirtualListView.prototype.onRender = function() {
      return this.requestTick();
    };

    VirtualListView.prototype.requestTick = function() {
      if (!this.isTicking) {
        requestAnimationFrame((function(_this) {
          return function() {
            return _this.renderItemsInViewport();
          };
        })(this));
      }
      return this.isTicking = true;
    };

    VirtualListView.prototype.renderItemsInViewport = function() {
      var $cards, max, min, visibleIndexes, visibleRange, _i, _results;
      this.isTicking = false;
      $cards = $(".card", this.$el);
      visibleIndexes = [];
      $cards.each((function(_this) {
        return function(i, d) {
          if ($(d).visible(true)) {
            return visibleIndexes.push(i);
          }
        };
      })(this));
      min = _.min(visibleIndexes);
      max = _.max(visibleIndexes);
      min = (min - this.buffer) < 0 ? 0 : min - this.buffer;
      max = (max + this.buffer) >= $cards.length ? $cards.length - 1 : max + this.buffer;
      visibleRange = (function() {
        _results = [];
        for (var _i = min; min <= max ? _i <= max : _i >= max; min <= max ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
      return $cards.each((function(_this) {
        return function(i, d) {
          if ($(d).hasClass('ph') && helpers.global.inArray(i, visibleRange)) {
            return $(d).replaceWith(_this.getRenderedChildView($(d).data('model'), _this.originalChildView, i));
          } else if (!$(d).hasClass('ph') && !helpers.global.inArray(i, visibleRange)) {
            return $(d).replaceWith(_this.getRenderedChildView($(d).data('model'), _this.placeholderChildView, i));
          }
        };
      })(this));
    };

    VirtualListView.prototype.getRenderedChildView = function(child, ChildView, index) {
      var childViewOptions, view;
      childViewOptions = this.getOption('childViewOptions');
      childViewOptions = Marionette._getValue(childViewOptions, this, [child, index]);
      view = this.buildChildView(child, ChildView, childViewOptions);
      this.proxyChildEvents(view);
      return view.render().$el;
    };

    VirtualListView.prototype.events = {
      "click a": "storeScroll"
    };

    VirtualListView.prototype.storeScroll = function() {
      return helpers.backscroll.setLast();
    };

    VirtualListView.prototype.onShow = function() {
      return helpers.backscroll.scrollToLast();
    };

    VirtualListView.prototype.onDestroy = function() {
      $(window).unbind('scroll');
      return $(window).unbind('resize');
    };

    return VirtualListView;

  })(Views.CollectionView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  Views.CardView = (function(_super) {
    __extends(CardView, _super);

    function CardView() {
      return CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.prototype.template = "views/card/card";

    CardView.prototype.tagName = "li";

    CardView.prototype.events = {
      "click .dropdown > i": "populateMenu",
      "click .thumbs": "toggleThumbs"
    };

    CardView.prototype.populateMenu = function() {
      var key, menu, val, _ref;
      menu = '';
      if (this.model.get('menu')) {
        _ref = this.model.get('menu');
        for (key in _ref) {
          val = _ref[key];
          menu += this.themeTag('li', {
            "class": key
          }, val);
        }
        return this.$el.find('.dropdown-menu').html(menu);
      }
    };

    CardView.prototype.toggleThumbs = function() {
      App.request("thumbsup:toggle:entity", this.model);
      return this.$el.toggleClass('thumbs-up');
    };

    CardView.prototype.attributes = function() {
      var classes;
      classes = ['card', 'card-loaded'];
      if (App.request("thumbsup:check", this.model)) {
        classes.push('thumbs-up');
      }
      return {
        "class": classes.join(' ')
      };
    };

    CardView.prototype.onRender = function() {
      return this.$el.data('model', this.model);
    };

    CardView.prototype.onShow = function() {
      return $('.dropdown', this.$el).on('click', function() {
        return $(this).removeClass('open').trigger('hide.bs.dropdown');
      });
    };

    return CardView;

  })(App.Views.ItemView);
  return Views.CardViewPlaceholder = (function(_super) {
    __extends(CardViewPlaceholder, _super);

    function CardViewPlaceholder() {
      return CardViewPlaceholder.__super__.constructor.apply(this, arguments);
    }

    CardViewPlaceholder.prototype.template = "views/card/card_placeholder";

    CardViewPlaceholder.prototype.attributes = function() {
      return {
        "class": 'card ph'
      };
    };

    CardViewPlaceholder.prototype.onRender = function() {
      return this.$el.data('model', this.model);
    };

    return CardViewPlaceholder;

  })(App.Views.ItemView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.EmptyView = (function(_super) {
    __extends(EmptyView, _super);

    function EmptyView() {
      return EmptyView.__super__.constructor.apply(this, arguments);
    }

    EmptyView.prototype.template = "views/empty/empty";

    EmptyView.prototype.regions = {
      regionEmptyContent: ".region-empty-content"
    };

    return EmptyView;

  })(App.Views.ItemView);
});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  Views.LayoutWithSidebarFirstView = (function(_super) {
    __extends(LayoutWithSidebarFirstView, _super);

    function LayoutWithSidebarFirstView() {
      return LayoutWithSidebarFirstView.__super__.constructor.apply(this, arguments);
    }

    LayoutWithSidebarFirstView.prototype.template = "views/layouts/layout_with_sidebar_first";

    LayoutWithSidebarFirstView.prototype.regions = {
      regionSidebarFirst: ".region-first",
      regionContent: ".region-content"
    };

    return LayoutWithSidebarFirstView;

  })(App.Views.LayoutView);
  Views.LayoutWithHeaderView = (function(_super) {
    __extends(LayoutWithHeaderView, _super);

    function LayoutWithHeaderView() {
      return LayoutWithHeaderView.__super__.constructor.apply(this, arguments);
    }

    LayoutWithHeaderView.prototype.template = "views/layouts/layout_with_header";

    LayoutWithHeaderView.prototype.regions = {
      regionHeader: ".region-header",
      regionContentTop: ".region-content-top",
      regionContent: ".region-content"
    };

    return LayoutWithHeaderView;

  })(App.Views.LayoutView);
  return Views.LayoutDetailsHeaderView = (function(_super) {
    __extends(LayoutDetailsHeaderView, _super);

    function LayoutDetailsHeaderView() {
      return LayoutDetailsHeaderView.__super__.constructor.apply(this, arguments);
    }

    LayoutDetailsHeaderView.prototype.template = "views/layouts/layout_details_header";

    LayoutDetailsHeaderView.prototype.regions = {
      regionSide: ".region-details-side",
      regionTitle: ".region-details-title",
      regionMeta: ".region-details-meta",
      regionMetaSideFirst: ".region-details-meta-side-first",
      regionMetaSideSecond: ".region-details-meta-side-second",
      regionMetaBelow: ".region-details-meta-below",
      regionFanart: ".region-details-fanart"
    };

    LayoutDetailsHeaderView.prototype.onRender = function() {
      return $('.region-details-fanart', this.$el).css('background-image', 'url("' + this.model.get('fanart') + '")');
    };

    return LayoutDetailsHeaderView;

  })(App.Views.LayoutView);
});

this.Kodi.module("Components.Form", function(Form, App, Backbone, Marionette, $, _) {
  Form.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var config;
      if (options == null) {
        options = {};
      }
      config = options.config ? options.config : {};
      this.formLayout = this.getFormLayout(config);
      this.listenTo(this.formLayout, "show", (function(_this) {
        return function() {
          _this.formBuild(options.form, options.formState, config);
          return $.material.init();
        };
      })(this));
      this.listenTo(this.formLayout, "form:submit", (function(_this) {
        return function() {
          return _this.formSubmit(options);
        };
      })(this));
      return this;
    };

    Controller.prototype.formSubmit = function(options) {
      var data;
      data = Backbone.Syphon.serialize(this.formLayout);
      return this.processFormSubmit(data, options);
    };

    Controller.prototype.processFormSubmit = function(data, options) {
      if (options.config && typeof options.config.callback === 'function') {
        return options.config.callback(data, this.formLayout);
      }
    };

    Controller.prototype.getFormLayout = function(options) {
      if (options == null) {
        options = {};
      }
      return new Form.FormWrapper({
        config: options
      });
    };

    Controller.prototype.formBuild = function(form, formState, options) {
      var buildView, collection;
      if (form == null) {
        form = [];
      }
      if (formState == null) {
        formState = {};
      }
      if (options == null) {
        options = {};
      }
      collection = App.request("form:item:entites", form, formState);
      buildView = new Form.Groups({
        collection: collection
      });
      return this.formLayout.formContentRegion.show(buildView);
    };

    return Controller;

  })(App.Controllers.Base);
  App.reqres.setHandler("form:wrapper", function(options) {
    var formController;
    if (options == null) {
      options = {};
    }
    formController = new Form.Controller(options);
    return formController.formLayout;
  });
  return App.reqres.setHandler("form:popup:wrapper", function(options) {
    var formContent, formController, originalCallback;
    if (options == null) {
      options = {};
    }
    originalCallback = options.config.callback;
    options.config.callback = function(data, layout) {
      App.execute("ui:modal:close");
      return originalCallback(data, layout);
    };
    formController = new Form.Controller(options);
    formContent = formController.formLayout.render().$el;
    formController.formLayout.trigger('show');
    return App.execute("ui:modal:form:show", options.title, formContent);
  });
});

this.Kodi.module("Components.Form", function(Form, App, Backbone, Marionette, $, _) {
  Form.FormWrapper = (function(_super) {
    __extends(FormWrapper, _super);

    function FormWrapper() {
      return FormWrapper.__super__.constructor.apply(this, arguments);
    }

    FormWrapper.prototype.template = "components/form/form";

    FormWrapper.prototype.tagName = "form";

    FormWrapper.prototype.regions = {
      formContentRegion: ".form-content-region",
      formResponse: ".response"
    };

    FormWrapper.prototype.triggers = {
      "click .form-save": "form:submit",
      "click [data-form-button='cancel']": "form:cancel"
    };

    FormWrapper.prototype.modelEvents = {
      "change:_errors": "changeErrors",
      "sync:start": "syncStart",
      "sync:stop": "syncStop"
    };

    FormWrapper.prototype.initialize = function() {
      this.config = this.options.config;
      return this.on("form:save", (function(_this) {
        return function(msg) {
          return _this.addSuccessMsg(msg);
        };
      })(this));
    };

    FormWrapper.prototype.attributes = function() {
      var attrs;
      attrs = {
        "class": 'component-form'
      };
      if (this.options.config && this.options.config.attributes) {
        attrs = _.extend(attrs, this.options.config.attributes);
      }
      return attrs;
    };

    FormWrapper.prototype.onShow = function() {
      return _.defer((function(_this) {
        return function() {
          if (_this.config.focusFirstInput) {
            _this.focusFirstInput();
          }
          return $('.btn').ripples({
            color: 'rgba(255,255,255,0.1)'
          });
        };
      })(this));
    };

    FormWrapper.prototype.focusFirstInput = function() {
      return this.$(":input:visible:enabled:first").focus();
    };

    FormWrapper.prototype.changeErrors = function(model, errors, options) {
      if (this.config.errors) {
        if (_.isEmpty(errors)) {
          return this.removeErrors();
        } else {
          return this.addErrors(errors);
        }
      }
    };

    FormWrapper.prototype.removeErrors = function() {
      return this.$(".error").removeClass("error").find("small").remove();
    };

    FormWrapper.prototype.addErrors = function(errors) {
      var array, name, _results;
      if (errors == null) {
        errors = {};
      }
      _results = [];
      for (name in errors) {
        array = errors[name];
        _results.push(this.addError(name, array[0]));
      }
      return _results;
    };

    FormWrapper.prototype.addError = function(name, error) {
      var el, sm;
      el = this.$("[name='" + name + "']");
      sm = $("<small>").text(error);
      return el.after(sm).closest(".row").addClass("error");
    };

    FormWrapper.prototype.addSuccessMsg = function(msg) {
      var $el;
      $el = $(".response", this.$el);
      $el.html(msg).show();
      return setTimeout((function() {
        return $el.fadeOut();
      }), 5000);
    };

    return FormWrapper;

  })(App.Views.LayoutView);
  Form.Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.template = 'components/form/form_item';

    Item.prototype.tagName = 'div';

    Item.prototype.initialize = function() {
      var attrs, baseAttrs, el, key, materialBaseAttrs, options, val, _ref;
      baseAttrs = _.extend({
        id: 'form-edit-' + this.model.get('id'),
        name: this.model.get('id')
      }, this.model.get('attributes'));
      materialBaseAttrs = _.extend(baseAttrs, {
        "class": 'form-control'
      });
      switch (this.model.get('type')) {
        case 'checkbox':
          attrs = {
            type: 'checkbox',
            value: 1,
            "class": 'form-checkbox'
          };
          if (this.model.get('defaultValue') === true) {
            attrs.checked = 'checked';
          }
          el = this.themeTag('input', _.extend(baseAttrs, attrs), '');
          break;
        case 'textfield':
          attrs = {
            type: 'text',
            value: this.model.get('defaultValue')
          };
          el = this.themeTag('input', _.extend(materialBaseAttrs, attrs), '');
          break;
        case 'textarea':
          el = this.themeTag('textarea', materialBaseAttrs, this.model.get('defaultValue'));
          break;
        case 'select':
          options = '';
          _ref = this.model.get('options');
          for (key in _ref) {
            val = _ref[key];
            attrs = {
              value: key
            };
            if (this.model.get('defaultValue') === key) {
              attrs.selected = 'selected';
            }
            options += this.themeTag('option', attrs, val);
          }
          el = this.themeTag('select', _.extend(baseAttrs, {
            "class": 'form-control'
          }), options);
          break;
        default:
          el = '';
      }
      return this.model.set({
        element: el
      });
    };

    Item.prototype.attributes = function() {
      return {
        "class": 'form-item form-group form-type-' + this.model.get('type') + ' form-edit-' + this.model.get('id')
      };
    };

    return Item;

  })(App.Views.ItemView);
  Form.Group = (function(_super) {
    __extends(Group, _super);

    function Group() {
      return Group.__super__.constructor.apply(this, arguments);
    }

    Group.prototype.template = 'components/form/form_item_group';

    Group.prototype.tagName = 'div';

    Group.prototype.className = 'form-group';

    Group.prototype.childView = Form.Item;

    Group.prototype.childViewContainer = '.form-items';

    Group.prototype.initialize = function() {
      return this.collection = this.model.get('children');
    };

    return Group;

  })(App.Views.CompositeView);
  return Form.Groups = (function(_super) {
    __extends(Groups, _super);

    function Groups() {
      return Groups.__super__.constructor.apply(this, arguments);
    }

    Groups.prototype.childView = Form.Group;

    Groups.prototype.className = 'form-groups';

    return Groups;

  })(App.Views.CollectionView);
});

this.Kodi.module("AddonApp", function(AddonApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    addonController: function() {
      return App.request("command:kodi:controller", 'auto', 'AddOn');
    },
    getEnabledAddons: function(callback) {
      return this.addonController().getEnabledAddons(callback);
    }
  };
  return App.on("before:start", function() {
    return API.getEnabledAddons(function(resp) {
      config.set("static", "addOnsEnabled", resp);
      return config.set("static", "addOnsLoaded", true);
    });
  });
});

this.Kodi.module("AddonApp.Pvr", function(Pvr, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    pvrEnabled: function() {
      var addons, enabled, pvrClients;
      enabled = false;
      if (config.get("static", "addOnsLoaded", false)) {
        addons = config.get("static", "addOnsEnabled", []);
        pvrClients = _.findWhere(addons, {
          type: 'xbmc.pvrclient'
        });
        enabled = pvrClients != null ? true : false;
      }
      return enabled;
    }
  };
  return App.reqres.setHandler("addon:pvr:enabled", function() {
    return API.pvrEnabled();
  });
});

this.Kodi.module("AlbumApp", function(AlbumApp, App, Backbone, Marionette, $, _) {
  var API;
  AlbumApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "music": "recent",
      "music/albums": "list",
      "music/album/:id": "view"
    };

    return Router;

  })(App.Router.Base);
  API = {
    recent: function() {
      return new AlbumApp.Landing.Controller();
    },
    list: function() {
      return new AlbumApp.List.Controller();
    },
    view: function(id) {
      return new AlbumApp.Show.Controller({
        id: id
      });
    },
    action: function(op, view) {
      var localPlaylist, model, playlist;
      model = view.model;
      playlist = App.request("command:kodi:controller", 'audio', 'PlayList');
      switch (op) {
        case 'play':
          return App.execute("command:audio:play", 'albumid', model.get('albumid'));
        case 'add':
          return playlist.add('albumid', model.get('albumid'));
        case 'localadd':
          return App.execute("localplaylist:addentity", 'albumid', model.get('albumid'));
        case 'localplay':
          localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
          return localPlaylist.play('albumid', model.get('albumid'));
      }
    }
  };
  App.on("before:start", function() {
    return new AlbumApp.Router({
      controller: API
    });
  });
  App.commands.setHandler('album:action', function(op, model) {
    return API.action(op, model);
  });
  return App.reqres.setHandler('album:action:items', function() {
    return {
      actions: {
        thumbs: 'Thumbs up'
      },
      menu: {
        add: 'Add to Kodi playlist',
        localadd: 'Add to local playlist',
        divider: '',
        localplay: 'Play in browser'
      }
    };
  });
});

this.Kodi.module("AlbumApp.Landing", function(Landing, App, Backbone, Marionette, $, _) {
  return Landing.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.subNavId = 1;

    Controller.prototype.initialize = function() {
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getPageView();
          return _this.getSubNav();
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayoutView = function() {
      return new Landing.Layout();
    };

    Controller.prototype.getSubNav = function() {
      var subNav;
      subNav = App.request("navMain:children:show", this.subNavId, 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    Controller.prototype.getPageView = function() {
      this.page = new Landing.Page();
      this.listenTo(this.page, "show", (function(_this) {
        return function() {
          _this.renderRecentlyAdded();
          return _this.renderRecentlyPlayed();
        };
      })(this));
      return this.layout.regionContent.show(this.page);
    };

    Controller.prototype.renderRecentlyAdded = function() {
      var collection;
      collection = App.request("album:recentlyadded:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var view;
          view = App.request("album:list:view", collection);
          return _this.page.regionRecentlyAdded.show(view);
        };
      })(this));
    };

    Controller.prototype.renderRecentlyPlayed = function() {
      var collection;
      collection = App.request("album:recentlyplayed:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var view;
          view = App.request("album:list:view", collection);
          return _this.page.regionRecentlyPlayed.show(view);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("AlbumApp.Landing", function(Landing, App, Backbone, Marionette, $, _) {
  Landing.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.className = "album-landing landing-page";

    return Layout;

  })(App.Views.LayoutWithSidebarFirstView);
  return Landing.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.template = 'apps/album/landing/landing';

    Page.prototype.className = "album-recent";

    Page.prototype.regions = {
      regionRecentlyAdded: '.region-recently-added',
      regionRecentlyPlayed: '.region-recently-played'
    };

    return Page;

  })(App.Views.LayoutView);
});

this.Kodi.module("AlbumApp.List", function(List, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    bindTriggers: function(view) {
      App.listenTo(view, 'childview:album:play', function(list, item) {
        return App.execute('album:action', 'play', item);
      });
      App.listenTo(view, 'childview:album:add', function(list, item) {
        return App.execute('album:action', 'add', item);
      });
      App.listenTo(view, 'childview:album:localadd', function(list, item) {
        return App.execute('album:action', 'localadd', item);
      });
      return App.listenTo(view, 'childview:album:localplay', function(list, item) {
        return App.execute('album:action', 'localplay', item);
      });
    },
    getAlbumsList: function(collection, set) {
      var view, viewName;
      if (set == null) {
        set = false;
      }
      viewName = set ? 'AlbumsSet' : 'Albums';
      view = new List[viewName]({
        collection: collection
      });
      API.bindTriggers(view);
      return view;
    }
  };
  List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var collection;
      collection = App.request("album:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          collection.availableFilters = _this.getAvailableFilters();
          collection.sectionId = 1;
          App.request('filter:init', _this.getAvailableFilters());
          _this.layout = _this.getLayoutView(collection);
          _this.listenTo(_this.layout, "show", function() {
            _this.renderList(collection);
            return _this.getFiltersView(collection);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new List.ListLayout({
        collection: collection
      });
    };

    Controller.prototype.getAvailableFilters = function() {
      return {
        sort: ['label', 'year', 'rating'],
        filter: ['year', 'genre']
      };
    };

    Controller.prototype.getFiltersView = function(collection) {
      var filters;
      filters = App.request('filter:show', collection);
      this.layout.regionSidebarFirst.show(filters);
      return this.listenTo(filters, "filter:changed", (function(_this) {
        return function() {
          return _this.renderList(collection);
        };
      })(this));
    };

    Controller.prototype.renderList = function(collection) {
      var filteredCollection, view;
      App.execute("loading:show:view", this.layout.regionContent);
      filteredCollection = App.request('filter:apply:entites', collection);
      view = API.getAlbumsList(filteredCollection);
      return this.layout.regionContent.show(view);
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("album:list:view", function(collection) {
    return API.getAlbumsList(collection, true);
  });
});

this.Kodi.module("AlbumApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "album-list with-filters";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.AlbumTeaser = (function(_super) {
    __extends(AlbumTeaser, _super);

    function AlbumTeaser() {
      return AlbumTeaser.__super__.constructor.apply(this, arguments);
    }

    AlbumTeaser.prototype.triggers = {
      "click .play": "album:play",
      "click .dropdown .add": "album:add",
      "click .dropdown .localadd": "album:localadd",
      "click .dropdown .localplay": "album:localplay"
    };

    AlbumTeaser.prototype.initialize = function() {
      var artist, artistLink;
      AlbumTeaser.__super__.initialize.apply(this, arguments);
      if (this.model != null) {
        this.model.set(App.request('album:action:items'));
        artist = this.model.get('artist') !== '' ? this.model.get('artist') : '&nbsp;';
        artistLink = this.themeLink(artist, helpers.url.get('artist', this.model.get('artistid')));
        return this.model.set({
          subtitle: artistLink
        });
      }
    };

    return AlbumTeaser;

  })(App.Views.CardView);
  List.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "album-empty-result";

    return Empty;

  })(App.Views.EmptyView);
  List.Albums = (function(_super) {
    __extends(Albums, _super);

    function Albums() {
      return Albums.__super__.constructor.apply(this, arguments);
    }

    Albums.prototype.childView = List.AlbumTeaser;

    Albums.prototype.emptyView = List.Empty;

    Albums.prototype.tagName = "ul";

    Albums.prototype.sort = 'artist';

    Albums.prototype.className = "card-grid--square";

    return Albums;

  })(App.Views.VirtualListView);
  return List.AlbumsSet = (function(_super) {
    __extends(AlbumsSet, _super);

    function AlbumsSet() {
      return AlbumsSet.__super__.constructor.apply(this, arguments);
    }

    AlbumsSet.prototype.childView = List.AlbumTeaser;

    AlbumsSet.prototype.emptyView = List.Empty;

    AlbumsSet.prototype.tagName = "ul";

    AlbumsSet.prototype.sort = 'artist';

    AlbumsSet.prototype.className = "card-grid--square";

    return AlbumsSet;

  })(App.Views.CollectionView);
});

this.Kodi.module("AlbumApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    bindTriggers: function(view) {
      App.listenTo(view, 'album:play', function(item) {
        return App.execute('album:action', 'play', item);
      });
      App.listenTo(view, 'album:add', function(item) {
        return App.execute('album:action', 'add', item);
      });
      App.listenTo(view, 'album:localadd', function(item) {
        return App.execute('album:action', 'localadd', item);
      });
      return App.listenTo(view, 'album:localplay', function(item) {
        return App.execute('album:action', 'localplay', item);
      });
    },
    getAlbumsFromSongs: function(songs) {
      var album, albumid, albumsCollectionView, songCollection;
      albumsCollectionView = new Show.WithSongsCollection();
      albumsCollectionView.on("add:child", (function(_this) {
        return function(albumView) {
          return App.execute("when:entity:fetched", album, function() {
            var model, songView, teaser;
            model = albumView.model;
            teaser = new Show.AlbumTeaser({
              model: model
            });
            API.bindTriggers(teaser);
            albumView.regionMeta.show(teaser);
            songView = App.request("song:list:view", songs[model.get('albumid')]);
            return albumView.regionSongs.show(songView);
          });
        };
      })(this));
      for (albumid in songs) {
        songCollection = songs[albumid];
        album = App.request("album:entity", albumid, {
          success: function(album) {
            return albumsCollectionView.addChild(album, Show.WithSongsLayout);
          }
        });
      }
      return albumsCollectionView;
    }
  };
  Show.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var album, id;
      id = parseInt(options.id);
      album = App.request("album:entity", id);
      return App.execute("when:entity:fetched", album, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(album);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", 'none');
          });
          _this.listenTo(_this.layout, "show", function() {
            _this.getMusic(id);
            return _this.getDetailsLayoutView(album);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(album) {
      return new Show.PageLayout({
        model: album
      });
    };

    Controller.prototype.getDetailsLayoutView = function(album) {
      var headerLayout;
      headerLayout = new Show.HeaderLayout({
        model: album
      });
      this.listenTo(headerLayout, "show", (function(_this) {
        return function() {
          var detail, teaser;
          teaser = new Show.AlbumDetailTeaser({
            model: album
          });
          API.bindTriggers(teaser);
          detail = new Show.Details({
            model: album
          });
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        };
      })(this));
      return this.layout.regionHeader.show(headerLayout);
    };

    Controller.prototype.getMusic = function(id) {
      var options, songs;
      options = {
        filter: {
          albumid: id
        }
      };
      songs = App.request("song:filtered:entities", options);
      return App.execute("when:entity:fetched", songs, (function(_this) {
        return function() {
          var albumView, songView;
          albumView = new Show.WithSongsLayout();
          songView = App.request("song:list:view", songs);
          _this.listenTo(albumView, "show", function() {
            return albumView.regionSongs.show(songView);
          });
          return _this.layout.regionContent.show(albumView);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("albums:withsongs:view", function(songs) {
    return API.getAlbumsFromSongs(songs);
  });
});

this.Kodi.module("AlbumApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  Show.WithSongsLayout = (function(_super) {
    __extends(WithSongsLayout, _super);

    function WithSongsLayout() {
      return WithSongsLayout.__super__.constructor.apply(this, arguments);
    }

    WithSongsLayout.prototype.template = 'apps/album/show/album_with_songs';

    WithSongsLayout.prototype.className = 'album-wrapper';

    WithSongsLayout.prototype.regions = {
      regionMeta: '.region-album-meta',
      regionSongs: '.region-album-songs'
    };

    return WithSongsLayout;

  })(App.Views.LayoutView);
  Show.WithSongsCollection = (function(_super) {
    __extends(WithSongsCollection, _super);

    function WithSongsCollection() {
      return WithSongsCollection.__super__.constructor.apply(this, arguments);
    }

    WithSongsCollection.prototype.childView = Show.WithSongsLayout;

    WithSongsCollection.prototype.tagName = "div";

    WithSongsCollection.prototype.sort = 'year';

    WithSongsCollection.prototype.className = "albums-wrapper";

    return WithSongsCollection;

  })(App.Views.CollectionView);
  Show.PageLayout = (function(_super) {
    __extends(PageLayout, _super);

    function PageLayout() {
      return PageLayout.__super__.constructor.apply(this, arguments);
    }

    PageLayout.prototype.className = 'album-show detail-container';

    return PageLayout;

  })(App.Views.LayoutWithHeaderView);
  Show.HeaderLayout = (function(_super) {
    __extends(HeaderLayout, _super);

    function HeaderLayout() {
      return HeaderLayout.__super__.constructor.apply(this, arguments);
    }

    HeaderLayout.prototype.className = 'album-details';

    return HeaderLayout;

  })(App.Views.LayoutDetailsHeaderView);
  Show.Details = (function(_super) {
    __extends(Details, _super);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.template = 'apps/album/show/details_meta';

    return Details;

  })(App.Views.ItemView);
  Show.AlbumTeaser = (function(_super) {
    __extends(AlbumTeaser, _super);

    function AlbumTeaser() {
      return AlbumTeaser.__super__.constructor.apply(this, arguments);
    }

    AlbumTeaser.prototype.tagName = "div";

    AlbumTeaser.prototype.className = "card-minimal";

    AlbumTeaser.prototype.initialize = function() {
      this.model.set({
        subtitle: this.model.get('year')
      });
      return this.model.set(App.request('album:action:items'));
    };

    return AlbumTeaser;

  })(App.AlbumApp.List.AlbumTeaser);
  return Show.AlbumDetailTeaser = (function(_super) {
    __extends(AlbumDetailTeaser, _super);

    function AlbumDetailTeaser() {
      return AlbumDetailTeaser.__super__.constructor.apply(this, arguments);
    }

    AlbumDetailTeaser.prototype.className = "card-detail";

    return AlbumDetailTeaser;

  })(Show.AlbumTeaser);
});

this.Kodi.module("ArtistApp", function(ArtistApp, App, Backbone, Marionette, $, _) {
  var API;
  ArtistApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "music/artists": "list",
      "music/artist/:id": "view"
    };

    return Router;

  })(App.Router.Base);
  API = {
    list: function() {
      return new ArtistApp.List.Controller();
    },
    view: function(id) {
      return new ArtistApp.Show.Controller({
        id: id
      });
    },
    action: function(op, view) {
      var localPlaylist, model, playlist;
      model = view.model;
      playlist = App.request("command:kodi:controller", 'audio', 'PlayList');
      switch (op) {
        case 'play':
          return App.execute("command:audio:play", 'artistid', model.get('artistid'));
        case 'add':
          return playlist.add('artistid', model.get('artistid'));
        case 'localadd':
          return App.execute("localplaylist:addentity", 'artistid', model.get('artistid'));
        case 'localplay':
          localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
          return localPlaylist.play('artistid', model.get('artistid'));
      }
    }
  };
  App.on("before:start", function() {
    return new ArtistApp.Router({
      controller: API
    });
  });
  App.commands.setHandler('artist:action', function(op, model) {
    return API.action(op, model);
  });
  return App.reqres.setHandler('artist:action:items', function() {
    return {
      actions: {
        thumbs: 'Thumbs up'
      },
      menu: {
        add: 'Add to Kodi playlist',
        localadd: 'Add to local playlist',
        divider: '',
        localplay: 'Play in browser'
      }
    };
  });
});

this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    bindTriggers: function(view) {
      App.listenTo(view, 'childview:artist:play', function(list, item) {
        return App.execute('artist:action', 'play', item);
      });
      App.listenTo(view, 'childview:artist:add', function(list, item) {
        return App.execute('artist:action', 'add', item);
      });
      App.listenTo(view, 'childview:artist:localadd', function(list, item) {
        return App.execute('artist:action', 'localadd', item);
      });
      return App.listenTo(view, 'childview:artist:localplay', function(list, item) {
        return App.execute('artist:action', 'localplay', item);
      });
    },
    getArtistList: function(collection, set) {
      var view, viewName;
      if (set == null) {
        set = false;
      }
      viewName = set ? 'ArtistsSet' : 'Artists';
      view = new List[viewName]({
        collection: collection
      });
      API.bindTriggers(view);
      return view;
    }
  };
  List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var collection;
      collection = App.request("artist:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          collection.availableFilters = _this.getAvailableFilters();
          collection.sectionId = 1;
          App.request('filter:init', _this.getAvailableFilters());
          _this.layout = _this.getLayoutView(collection);
          _this.listenTo(_this.layout, "show", function() {
            _this.renderList(collection);
            return _this.getFiltersView(collection);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new List.ListLayout({
        collection: collection
      });
    };

    Controller.prototype.getAvailableFilters = function() {
      return {
        sort: ['label'],
        filter: ['mood', 'genre', 'style']
      };
    };

    Controller.prototype.getFiltersView = function(collection) {
      var filters;
      filters = App.request('filter:show', collection);
      this.layout.regionSidebarFirst.show(filters);
      return this.listenTo(filters, "filter:changed", (function(_this) {
        return function() {
          return _this.renderList(collection);
        };
      })(this));
    };

    Controller.prototype.renderList = function(collection) {
      var filteredCollection, view;
      App.execute("loading:show:view", this.layout.regionContent);
      filteredCollection = App.request('filter:apply:entites', collection);
      view = API.getArtistList(filteredCollection);
      return this.layout.regionContent.show(view);
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("artist:list:view", function(collection) {
    return API.getArtistList(collection, true);
  });
});

this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "artist-list with-filters";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.ArtistTeaser = (function(_super) {
    __extends(ArtistTeaser, _super);

    function ArtistTeaser() {
      return ArtistTeaser.__super__.constructor.apply(this, arguments);
    }

    ArtistTeaser.prototype.triggers = {
      "click .play": "artist:play",
      "click .dropdown .add": "artist:add",
      "click .dropdown .localadd": "artist:localadd",
      "click .dropdown .localplay": "artist:localplay"
    };

    ArtistTeaser.prototype.initialize = function() {
      ArtistTeaser.__super__.initialize.apply(this, arguments);
      if (this.model != null) {
        return this.model.set(App.request('album:action:items'));
      }
    };

    return ArtistTeaser;

  })(App.Views.CardView);
  List.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "artist-empty-result";

    return Empty;

  })(App.Views.EmptyView);
  List.Artists = (function(_super) {
    __extends(Artists, _super);

    function Artists() {
      return Artists.__super__.constructor.apply(this, arguments);
    }

    Artists.prototype.childView = List.ArtistTeaser;

    Artists.prototype.emptyView = List.Empty;

    Artists.prototype.tagName = "ul";

    Artists.prototype.className = "card-grid--wide";

    return Artists;

  })(App.Views.VirtualListView);
  return List.ArtistsSet = (function(_super) {
    __extends(ArtistsSet, _super);

    function ArtistsSet() {
      return ArtistsSet.__super__.constructor.apply(this, arguments);
    }

    ArtistsSet.prototype.childView = List.ArtistTeaser;

    ArtistsSet.prototype.emptyView = List.Empty;

    ArtistsSet.prototype.tagName = "ul";

    ArtistsSet.prototype.className = "card-grid--wide";

    return ArtistsSet;

  })(App.Views.CollectionView);
});

this.Kodi.module("ArtistApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  return Show.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var artist, id;
      id = parseInt(options.id);
      artist = App.request("artist:entity", id);
      return App.execute("when:entity:fetched", artist, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(artist);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", 'none');
          });
          _this.listenTo(_this.layout, "show", function() {
            _this.getMusic(id);
            return _this.getDetailsLayoutView(artist);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(artist) {
      return new Show.PageLayout({
        model: artist
      });
    };

    Controller.prototype.getDetailsLayoutView = function(artist) {
      var headerLayout;
      headerLayout = new Show.HeaderLayout({
        model: artist
      });
      this.listenTo(headerLayout, "show", (function(_this) {
        return function() {
          var detail, teaser;
          teaser = new Show.ArtistTeaser({
            model: artist
          });
          detail = new Show.Details({
            model: artist
          });
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        };
      })(this));
      return this.layout.regionHeader.show(headerLayout);
    };

    Controller.prototype.getMusic = function(id) {
      var options, songs;
      options = {
        filter: {
          artistid: id
        }
      };
      songs = App.request("song:filtered:entities", options);
      return App.execute("when:entity:fetched", songs, (function(_this) {
        return function() {
          var albumsCollection, songsCollections;
          songsCollections = App.request("song:albumparse:entities", songs);
          albumsCollection = App.request("albums:withsongs:view", songsCollections);
          return _this.layout.regionContent.show(albumsCollection);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("ArtistApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  Show.PageLayout = (function(_super) {
    __extends(PageLayout, _super);

    function PageLayout() {
      return PageLayout.__super__.constructor.apply(this, arguments);
    }

    PageLayout.prototype.className = 'artist-show detail-container';

    return PageLayout;

  })(App.Views.LayoutWithHeaderView);
  Show.HeaderLayout = (function(_super) {
    __extends(HeaderLayout, _super);

    function HeaderLayout() {
      return HeaderLayout.__super__.constructor.apply(this, arguments);
    }

    HeaderLayout.prototype.className = 'artist-details';

    return HeaderLayout;

  })(App.Views.LayoutDetailsHeaderView);
  Show.Details = (function(_super) {
    __extends(Details, _super);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.template = 'apps/artist/show/details_meta';

    return Details;

  })(App.Views.ItemView);
  return Show.ArtistTeaser = (function(_super) {
    __extends(ArtistTeaser, _super);

    function ArtistTeaser() {
      return ArtistTeaser.__super__.constructor.apply(this, arguments);
    }

    ArtistTeaser.prototype.tagName = "div";

    ArtistTeaser.prototype.className = "card-detail";

    return ArtistTeaser;

  })(App.ArtistApp.List.ArtistTeaser);
});

soundManager.setup({
  url: 'lib/soundmanager/swf/',
  flashVersion: 9,
  preferFlash: true,
  useHTML5Audio: true,
  useFlashBlock: false,
  flashLoadTimeout: 3000,
  debugMode: false,
  noSWFCache: true,
  debugFlash: false,
  flashPollingInterval: 1000,
  html5PollingInterval: 1000,
  onready: function() {
    return $(window).trigger('audiostream:ready');
  },
  ontimeout: function() {
    $(window).trigger('audiostream:timout');
    soundManager.flashLoadTimeout = 0;
    soundManager.onerror = {};
    return soundManager.reboot();
  }
});

this.Kodi.module("BrowserApp", function(BrowserApp, App, Backbone, Marionette, $, _) {
  var API;
  BrowserApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "browser": "list",
      "browser/:media/:id": "view"
    };

    return Router;

  })(App.Router.Base);
  API = {
    list: function() {
      return new BrowserApp.List.Controller;
    },
    view: function(media, id) {
      return new BrowserApp.List.Controller({
        media: media,
        id: id
      });
    }
  };
  return App.on("before:start", function() {
    return new BrowserApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("BrowserApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.sourceCollection = {};

    Controller.prototype.backButtonModel = {};

    Controller.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      console.log(options);
      this.layout = this.getLayout();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getSources(options);
          return _this.getFolderLayout();
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayout = function() {
      return new List.ListLayout();
    };

    Controller.prototype.getFolderLayout = function() {
      this.folderLayout = new List.FolderLayout();
      return this.layout.regionContent.show(this.folderLayout);
    };

    Controller.prototype.getSources = function(options) {
      var sources;
      sources = App.request("file:source:entities", 'video');
      return App.execute("when:entity:fetched", sources, (function(_this) {
        return function() {
          var setView, sets;
          _this.sourceCollection = sources;
          sets = App.request("file:source:media:entities", sources);
          setView = new List.SourcesSet({
            collection: sets
          });
          _this.layout.regionSidebarFirst.show(setView);
          _this.listenTo(setView, 'childview:childview:source:open', function(set, item) {
            return _this.getFolder(item.model);
          });
          return _this.loadFromUrl(options);
        };
      })(this));
    };

    Controller.prototype.loadFromUrl = function(options) {
      var model;
      if (options.media && options.id) {
        model = App.request("file:url:entity", options.media, options.id);
        console.log(model);
        return this.getFolder(model);
      }
    };

    Controller.prototype.getFolder = function(model) {
      var collection, pathCollection;
      App.navigate(model.get('url'));
      collection = App.request("file:entities", {
        file: model.get('file'),
        media: model.get('media')
      });
      pathCollection = App.request("file:path:entities", model.get('file'), this.sourceCollection);
      this.getPathList(pathCollection);
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var collections;
          collections = App.request("file:parsed:entities", collection);
          console.log(collections);
          _this.getFolderList(collections.directory);
          return _this.getFileList(collections.file);
        };
      })(this));
    };

    Controller.prototype.getFolderList = function(collection) {
      var folderView;
      folderView = new List.FolderList({
        collection: collection
      });
      this.folderLayout.regionFolders.show(folderView);
      this.getBackButton();
      this.listenTo(folderView, 'childview:folder:open', (function(_this) {
        return function(set, item) {
          console.log('clicked', item);
          return _this.getFolder(item.model);
        };
      })(this));
      return this.listenTo(folderView, 'childview:folder:play', (function(_this) {
        return function(set, item) {
          var playlist;
          playlist = App.request("command:kodi:controller", item.model.get('player'), 'PlayList');
          return playlist.play('directory', item.model.get('file'));
        };
      })(this));
    };

    Controller.prototype.getFileList = function(collection) {
      var fileView;
      fileView = new List.FileList({
        collection: collection
      });
      this.folderLayout.regionFiles.show(fileView);
      return this.listenTo(fileView, 'childview:file:play', (function(_this) {
        return function(set, item) {
          var playlist;
          playlist = App.request("command:kodi:controller", item.model.get('player'), 'PlayList');
          console.log('playing', item.model.get('player'), item.model.get('file'));
          return playlist.play('file', item.model.get('file'));
        };
      })(this));
    };

    Controller.prototype.getPathList = function(collection) {
      var pathView;
      pathView = new List.PathList({
        collection: collection
      });
      this.folderLayout.regionPath.show(pathView);
      this.setBackModel(collection);
      return this.listenTo(pathView, 'childview:folder:open', (function(_this) {
        return function(set, item) {
          return _this.getFolder(item.model);
        };
      })(this));
    };

    Controller.prototype.setBackModel = function(pathCollection) {
      if (pathCollection.length >= 2) {
        return this.backButtonModel = pathCollection.models[pathCollection.length - 2];
      } else {
        return this.backButtonModel = {};
      }
    };

    Controller.prototype.getBackButton = function() {
      var backView;
      if (this.backButtonModel.attributes) {
        console.log('back');
        backView = new List.Back({
          model: this.backButtonModel
        });
        this.folderLayout.regionBack.show(backView);
        return this.listenTo(backView, 'folder:open', (function(_this) {
          return function(model) {
            return _this.getFolder(model.model);
          };
        })(this));
      } else {
        return this.folderLayout.regionBack.empty();
      }
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("BrowserApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "browser-page";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);

  /*
    Sources
   */
  List.Source = (function(_super) {
    __extends(Source, _super);

    function Source() {
      return Source.__super__.constructor.apply(this, arguments);
    }

    Source.prototype.template = 'apps/browser/list/source';

    Source.prototype.tagName = 'li';

    Source.prototype.triggers = {
      'click .source': 'source:open'
    };

    return Source;

  })(App.Views.ItemView);
  List.Sources = (function(_super) {
    __extends(Sources, _super);

    function Sources() {
      return Sources.__super__.constructor.apply(this, arguments);
    }

    Sources.prototype.template = 'apps/browser/list/source_set';

    Sources.prototype.childView = List.Source;

    Sources.prototype.tagName = "div";

    Sources.prototype.childViewContainer = 'ul.sources';

    Sources.prototype.className = "source-set";

    Sources.prototype.initialize = function() {
      return this.collection = this.model.get('sources');
    };

    return Sources;

  })(App.Views.CompositeView);
  List.SourcesSet = (function(_super) {
    __extends(SourcesSet, _super);

    function SourcesSet() {
      return SourcesSet.__super__.constructor.apply(this, arguments);
    }

    SourcesSet.prototype.childView = List.Sources;

    SourcesSet.prototype.tagName = "div";

    SourcesSet.prototype.className = "sources-sets";

    return SourcesSet;

  })(App.Views.CollectionView);

  /*
    Folder
   */
  List.FolderLayout = (function(_super) {
    __extends(FolderLayout, _super);

    function FolderLayout() {
      return FolderLayout.__super__.constructor.apply(this, arguments);
    }

    FolderLayout.prototype.template = 'apps/browser/list/folder_layout';

    FolderLayout.prototype.className = "folder-page-wrapper";

    FolderLayout.prototype.regions = {
      regionPath: '.path',
      regionFolders: '.folders',
      regionFiles: '.files',
      regionBack: '.back'
    };

    return FolderLayout;

  })(App.Views.LayoutView);
  List.Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.template = 'apps/browser/list/file';

    Item.prototype.tagName = 'li';

    return Item;

  })(App.Views.ItemView);
  List.Folder = (function(_super) {
    __extends(Folder, _super);

    function Folder() {
      return Folder.__super__.constructor.apply(this, arguments);
    }

    Folder.prototype.className = 'folder';

    Folder.prototype.triggers = {
      'click .title': 'folder:open',
      'click .play': 'folder:play'
    };

    return Folder;

  })(List.Item);
  List.File = (function(_super) {
    __extends(File, _super);

    function File() {
      return File.__super__.constructor.apply(this, arguments);
    }

    File.prototype.className = 'file';

    File.prototype.triggers = {
      'click .play': 'file:play'
    };

    return File;

  })(List.Item);
  List.FolderList = (function(_super) {
    __extends(FolderList, _super);

    function FolderList() {
      return FolderList.__super__.constructor.apply(this, arguments);
    }

    FolderList.prototype.tagName = 'ul';

    FolderList.prototype.childView = List.Folder;

    return FolderList;

  })(App.Views.CollectionView);
  List.FileList = (function(_super) {
    __extends(FileList, _super);

    function FileList() {
      return FileList.__super__.constructor.apply(this, arguments);
    }

    FileList.prototype.tagName = 'ul';

    FileList.prototype.childView = List.File;

    return FileList;

  })(App.Views.CollectionView);

  /*
    Path
   */
  List.Path = (function(_super) {
    __extends(Path, _super);

    function Path() {
      return Path.__super__.constructor.apply(this, arguments);
    }

    Path.prototype.template = 'apps/browser/list/path';

    Path.prototype.tagName = 'li';

    Path.prototype.triggers = {
      'click .title': 'folder:open'
    };

    return Path;

  })(App.Views.ItemView);
  List.PathList = (function(_super) {
    __extends(PathList, _super);

    function PathList() {
      return PathList.__super__.constructor.apply(this, arguments);
    }

    PathList.prototype.tagName = 'ul';

    PathList.prototype.childView = List.Path;

    return PathList;

  })(App.Views.CollectionView);
  return List.Back = (function(_super) {
    __extends(Back, _super);

    function Back() {
      return Back.__super__.constructor.apply(this, arguments);
    }

    Back.prototype.template = 'apps/browser/list/back_button';

    Back.prototype.tagName = 'div';

    Back.prototype.className = 'back-button';

    Back.prototype.triggers = {
      'click .title': 'folder:open'
    };

    return Back;

  })(App.Views.ItemView);
});

this.Kodi.module("CastApp", function(CastApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getCastCollection: function(cast, origin) {
      return App.request("cast:entities", cast, origin);
    },
    getCastView: function(collection) {
      var view;
      view = new CastApp.List.CastList({
        collection: collection
      });
      App.listenTo(view, 'childview:cast:google', function(parent, child) {
        return window.open('https://www.google.com/webhp?#q=' + encodeURIComponent(child.model.get('name')));
      });
      App.listenTo(view, 'childview:cast:imdb', function(parent, child) {
        return window.open('http://www.imdb.com/find?s=nm&q=' + encodeURIComponent(child.model.get('name')));
      });
      return view;
    }
  };
  return App.reqres.setHandler('cast:list:view', function(cast, origin) {
    var collection;
    collection = API.getCastCollection(cast, origin);
    return API.getCastView(collection);
  });
});

this.Kodi.module("CastApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.CastTeaser = (function(_super) {
    __extends(CastTeaser, _super);

    function CastTeaser() {
      return CastTeaser.__super__.constructor.apply(this, arguments);
    }

    CastTeaser.prototype.template = 'apps/cast/list/cast';

    CastTeaser.prototype.tagName = "li";

    CastTeaser.prototype.triggers = {
      "click .imdb": "cast:imdb",
      "click .google": "cast:google"
    };

    return CastTeaser;

  })(App.Views.ItemView);
  return List.CastList = (function(_super) {
    __extends(CastList, _super);

    function CastList() {
      return CastList.__super__.constructor.apply(this, arguments);
    }

    CastList.prototype.childView = List.CastTeaser;

    CastList.prototype.tagName = "ul";

    CastList.prototype.className = "cast-full";

    return CastList;

  })(App.Views.CollectionView);
});

this.Kodi.module("CommandApp", function(CommandApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    currentAudioPlaylistController: function() {
      var stateObj;
      stateObj = App.request("state:current");
      return App.request("command:" + stateObj.getPlayer() + ":controller", 'audio', 'PlayList');
    }
  };

  /*
    Kodi.
   */
  App.reqres.setHandler("command:kodi:player", function(method, params, callback) {
    var commander;
    commander = new CommandApp.Kodi.Player('auto');
    return commander.sendCommand(method, params, callback);
  });
  App.reqres.setHandler("command:kodi:controller", function(media, controller) {
    if (media == null) {
      media = 'auto';
    }
    return new CommandApp.Kodi[controller](media);
  });

  /*
    Local.
   */
  App.reqres.setHandler("command:local:player", function(method, params, callback) {
    var commander;
    commander = new CommandApp.Local.Player('audio');
    return commander.sendCommand(method, params, callback);
  });
  App.reqres.setHandler("command:local:controller", function(media, controller) {
    if (media == null) {
      media = 'auto';
    }
    return new CommandApp.Local[controller](media);
  });

  /*
    Wrappers single command for playing in kodi and local.
   */
  App.commands.setHandler("command:audio:play", function(type, value) {
    return API.currentAudioPlaylistController().play(type, value);
  });
  App.commands.setHandler("command:audio:add", function(type, value) {
    return API.currentAudioPlaylistController().add(type, value);
  });
  return App.addInitializer(function() {});
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype.ajaxOptions = {};

    Base.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      $.jsonrpc.defaultUrl = helpers.url.baseKodiUrl("Base");
      return this.setOptions(options);
    };

    Base.prototype.setOptions = function(options) {
      return this.ajaxOptions = options;
    };

    Base.prototype.multipleCommands = function(commands, callback) {
      var obj;
      obj = $.jsonrpc(commands, this.ajaxOptions);
      obj.fail((function(_this) {
        return function(error) {
          return _this.onError(commands, error);
        };
      })(this));
      obj.done((function(_this) {
        return function(response) {
          response = _this.parseResponse(commands, response);
          _this.triggerMethod("response:ready", response);
          if (callback != null) {
            return _this.doCallback(callback, response);
          }
        };
      })(this));
      return obj;
    };

    Base.prototype.singleCommand = function(command, params, callback) {
      var obj;
      command = {
        method: command
      };
      if ((params != null) && (params.length > 0 || _.isObject(params))) {
        command.params = params;
      }
      obj = this.multipleCommands([command], callback);
      return obj;
    };

    Base.prototype.parseResponse = function(commands, response) {
      var i, result, results;
      results = [];
      for (i in response) {
        result = response[i];
        if (result.result || result.result === false) {
          results.push(result.result);
        } else {
          this.onError(commands[i], result);
        }
      }
      if (commands.length === 1 && results.length === 1) {
        results = results[0];
      }
      return results;
    };

    Base.prototype.paramObj = function(key, val) {
      return helpers.global.paramObj(key, val);
    };

    Base.prototype.doCallback = function(callback, response) {
      if (callback != null) {
        return callback(response);
      }
    };

    Base.prototype.onError = function(commands, error) {
      return helpers.debug.rpcError(commands, error);
    };

    return Base;

  })(Marionette.Object);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  Api.Commander = (function(_super) {
    __extends(Commander, _super);

    function Commander() {
      return Commander.__super__.constructor.apply(this, arguments);
    }

    Commander.prototype.playerActive = 0;

    Commander.prototype.playerName = 'music';

    Commander.prototype.playerForced = false;

    Commander.prototype.playerIds = {
      audio: 0,
      video: 1
    };

    Commander.prototype.setPlayer = function(player) {
      if (player === 'audio' || player === 'video') {
        this.playerActive = this.playerIds[player];
        this.playerName = player;
        return this.playerForced = true;
      }
    };

    Commander.prototype.getPlayer = function() {
      return this.playerActive;
    };

    Commander.prototype.getPlayerName = function() {
      return this.playerName;
    };

    Commander.prototype.playerIdToName = function(playerId) {
      playerName;
      var id, name, playerName, _ref;
      _ref = this.playerIds;
      for (name in _ref) {
        id = _ref[name];
        if (id === playerId) {
          playerName = name;
        }
      }
      return playerName;
    };

    Commander.prototype.commandNameSpace = 'JSONRPC';

    Commander.prototype.getCommand = function(command, namespace) {
      if (namespace == null) {
        namespace = this.commandNameSpace;
      }
      return namespace + '.' + command;
    };

    Commander.prototype.sendCommand = function(command, params, callback) {
      return this.singleCommand(this.getCommand(command), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    return Commander;

  })(Api.Base);
  return Api.Player = (function(_super) {
    __extends(Player, _super);

    function Player() {
      return Player.__super__.constructor.apply(this, arguments);
    }

    Player.prototype.commandNameSpace = 'Player';

    Player.prototype.playlistApi = {};

    Player.prototype.initialize = function(media) {
      if (media == null) {
        media = 'audio';
      }
      this.setPlayer(media);
      return this.playlistApi = App.request("playlist:kodi:entity:api");
    };

    Player.prototype.getParams = function(params, callback) {
      var defaultParams;
      if (params == null) {
        params = [];
      }
      if (this.playerForced) {
        defaultParams = [this.playerActive];
        return this.doCallback(callback, defaultParams.concat(params));
      } else {
        return this.getActivePlayers((function(_this) {
          return function(activeId) {
            defaultParams = [activeId];
            return _this.doCallback(callback, defaultParams.concat(params));
          };
        })(this));
      }
    };

    Player.prototype.getActivePlayers = function(callback) {
      return this.singleCommand(this.getCommand("GetActivePlayers"), {}, (function(_this) {
        return function(resp) {
          if (resp.length > 0) {
            _this.playerActive = resp[0].playerid;
            _this.playerName = _this.playerIdToName(_this.playerActive);
            _this.triggerMethod("player:ready", _this.playerActive);
            return _this.doCallback(callback, _this.playerActive);
          } else {
            return _this.doCallback(callback, _this.playerActive);
          }
        };
      })(this));
    };

    Player.prototype.sendCommand = function(command, params, callback) {
      if (params == null) {
        params = [];
      }
      return this.getParams(params, (function(_this) {
        return function(playerParams) {
          return _this.singleCommand(_this.getCommand(command), playerParams, function(resp) {
            return _this.doCallback(callback, resp);
          });
        };
      })(this));
    };

    Player.prototype.playEntity = function(type, value, options, callback) {
      var data, params;
      if (options == null) {
        options = {};
      }
      params = [];
      data = this.paramObj(type, value);
      if (type === 'position') {
        data.playlistid = this.getPlayer();
      }
      params.push(data);
      if (options.length > 0) {
        params.push(options);
      }
      return this.singleCommand(this.getCommand('Open', 'Player'), params, (function(_this) {
        return function(resp) {
          if (!App.request('sockets:active')) {
            App.request('state:kodi:update');
          }
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    Player.prototype.getPlaying = function(callback) {
      var obj;
      obj = {
        active: false,
        properties: false,
        item: false
      };
      return this.singleCommand(this.getCommand('GetActivePlayers'), {}, (function(_this) {
        return function(resp) {
          var commands, itemFields, playerFields;
          if (resp.length > 0) {
            obj.active = resp[0];
            commands = [];
            itemFields = helpers.entities.getFields(_this.playlistApi.fields, 'full');
            playerFields = ["playlistid", "speed", "position", "totaltime", "time", "percentage", "shuffled", "repeat", "canrepeat", "canshuffle", "canseek", "partymode"];
            commands.push({
              method: _this.getCommand('GetProperties'),
              params: [obj.active.playerid, playerFields]
            });
            commands.push({
              method: _this.getCommand('GetItem'),
              params: [obj.active.playerid, itemFields]
            });
            return _this.multipleCommands(commands, function(playing) {
              obj.properties = playing[0];
              obj.item = playing[1].item;
              return _this.doCallback(callback, obj);
            });
          } else {
            return _this.doCallback(callback, false);
          }
        };
      })(this));
    };

    return Player;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.AddOn = (function(_super) {
    __extends(AddOn, _super);

    function AddOn() {
      return AddOn.__super__.constructor.apply(this, arguments);
    }

    AddOn.prototype.commandNameSpace = 'Addons';

    AddOn.prototype.getAddons = function(type, enabled, callback) {
      if (type == null) {
        type = "unknown";
      }
      if (enabled == null) {
        enabled = true;
      }
      return this.singleCommand(this.getCommand('GetAddons'), [type, "unknown", enabled], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp.addons);
        };
      })(this));
    };

    AddOn.prototype.getEnabledAddons = function(callback) {
      return this.getAddons("unknown", true, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    return AddOn;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.commandNameSpace = 'Application';

    Application.prototype.getProperties = function(callback) {
      return this.singleCommand(this.getCommand('GetProperties'), [["volume", "muted"]], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    Application.prototype.setVolume = function(volume, callback) {
      return this.singleCommand(this.getCommand('SetVolume'), [volume], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    Application.prototype.toggleMute = function(callback) {
      var stateObj;
      stateObj = App.request("state:kodi");
      return this.singleCommand(this.getCommand('SetMute'), [!stateObj.getState('muted')], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    Application.prototype.quit = function(callback) {
      return this.singleCommand(this.getCommand('Quit'), [], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    return Application;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.AudioLibrary = (function(_super) {
    __extends(AudioLibrary, _super);

    function AudioLibrary() {
      return AudioLibrary.__super__.constructor.apply(this, arguments);
    }

    AudioLibrary.prototype.commandNameSpace = 'AudioLibrary';

    AudioLibrary.prototype.setAlbumDetails = function(id, fields, callback) {
      var params;
      if (fields == null) {
        fields = {};
      }
      params = {
        albumid: id
      };
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetAlbumDetails'), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    AudioLibrary.prototype.setArtistDetails = function(id, fields, callback) {
      var params;
      if (fields == null) {
        fields = {};
      }
      params = {
        artistid: id
      };
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetArtistDetails'), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    AudioLibrary.prototype.setArtistDetails = function(id, fields, callback) {
      var params;
      if (fields == null) {
        fields = {};
      }
      params = {
        songid: id
      };
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetSongDetails'), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    AudioLibrary.prototype.scan = function(callback) {
      return this.singleCommand(this.getCommand('Scan'), (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    return AudioLibrary;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.Files = (function(_super) {
    __extends(Files, _super);

    function Files() {
      return Files.__super__.constructor.apply(this, arguments);
    }

    Files.prototype.commandNameSpace = 'Files';

    Files.prototype.prepareDownload = function(file, callback) {
      return this.singleCommand(this.getCommand('PrepareDownload'), [file], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    Files.prototype.downloadPath = function(file, callback) {
      return this.prepareDownload(file, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp.details.path);
        };
      })(this));
    };

    Files.prototype.downloadFile = function(file) {
      var dl;
      dl = window.open('about:blank', 'download');
      return this.downloadPath(file, function(path) {
        return dl.location = path;
      });
    };

    Files.prototype.videoStream = function(file, player) {
      var st;
      if (player == null) {
        player = 'html5';
      }
      st = helpers.global.localVideoPopup('about:blank');
      return this.downloadPath(file, function(path) {
        return st.location = "videoPlayer.html?player=" + player + '&src=' + encodeURIComponent(path);
      });
    };

    return Files;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.Input = (function(_super) {
    __extends(Input, _super);

    function Input() {
      return Input.__super__.constructor.apply(this, arguments);
    }

    Input.prototype.commandNameSpace = 'Input';

    Input.prototype.sendText = function(text, callback) {
      return this.singleCommand(this.getCommand('SendText'), [text], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    Input.prototype.sendInput = function(type, callback) {
      return this.singleCommand(this.getCommand(type), [], (function(_this) {
        return function(resp) {
          _this.doCallback(callback, resp);
          if (!App.request('sockets:active')) {
            return App.request('state:kodi:update', callback);
          }
        };
      })(this));
    };

    return Input;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.PlayList = (function(_super) {
    __extends(PlayList, _super);

    function PlayList() {
      return PlayList.__super__.constructor.apply(this, arguments);
    }

    PlayList.prototype.commandNameSpace = 'Playlist';

    PlayList.prototype.play = function(type, value) {
      var stateObj;
      stateObj = App.request("state:kodi");
      if (stateObj.isPlaying()) {
        return this.insertAndPlay(type, value, stateObj.getPlaying('position') + 1);
      } else {
        return this.clear((function(_this) {
          return function() {
            return _this.insertAndPlay(type, value, 0);
          };
        })(this));
      }
    };

    PlayList.prototype.playCollection = function(collection, position) {
      if (position == null) {
        position = 0;
      }
      return this.clear((function(_this) {
        return function() {
          var commands, i, model, models, params, player, pos, type;
          models = collection.getRawCollection();
          player = _this.getPlayer();
          commands = [];
          for (i in models) {
            model = models[i];
            pos = parseInt(position) + parseInt(i);
            type = model.type === 'file' ? 'file' : model.type + 'id';
            params = [player, pos, _this.paramObj(type, model[type])];
            commands.push({
              method: _this.getCommand('Insert'),
              params: params
            });
          }
          return _this.multipleCommands(commands, function(resp) {
            return _this.playEntity('position', parseInt(position), {}, function() {
              return _this.refreshPlaylistView();
            });
          });
        };
      })(this));
    };

    PlayList.prototype.add = function(type, value) {
      return this.playlistSize((function(_this) {
        return function(size) {
          return _this.insert(type, value, size);
        };
      })(this));
    };

    PlayList.prototype.remove = function(position, callback) {
      return this.singleCommand(this.getCommand('Remove'), [this.getPlayer(), parseInt(position)], (function(_this) {
        return function(resp) {
          _this.refreshPlaylistView();
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    PlayList.prototype.clear = function(callback) {
      return this.singleCommand(this.getCommand('Clear'), [this.getPlayer()], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    PlayList.prototype.insert = function(type, value, position, callback) {
      if (position == null) {
        position = 0;
      }
      return this.singleCommand(this.getCommand('Insert'), [this.getPlayer(), parseInt(position), this.paramObj(type, value)], (function(_this) {
        return function(resp) {
          _this.refreshPlaylistView();
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    PlayList.prototype.getItems = function(callback) {
      return this.singleCommand(this.getCommand('GetItems'), [this.getPlayer(), ['title']], (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    PlayList.prototype.insertAndPlay = function(type, value, position, callback) {
      if (position == null) {
        position = 0;
      }
      return this.insert(type, value, position, (function(_this) {
        return function(resp) {
          return _this.playEntity('position', parseInt(position), {}, function() {
            return _this.doCallback(callback, resp);
          });
        };
      })(this));
    };

    PlayList.prototype.playlistSize = function(callback) {
      return this.getItems((function(_this) {
        return function(resp) {
          var position;
          position = resp.items != null ? resp.items.length : 0;
          return _this.doCallback(callback, position);
        };
      })(this));
    };

    PlayList.prototype.refreshPlaylistView = function() {
      var wsActive;
      wsActive = App.request("sockets:active");
      if (!wsActive) {
        return App.execute("playlist:refresh", 'kodi', this.playerName);
      }
    };

    PlayList.prototype.moveItem = function(media, id, position1, position2, callback) {
      var idProp;
      idProp = media === 'file' ? 'file' : media + 'id';
      return this.singleCommand(this.getCommand('Remove'), [this.getPlayer(), parseInt(position1)], (function(_this) {
        return function(resp) {
          return _this.insert(idProp, id, position2, function() {
            return _this.doCallback(callback, position2);
          });
        };
      })(this));
    };

    return PlayList;

  })(Api.Player);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.PVR = (function(_super) {
    __extends(PVR, _super);

    function PVR() {
      return PVR.__super__.constructor.apply(this, arguments);
    }

    PVR.prototype.commandNameSpace = 'PVR';

    PVR.prototype.setPVRRecord = function(id, fields, callback) {
      var params;
      if (fields == null) {
        fields = {};
      }
      params = {
        channel: id
      };
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('Record'), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    return PVR;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Kodi", function(Api, App, Backbone, Marionette, $, _) {
  return Api.VideoLibrary = (function(_super) {
    __extends(VideoLibrary, _super);

    function VideoLibrary() {
      return VideoLibrary.__super__.constructor.apply(this, arguments);
    }

    VideoLibrary.prototype.commandNameSpace = 'VideoLibrary';

    VideoLibrary.prototype.setEpisodeDetails = function(id, fields, callback) {
      var params;
      if (fields == null) {
        fields = {};
      }
      params = {
        episodeid: id
      };
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetEpisodeDetails'), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    VideoLibrary.prototype.setMovieDetails = function(id, fields, callback) {
      var params;
      if (fields == null) {
        fields = {};
      }
      params = {
        movieid: id
      };
      params = _.extend(params, fields);
      return this.singleCommand(this.getCommand('SetMovieDetails'), params, (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    VideoLibrary.prototype.scan = function(callback) {
      return this.singleCommand(this.getCommand('Scan'), (function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp);
        };
      })(this));
    };

    VideoLibrary.prototype.toggleWatched = function(model, callback) {
      var fields, setPlaycount;
      setPlaycount = model.get('playcount') > 0 ? 0 : 1;
      fields = helpers.global.paramObj('playcount', setPlaycount);
      if (model.get('type') === 'movie') {
        this.setMovieDetails(model.get('id'), fields, (function(_this) {
          return function() {
            helpers.cache.updateCollection('MovieCollection', 'movies', model.get('id'), 'playcount', setPlaycount);
            return _this.doCallback(callback, setPlaycount);
          };
        })(this));
      }
      if (model.get('type') === 'episode') {
        return this.setEpisodeDetails(model.get('id'), fields, (function(_this) {
          return function() {
            helpers.cache.updateCollection('TVShowCollection', 'tvshows', model.get('tvshowid'), 'playcount', setPlaycount);
            return _this.doCallback(callback, setPlaycount);
          };
        })(this));
      }
    };

    return VideoLibrary;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {
  return Api.Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype.localLoad = function(model, callback) {
      var files, stateObj;
      stateObj = App.request("state:local");
      if (model == null) {
        stateObj.setPlaying('playing', false);
        this.localStateUpdate();
        return;
      }
      stateObj.setState('currentPlaybackId', 'browser-' + model.get('id'));
      files = App.request("command:kodi:controller", 'video', 'Files');
      return files.downloadPath(model.get('file'), (function(_this) {
        return function(path) {
          var sm;
          sm = soundManager;
          _this.localStop();
          stateObj.setState('localPlay', sm.createSound({
            id: stateObj.getState('currentPlaybackId'),
            url: path,
            autoplay: false,
            autoLoad: true,
            stream: true,
            onerror: function() {
              return console.log('SM ERROR!');
            },
            onplay: function() {
              stateObj.setPlayer('local');
              stateObj.setPlaying('playing', true);
              stateObj.setPlaying('paused', false);
              stateObj.setPlaying('playState', 'playing');
              stateObj.setPlaying('position', model.get('position'));
              stateObj.setPlaying('itemChanged', true);
              stateObj.setPlaying('item', model.attributes);
              stateObj.setPlaying('totaltime', helpers.global.secToTime(model.get('duration')));
              return _this.localStateUpdate();
            },
            onstop: function() {
              stateObj.setPlaying('playing', false);
              return _this.localStateUpdate();
            },
            onpause: function() {
              stateObj.setPlaying('paused', true);
              stateObj.setPlaying('playState', 'paused');
              return _this.localStateUpdate();
            },
            onresume: function() {
              stateObj.setPlaying('paused', false);
              stateObj.setPlaying('playState', 'playing');
              return _this.localStateUpdate();
            },
            onfinish: function() {
              return _this.localFinished();
            },
            whileplaying: function() {
              var dur, percentage, pos;
              pos = parseInt(this.position) / 1000;
              dur = parseInt(model.get('duration'));
              percentage = Math.round((pos / dur) * 100);
              stateObj.setPlaying('time', helpers.global.secToTime(pos));
              stateObj.setPlaying('percentage', percentage);
              return App.execute('player:local:progress:update', percentage, helpers.global.secToTime(pos));
            }
          }));
          return _this.doCallback(callback);
        };
      })(this));
    };

    Base.prototype.localFinished = function() {
      return this.localGoTo('next');
    };

    Base.prototype.localPlay = function() {
      return this.localCommand('play');
    };

    Base.prototype.localStop = function() {
      return this.localCommand('stop');
    };

    Base.prototype.localPause = function() {
      return this.localCommand('pause');
    };

    Base.prototype.localPlayPause = function() {
      var stateObj;
      stateObj = App.request("state:local");
      if (stateObj.getPlaying('paused')) {
        return this.localCommand('play');
      } else {
        return this.localCommand('pause');
      }
    };

    Base.prototype.localSetVolume = function(volume) {
      return this.localCommand('setVolume', volume);
    };

    Base.prototype.localCommand = function(command, param) {
      var currentItem, stateObj;
      stateObj = App.request("state:local");
      currentItem = stateObj.getState('localPlay');
      if (currentItem !== false) {
        currentItem[command](param);
      }
      return this.localStateUpdate();
    };

    Base.prototype.localGoTo = function(param) {
      var collection, currentPos, model, posToPlay, stateObj;
      collection = App.request("localplayer:get:entities");
      stateObj = App.request("state:local");
      currentPos = stateObj.getPlaying('position');
      posToPlay = false;
      if (collection.length > 0) {
        if (stateObj.getState('repeat') === 'one') {
          posToPlay = currentPos;
        } else if (stateObj.getState('shuffled') === true) {
          posToPlay = helpers.global.getRandomInt(0, collection.length - 1);
        } else {
          if (param === 'next') {
            if (currentPos === collection.length - 1 && stateObj.getState('repeat') === 'all') {
              posToPlay = 0;
            } else if (currentPos < collection.length) {
              posToPlay = currentPos + 1;
            }
          }
          if (param === 'previous') {
            if (currentPos === 0 && stateObj.getState('repeat') === 'all') {
              posToPlay = collection.length - 1;
            } else if (currentPos > 0) {
              posToPlay = currentPos - 1;
            }
          }
        }
      }
      if (posToPlay !== false) {
        model = collection.findWhere({
          position: posToPlay
        });
        return this.localLoad(model, (function(_this) {
          return function() {
            _this.localPlay();
            return _this.localStateUpdate();
          };
        })(this));
      }
    };

    Base.prototype.localSeek = function(percent) {
      var localPlay, newPos, sound, stateObj;
      stateObj = App.request("state:local");
      localPlay = stateObj.getState('localPlay');
      if (localPlay !== false) {
        newPos = (percent / 100) * localPlay.duration;
        sound = soundManager.getSoundById(stateObj.getState('currentPlaybackId'));
        return sound.setPosition(newPos);
      }
    };

    Base.prototype.localRepeat = function(param) {
      var i, key, newState, state, stateObj, states;
      stateObj = App.request("state:local");
      if (param !== 'cycle') {
        return stateObj.setState('repeat', param);
      } else {
        newState = false;
        states = ['off', 'all', 'one'];
        for (i in states) {
          state = states[i];
          i = parseInt(i);
          if (newState !== false) {
            continue;
          }
          if (stateObj.getState('repeat') === state) {
            if (i !== (states.length - 1)) {
              key = i + 1;
              newState = states[key];
            } else {
              newState = 'off';
            }
          }
        }
        return stateObj.setState('repeat', newState);
      }
    };

    Base.prototype.localShuffle = function() {
      var currentShuffle, stateObj;
      stateObj = App.request("state:local");
      currentShuffle = stateObj.getState('shuffled');
      return stateObj.setState('shuffled', !currentShuffle);
    };

    Base.prototype.localStateUpdate = function() {
      return App.vent.trigger("state:local:changed");
    };

    Base.prototype.paramObj = function(key, val) {
      return helpers.global.paramObj(key, val);
    };

    Base.prototype.doCallback = function(callback, response) {
      if (typeof callback === 'function') {
        return callback(response);
      }
    };

    Base.prototype.onError = function(commands, error) {
      return helpers.debug.rpcError(commands, error);
    };

    return Base;

  })(Marionette.Object);
});

this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {
  Api.Commander = (function(_super) {
    __extends(Commander, _super);

    function Commander() {
      return Commander.__super__.constructor.apply(this, arguments);
    }

    return Commander;

  })(Api.Base);
  return Api.Player = (function(_super) {
    __extends(Player, _super);

    function Player() {
      return Player.__super__.constructor.apply(this, arguments);
    }

    Player.prototype.playEntity = function(type, position, callback) {
      var collection, model;
      if (type == null) {
        type = 'position';
      }
      collection = App.request("localplayer:get:entities");
      model = collection.findWhere({
        position: position
      });
      return this.localLoad(model, (function(_this) {
        return function() {
          _this.localPlay();
          return _this.doCallback(callback, position);
        };
      })(this));
    };

    Player.prototype.sendCommand = function(command, param) {
      switch (command) {
        case 'GoTo':
          this.localGoTo(param);
          break;
        case 'PlayPause':
          this.localPlayPause();
          break;
        case 'Seek':
          this.localSeek(param);
          break;
        case 'SetRepeat':
          this.localRepeat(param);
          break;
        case 'SetShuffle':
          this.localShuffle();
          break;
        case 'Stop':
          this.localStop();
          break;
      }
      return this.localStateUpdate();
    };

    return Player;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {
  return Api.Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.getProperties = function(callback) {
      var resp, stateObj;
      stateObj = App.request("state:local");
      resp = {
        volume: stateObj.getState('volume'),
        muted: stateObj.getState('muted')
      };
      return this.doCallback(callback, resp);
    };

    Application.prototype.setVolume = function(volume, callback) {
      var stateObj;
      stateObj = App.request("state:local");
      stateObj.setState('volume', volume);
      this.localSetVolume(volume);
      return this.doCallback(callback, volume);
    };

    Application.prototype.toggleMute = function(callback) {
      var stateObj, volume;
      stateObj = App.request("state:local");
      volume = 0;
      if (stateObj.getState('muted')) {
        volume = stateObj.getState('lastVolume');
        stateObj.setState('muted', false);
      } else {
        stateObj.setState('lastVolume', stateObj.getState('volume'));
        stateObj.setState('muted', true);
        volume = 0;
      }
      this.localSetVolume(volume);
      return this.doCallback(callback, volume);
    };

    return Application;

  })(Api.Commander);
});

this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {
  return Api.PlayList = (function(_super) {
    __extends(PlayList, _super);

    function PlayList() {
      return PlayList.__super__.constructor.apply(this, arguments);
    }

    PlayList.prototype.play = function(type, value) {
      return this.getSongs(type, value, (function(_this) {
        return function(songs) {
          return _this.playCollection(songs);
        };
      })(this));
    };

    PlayList.prototype.add = function(type, value) {
      return this.getSongs(type, value, (function(_this) {
        return function(songs) {
          return _this.addCollection(songs);
        };
      })(this));
    };

    PlayList.prototype.playCollection = function(models) {
      if (!_.isArray(models)) {
        models = models.getRawCollection();
      }
      return this.clear((function(_this) {
        return function() {
          return _this.insertAndPlay(models, 0);
        };
      })(this));
    };

    PlayList.prototype.addCollection = function(models) {
      return this.playlistSize((function(_this) {
        return function(size) {
          return _this.insert(models, size);
        };
      })(this));
    };

    PlayList.prototype.remove = function(position, callback) {
      return this.getItems((function(_this) {
        return function(collection) {
          var item, pos, raw, ret;
          raw = collection.getRawCollection();
          ret = [];
          for (pos in raw) {
            item = raw[pos];
            if (parseInt(pos) !== parseInt(position)) {
              ret.push(item);
            }
          }
          return _this.clear(function() {
            collection = _this.addItems(ret);
            return _this.doCallback(callback, collection);
          });
        };
      })(this));
    };

    PlayList.prototype.clear = function(callback) {
      var collection;
      collection = App.execute("localplayer:clear:entities");
      this.refreshPlaylistView();
      return this.doCallback(callback, collection);
    };

    PlayList.prototype.insert = function(models, position, callback) {
      if (position == null) {
        position = 0;
      }
      return this.getItems((function(_this) {
        return function(collection) {
          var item, model, pos, raw, ret, _i, _j, _len, _len1, _ref, _ref1;
          raw = collection.getRawCollection();
          if (raw.length === 0) {
            ret = _.flatten([models]);
          } else if (parseInt(position) >= raw.length) {
            ret = raw;
            _ref = _.flatten([models]);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              ret.push(model);
            }
          } else {
            ret = [];
            for (pos in raw) {
              item = raw[pos];
              if (parseInt(pos) === parseInt(position)) {
                _ref1 = _.flatten([models]);
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  model = _ref1[_j];
                  ret.push(model);
                }
              }
              ret.push(item);
            }
          }
          return _this.clear(function() {
            collection = _this.addItems(ret);
            return _this.doCallback(callback, collection);
          });
        };
      })(this));
    };

    PlayList.prototype.addItems = function(items) {
      App.request("localplayer:item:add:entities", items);
      return this.refreshPlaylistView();
    };

    PlayList.prototype.getSongs = function(type, value, callback) {
      var songs;
      if (type === 'songid') {
        return App.request("song:byid:entities", [value], (function(_this) {
          return function(songs) {
            return _this.doCallback(callback, songs.getRawCollection());
          };
        })(this));
      } else {
        songs = App.request("song:filtered:entities", {
          filter: helpers.global.paramObj(type, value)
        });
        return App.execute("when:entity:fetched", songs, (function(_this) {
          return function() {
            return _this.doCallback(callback, songs.getRawCollection());
          };
        })(this));
      }
    };

    PlayList.prototype.getItems = function(callback) {
      var collection;
      collection = App.request("localplayer:get:entities");
      return this.doCallback(callback, collection);
    };

    PlayList.prototype.insertAndPlay = function(models, position, callback) {
      if (position == null) {
        position = 0;
      }
      return this.insert(models, position, (function(_this) {
        return function(resp) {
          return _this.playEntity('position', parseInt(position), {}, function() {
            return _this.doCallback(callback, position);
          });
        };
      })(this));
    };

    PlayList.prototype.playlistSize = function(callback) {
      return this.getItems((function(_this) {
        return function(resp) {
          return _this.doCallback(callback, resp.length);
        };
      })(this));
    };

    PlayList.prototype.refreshPlaylistView = function() {
      return App.execute("playlist:refresh", 'local', 'audio');
    };

    PlayList.prototype.moveItem = function(media, id, position1, position2, callback) {
      return this.getItems((function(_this) {
        return function(collection) {
          var item, raw;
          raw = collection.getRawCollection();
          item = raw[position1];
          return _this.remove(position1, function() {
            return _this.insert(item, position2, function() {
              return _this.doCallback(callback, position2);
            });
          });
        };
      })(this));
    };

    return PlayList;

  })(Api.Player);
});

this.Kodi.module("EPGApp", function(EPGApp, App, Backbone, Marionette, $, _) {
  var API;
  EPGApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "tvshows/live/:channelid": "tv",
      "music/radio/:channelid": "radio"
    };

    return Router;

  })(App.Router.Base);
  API = {
    tv: function(channelid) {
      return new EPGApp.List.Controller({
        channelid: channelid,
        type: "tv"
      });
    },
    radio: function(channelid) {
      return new EPGApp.List.Controller({
        channelid: channelid,
        type: "radio"
      });
    }
  };
  return App.on("before:start", function() {
    return new EPGApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("EPGApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var collection;
      collection = App.request("broadcast:entities", options.channelid);
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(collection);
          _this.listenTo(_this.layout, "show", function() {
            _this.getSubNav();
            return _this.renderProgrammes(collection);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new List.Layout({
        collection: collection
      });
    };

    Controller.prototype.renderProgrammes = function(collection) {
      var view;
      view = new List.EPGList({
        collection: collection
      });

      /*@listenTo view, 'childview:channel:play', (parent, child) ->
        player = App.request "command:kodi:controller", 'auto', 'Player'
        player.playEntity 'channelid', child.model.get('id'), {},  =>
           *# update state?
       */
      return this.layout.regionContent.show(view);
    };

    Controller.prototype.getSubNav = function() {
      var subNav, subNavId;
      subNavId = this.getOption('type') === 'tv' ? 21 : 1;
      subNav = App.request("navMain:children:show", subNavId, 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("EPGApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.className = "epg-page";

    return Layout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.ProgrammeList = (function(_super) {
    __extends(ProgrammeList, _super);

    function ProgrammeList() {
      return ProgrammeList.__super__.constructor.apply(this, arguments);
    }

    ProgrammeList.prototype.template = 'apps/epg/list/programmes';

    ProgrammeList.prototype.tagName = "li";

    ProgrammeList.prototype.className = "programme";

    ProgrammeList.prototype.onRender = function() {
      if (this.model.attributes.wasactive) {
        return this.$el.addClass("aired");
      }
    };

    return ProgrammeList;

  })(App.Views.ItemView);
  return List.EPGList = (function(_super) {
    __extends(EPGList, _super);

    function EPGList() {
      return EPGList.__super__.constructor.apply(this, arguments);
    }

    EPGList.prototype.childView = List.ProgrammeList;

    EPGList.prototype.tagName = "ul";

    EPGList.prototype.className = "programmes";

    EPGList.prototype.onShow = function() {
      return $(window).scrollTop(this.$el.find('.airing').offset().top - 150);
    };

    return EPGList;

  })(App.Views.CollectionView);
});

this.Kodi.module("ExternalApp", function(ExternalApp, App, Backbone, Marionette, $, _) {});

this.Kodi.module("ExternalApp.Youtube", function(Youtube, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getSearchView: function(query, callback) {
      return App.execute("youtube:search:entities", query, function(collection) {
        var view;
        view = new Youtube.List({
          collection: collection
        });
        App.listenTo(view, 'childview:youtube:kodiplay', function(parent, item) {
          var playlist;
          playlist = App.request("command:kodi:controller", 'video', 'PlayList');
          return playlist.play('file', 'plugin://plugin.video.youtube/play/?video_id=' + item.model.get('id'));
        });
        App.listenTo(view, 'childview:youtube:localplay', function(parent, item) {
          var localPlayer;
          localPlayer = "videoPlayer.html?yt=" + item.model.get('id');
          return helpers.global.localVideoPopup(localPlayer, 500);
        });
        return callback(view);
      });
    }
  };
  return App.commands.setHandler("youtube:search:view", function(query, callback) {
    return API.getSearchView(query, callback);
  });
});

this.Kodi.module("ExternalApp.Youtube", function(Youtube, App, Backbone, Marionette, $, _) {
  Youtube.Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.template = 'apps/external/youtube/youtube';

    Item.prototype.tagName = 'li';

    Item.prototype.triggers = {
      'click .play-kodi': 'youtube:kodiplay',
      'click .play-local': 'youtube:localplay'
    };

    Item.prototype.events = {
      'click .action': 'closeModal'
    };

    Item.prototype.closeModal = function() {
      return App.execute("ui:modal:close");
    };

    return Item;

  })(App.Views.ItemView);
  return Youtube.List = (function(_super) {
    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.childView = Youtube.Item;

    List.prototype.tagName = 'ul';

    List.prototype.className = 'youtube-list';

    return List;

  })(App.Views.CollectionView);
});

this.Kodi.module("FilterApp", function(FilterApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {

    /*
      Settings/fields
     */
    sortFields: [
      {
        alias: 'Title',
        type: 'string',
        defaultSort: true,
        defaultOrder: 'asc',
        key: 'title'
      }, {
        alias: 'Title',
        type: 'string',
        defaultSort: true,
        defaultOrder: 'asc',
        key: 'label'
      }, {
        alias: 'Year',
        type: 'number',
        key: 'year',
        defaultOrder: 'desc'
      }, {
        alias: 'Date Added',
        type: 'string',
        key: 'dateadded',
        defaultOrder: 'desc'
      }, {
        alias: 'Rating',
        type: 'float',
        key: 'rating',
        defaultOrder: 'desc'
      }
    ],
    filterFields: [
      {
        alias: 'Year',
        type: 'number',
        key: 'year',
        sortOrder: 'desc',
        filterCallback: 'multiple'
      }, {
        alias: 'Genre',
        type: 'array',
        key: 'genre',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }, {
        alias: 'Mood',
        type: 'array',
        key: 'mood',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }, {
        alias: 'Style',
        type: 'array',
        key: 'style',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }, {
        alias: 'Unwatched',
        type: "boolean",
        key: 'unwatched',
        sortOrder: 'asc',
        filterCallback: 'unwatched'
      }, {
        alias: 'Writer',
        type: 'array',
        key: 'writer',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }, {
        alias: 'Director',
        type: 'array',
        key: 'director',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }, {
        alias: 'Actor',
        type: 'object',
        property: 'name',
        key: 'cast',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }, {
        alias: 'Set',
        type: 'string',
        property: 'set',
        key: 'set',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
    ],
    getFilterFields: function(type) {
      var available, availableFilters, field, fields, key, ret, _i, _len;
      key = type + 'Fields';
      fields = API[key];
      availableFilters = API.getAvailable();
      available = availableFilters[type];
      ret = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        if (helpers.global.inArray(field.key, available)) {
          ret.push(field);
        }
      }
      return ret;
    },

    /*
      Storage
     */
    storeFiltersNamespace: 'filter:store:',
    getStoreNameSpace: function(type) {
      return API.storeFiltersNamespace + type;
    },
    setStoreFilters: function(filters, type) {
      var store;
      if (filters == null) {
        filters = {};
      }
      if (type == null) {
        type = 'filters';
      }
      store = {};
      store[helpers.url.path()] = filters;
      helpers.cache.set(API.getStoreNameSpace(type), store);
      return App.vent.trigger('filter:changed', filters);
    },
    getStoreFilters: function(type) {
      var filters, key, path, ret, store, val;
      if (type == null) {
        type = 'filters';
      }
      store = helpers.cache.get(API.getStoreNameSpace(type), {});
      path = helpers.url.path();
      filters = store[path] ? store[path] : {};
      ret = {};
      if (!_.isEmpty(filters)) {
        for (key in filters) {
          val = filters[key];
          if (val.length > 0) {
            ret[key] = val;
          }
        }
      }
      return ret;
    },
    updateStoreFiltersKey: function(key, values) {
      var filters;
      if (values == null) {
        values = [];
      }
      filters = API.getStoreFilters();
      filters[key] = values;
      API.setStoreFilters(filters);
      return filters;
    },
    getStoreFiltersKey: function(key) {
      var filter, filters;
      filters = API.getStoreFilters();
      filter = filters[key] ? filters[key] : [];
      return filter;
    },
    setStoreSort: function(method, order) {
      var sort;
      if (order == null) {
        order = 'asc';
      }
      sort = {
        method: method,
        order: order
      };
      return API.setStoreFilters(sort, 'sort');
    },
    getStoreSort: function() {
      var defaults, sort;
      sort = API.getStoreFilters('sort');
      if (!sort.method) {
        defaults = _.findWhere(API.getFilterFields('sort'), {
          defaultSort: true
        });
        sort = {
          method: defaults.key,
          order: defaults.defaultOrder
        };
      }
      return sort;
    },
    setAvailable: function(available) {
      return API.setStoreFilters(available, 'available');
    },
    getAvailable: function() {
      return API.getStoreFilters('available');
    },

    /*
      Parsing
     */
    toggleOrder: function(order) {
      order = order === 'asc' ? 'desc' : 'asc';
      return order;
    },
    parseSortable: function(items) {
      var i, item, params;
      params = API.getStoreSort(false, 'asc');
      for (i in items) {
        item = items[i];
        items[i].active = false;
        items[i].order = item.defaultOrder;
        if (params.method && item.key === params.method) {
          items[i].active = true;
          items[i].order = this.toggleOrder(params.order);
        } else if (item.defaultSort && params.method === false) {
          items[i].active = true;
        }
      }
      return items;
    },
    parseFilterable: function(items) {
      var active, activeItem, i, val;
      active = API.getFilterActive();
      for (i in items) {
        val = items[i];
        activeItem = _.findWhere(active, {
          key: val.key
        });
        items[i].active = activeItem !== void 0;
      }
      return items;
    },
    getFilterOptions: function(key, collection) {
      var collectionItems, data, i, item, items, limited, s, values, _i, _len;
      values = App.request('filter:store:key:get', key);
      s = API.getFilterSettings(key);
      items = [];
      collectionItems = collection.pluck(key);
      if (s.filterCallback === 'multiple' && s.type === 'object') {
        limited = [];
        for (_i = 0, _len = collectionItems.length; _i < _len; _i++) {
          item = collectionItems[_i];
          for (i in item) {
            data = item[i];
            if (i < 5) {
              limited.push(data[s.property]);
            }
          }
        }
        collectionItems = limited;
      }
      _.map(_.uniq(_.flatten(collectionItems)), function(val) {
        return items.push({
          key: key,
          value: val,
          active: helpers.global.inArray(val, values)
        });
      });
      return items;
    },

    /*
      Apply filters
     */
    applyFilters: function(collection) {
      var filteredCollection, key, sort, values, _ref;
      sort = API.getStoreSort();
      collection.sortCollection(sort.method, sort.order);
      filteredCollection = new App.Entities.Filtered(collection);
      _ref = API.getStoreFilters();
      for (key in _ref) {
        values = _ref[key];
        if (values.length > 0) {
          filteredCollection = API.applyFilter(filteredCollection, key, values);
        }
      }
      return filteredCollection;
    },
    applyFilter: function(collection, key, vals) {
      var s;
      s = API.getFilterSettings(key);
      switch (s.filterCallback) {
        case 'multiple':
          if (s.type === 'array') {
            collection.filterByMultipleArray(key, vals);
          } else if (s.type === 'object') {
            collection.filterByMultipleObject(key, s.property, vals);
          } else {
            collection.filterByMultiple(key, vals);
          }
          break;
        case 'unwatched':
          collection.filterByUnwatched();
          break;
        default:
          collection;
      }
      return collection;
    },
    getFilterSettings: function(key) {
      return _.findWhere(API.getFilterFields('filter'), {
        key: key
      });
    },
    getFilterActive: function() {
      var items, key, values, _ref;
      items = [];
      _ref = API.getStoreFilters();
      for (key in _ref) {
        values = _ref[key];
        if (values.length > 0) {
          items.push({
            key: key,
            values: values
          });
        }
      }
      return items;
    }
  };

  /*
    Handlers.
   */
  App.reqres.setHandler('filter:show', function(collection) {
    var filters, view;
    API.setAvailable(collection.availableFilters);
    filters = new FilterApp.Show.Controller({
      refCollection: collection
    });
    view = filters.getFilterView();
    return view;
  });
  App.reqres.setHandler('filter:options', function(key, collection) {
    var filterSettings, options, optionsCollection;
    options = API.getFilterOptions(key, collection);
    optionsCollection = App.request('filter:filters:options:entities', options);
    filterSettings = API.getFilterSettings(key);
    optionsCollection.sortCollection('value', filterSettings.sortOrder);
    return optionsCollection;
  });
  App.reqres.setHandler('filter:active', function() {
    return App.request('filter:active:entities', API.getFilterActive());
  });
  App.reqres.setHandler('filter:apply:entites', function(collection) {
    API.setAvailable(collection.availableFilters);
    return API.applyFilters(collection);
  });
  App.reqres.setHandler('filter:sortable:entities', function() {
    return App.request('filter:sort:entities', API.parseSortable(API.getFilterFields('sort')));
  });
  App.reqres.setHandler('filter:filterable:entities', function() {
    return App.request('filter:filters:entities', API.parseFilterable(API.getFilterFields('filter')));
  });
  App.reqres.setHandler('filter:init', function(availableFilters) {
    var key, params, values, _i, _len, _ref, _results;
    params = helpers.url.params();
    if (!_.isEmpty(params)) {
      API.setStoreFilters({});
      _ref = availableFilters.filter;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (params[key]) {
          values = API.getStoreFiltersKey(key);
          if (!helpers.global.inArray(params[key], values)) {
            values.push(decodeURIComponent(params[key]));
            _results.push(API.updateStoreFiltersKey(key, values));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });
  App.reqres.setHandler('filter:store:set', function(filters) {
    API.setStoreFilters(filters);
    return filters;
  });
  App.reqres.setHandler('filter:store:get', function() {
    return API.getStoreFilters();
  });
  App.reqres.setHandler('filter:store:key:get', function(key) {
    return API.getStoreFiltersKey(key);
  });
  App.reqres.setHandler('filter:store:key:update', function(key, values) {
    if (values == null) {
      values = [];
    }
    return API.updateStoreFiltersKey(key, values);
  });
  App.reqres.setHandler('filter:store:key:toggle', function(key, value) {
    var i, newValues, ret, values, _i, _len;
    values = API.getStoreFiltersKey(key);
    ret = [];
    if (_.indexOf(values, value) > -1) {
      newValues = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        i = values[_i];
        if (i !== value) {
          newValues.push(i);
        }
      }
      ret = newValues;
    } else {
      values.push(value);
      ret = values;
    }
    API.updateStoreFiltersKey(key, ret);
    return ret;
  });
  App.reqres.setHandler('filter:sort:store:set', function(method, order) {
    if (order == null) {
      order = 'asc';
    }
    return API.setStoreSort(method, order);
  });
  return App.reqres.setHandler('filter:sort:store:get', function() {
    return API.getStoreSort();
  });
});

this.Kodi.module("FilterApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  return Show.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.getFilterView = function() {
      var collection;
      collection = this.getOption('refCollection');
      this.layoutFilters = this.getLayoutView(collection);
      this.listenTo(this.layoutFilters, "show", (function(_this) {
        return function() {
          _this.getSort();
          _this.getFilters();
          _this.getActive();
          return _this.getSections();
        };
      })(this));
      this.listenTo(this.layoutFilters, 'filter:layout:close:filters', (function(_this) {
        return function() {
          return _this.stateChange('normal');
        };
      })(this));
      this.listenTo(this.layoutFilters, 'filter:layout:close:options', (function(_this) {
        return function() {
          return _this.stateChange('filters');
        };
      })(this));
      this.listenTo(this.layoutFilters, 'filter:layout:open:filters', (function(_this) {
        return function() {
          return _this.stateChange('filters');
        };
      })(this));
      this.listenTo(this.layoutFilters, 'filter:layout:open:options', (function(_this) {
        return function() {
          return _this.stateChange('options');
        };
      })(this));
      return this.layoutFilters;
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new Show.FilterLayout({
        collection: collection
      });
    };

    Controller.prototype.getSort = function() {
      var sortCollection, sortView;
      sortCollection = App.request('filter:sortable:entities');
      sortView = new Show.SortList({
        collection: sortCollection
      });
      this.layoutFilters.regionSort.show(sortView);
      return App.listenTo(sortView, "childview:filter:sortable:select", (function(_this) {
        return function(parentview, childview) {
          App.request('filter:sort:store:set', childview.model.get('key'), childview.model.get('order'));
          _this.layoutFilters.trigger('filter:changed');
          return _this.getSort();
        };
      })(this));
    };

    Controller.prototype.getFilters = function(clearOptions) {
      var filterCollection, filtersView;
      if (clearOptions == null) {
        clearOptions = true;
      }
      filterCollection = App.request('filter:filterable:entities');
      filtersView = new Show.FilterList({
        collection: filterCollection
      });
      App.listenTo(filtersView, "childview:filter:filterable:select", (function(_this) {
        return function(parentview, childview) {
          var key;
          key = childview.model.get('key');
          if (childview.model.get('type') === 'boolean') {
            App.request('filter:store:key:toggle', key, childview.model.get('alias'));
            return _this.triggerChange();
          } else {
            _this.getFilterOptions(key);
            return _this.stateChange('options');
          }
        };
      })(this));
      this.layoutFilters.regionFiltersList.show(filtersView);
      if (clearOptions) {
        return this.layoutFilters.regionFiltersOptions.empty();
      }
    };

    Controller.prototype.getActive = function() {
      var activeCollection, optionsView;
      activeCollection = App.request('filter:active');
      optionsView = new Show.ActiveList({
        collection: activeCollection
      });
      this.layoutFilters.regionFiltersActive.show(optionsView);
      App.listenTo(optionsView, "childview:filter:option:remove", (function(_this) {
        return function(parentview, childview) {
          var key;
          key = childview.model.get('key');
          App.request('filter:store:key:update', key, []);
          return _this.triggerChange();
        };
      })(this));
      App.listenTo(optionsView, "childview:filter:add", (function(_this) {
        return function(parentview, childview) {
          return _this.stateChange('filters');
        };
      })(this));
      return this.getFilterBar();
    };

    Controller.prototype.getFilterOptions = function(key) {
      var optionsCollection, optionsView;
      optionsCollection = App.request('filter:options', key, this.getOption('refCollection'));
      optionsView = new Show.OptionList({
        collection: optionsCollection
      });
      this.layoutFilters.regionFiltersOptions.show(optionsView);
      App.listenTo(optionsView, "childview:filter:option:select", (function(_this) {
        return function(parentview, childview) {
          var value;
          value = childview.model.get('value');
          childview.view.$el.find('.option').toggleClass('active');
          App.request('filter:store:key:toggle', key, value);
          return _this.triggerChange(false);
        };
      })(this));
      return App.listenTo(optionsView, 'filter:option:deselectall', (function(_this) {
        return function(parentview) {
          parentview.view.$el.find('.option').removeClass('active');
          App.request('filter:store:key:update', key, []);
          return _this.triggerChange(false);
        };
      })(this));
    };

    Controller.prototype.triggerChange = function(clearOptions) {
      if (clearOptions == null) {
        clearOptions = true;
      }
      this.getFilters(clearOptions);
      this.getActive();
      App.navigate(helpers.url.path());
      return this.layoutFilters.trigger('filter:changed');
    };

    Controller.prototype.getFilterBar = function() {
      var $list, $wrapper, bar, currentFilters, list;
      currentFilters = App.request('filter:store:get');
      list = _.flatten(_.values(currentFilters));
      $wrapper = $('.layout-container');
      $list = $('.region-content-top', $wrapper);
      if (list.length > 0) {
        bar = new Show.FilterBar({
          filters: list
        });
        $list.html(bar.render().$el);
        $wrapper.addClass('filters-active');
        return App.listenTo(bar, 'filter:remove:all', (function(_this) {
          return function() {
            App.request('filter:store:set', {});
            _this.triggerChange();
            return _this.stateChange('normal');
          };
        })(this));
      } else {
        return $wrapper.removeClass('filters-active');
      }
    };

    Controller.prototype.stateChange = function(state) {
      var $wrapper;
      if (state == null) {
        state = 'normal';
      }
      $wrapper = this.layoutFilters.$el.find('.filters-container');
      switch (state) {
        case 'filters':
          return $wrapper.removeClass('show-options').addClass('show-filters');
        case 'options':
          return $wrapper.addClass('show-options').removeClass('show-filters');
        default:
          return $wrapper.removeClass('show-options').removeClass('show-filters');
      }
    };

    Controller.prototype.getSections = function() {
      var collection, nav;
      collection = this.getOption('refCollection');
      if (collection.sectionId) {
        nav = App.request("navMain:children:show", collection.sectionId, 'Sections');
        return this.layoutFilters.regionNavSection.show(nav);
      }
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("FilterApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  /*
    Base.
   */
  Show.FilterLayout = (function(_super) {
    __extends(FilterLayout, _super);

    function FilterLayout() {
      return FilterLayout.__super__.constructor.apply(this, arguments);
    }

    FilterLayout.prototype.template = 'apps/filter/show/filters_ui';

    FilterLayout.prototype.className = "side-bar";

    FilterLayout.prototype.regions = {
      regionSort: '.sort-options',
      regionFiltersActive: '.filters-active',
      regionFiltersList: '.filters-list',
      regionFiltersOptions: '.filter-options-list',
      regionNavSection: '.nav-section'
    };

    FilterLayout.prototype.triggers = {
      'click .close-filters': 'filter:layout:close:filters',
      'click .close-options': 'filter:layout:close:options',
      'click .open-filters': 'filter:layout:open:filters'
    };

    return FilterLayout;

  })(App.Views.LayoutView);
  Show.ListItem = (function(_super) {
    __extends(ListItem, _super);

    function ListItem() {
      return ListItem.__super__.constructor.apply(this, arguments);
    }

    ListItem.prototype.template = 'apps/filter/show/list_item';

    ListItem.prototype.tagName = 'li';

    return ListItem;

  })(App.Views.ItemView);
  Show.List = (function(_super) {
    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.childView = Show.ListItem;

    List.prototype.tagName = "ul";

    List.prototype.className = "selection-list";

    return List;

  })(App.Views.CollectionView);

  /*
    Extends.
   */
  Show.SortListItem = (function(_super) {
    __extends(SortListItem, _super);

    function SortListItem() {
      return SortListItem.__super__.constructor.apply(this, arguments);
    }

    SortListItem.prototype.triggers = {
      "click .sortable": "filter:sortable:select"
    };

    SortListItem.prototype.initialize = function() {
      var classes, tag;
      classes = ['option', 'sortable'];
      if (this.model.get('active') === true) {
        classes.push('active');
      }
      classes.push('order-' + this.model.get('order'));
      tag = this.themeTag('span', {
        'class': classes.join(' ')
      }, this.model.get('alias'));
      return this.model.set({
        title: tag
      });
    };

    return SortListItem;

  })(Show.ListItem);
  Show.SortList = (function(_super) {
    __extends(SortList, _super);

    function SortList() {
      return SortList.__super__.constructor.apply(this, arguments);
    }

    SortList.prototype.childView = Show.SortListItem;

    return SortList;

  })(Show.List);
  Show.FilterListItem = (function(_super) {
    __extends(FilterListItem, _super);

    function FilterListItem() {
      return FilterListItem.__super__.constructor.apply(this, arguments);
    }

    FilterListItem.prototype.triggers = {
      "click .filterable": "filter:filterable:select"
    };

    FilterListItem.prototype.initialize = function() {
      var classes, tag;
      classes = ['option', 'option filterable'];
      if (this.model.get('active')) {
        classes.push('active');
      }
      tag = this.themeTag('span', {
        'class': classes.join(' ')
      }, this.model.get('alias'));
      return this.model.set({
        title: tag
      });
    };

    return FilterListItem;

  })(Show.ListItem);
  Show.FilterList = (function(_super) {
    __extends(FilterList, _super);

    function FilterList() {
      return FilterList.__super__.constructor.apply(this, arguments);
    }

    FilterList.prototype.childView = Show.FilterListItem;

    return FilterList;

  })(Show.List);
  Show.OptionListItem = (function(_super) {
    __extends(OptionListItem, _super);

    function OptionListItem() {
      return OptionListItem.__super__.constructor.apply(this, arguments);
    }

    OptionListItem.prototype.triggers = {
      "click .filterable-option": "filter:option:select"
    };

    OptionListItem.prototype.initialize = function() {
      var classes, tag;
      classes = ['option', 'option filterable-option'];
      if (this.model.get('active')) {
        classes.push('active');
      }
      tag = this.themeTag('span', {
        'class': classes.join(' ')
      }, this.model.get('value'));
      return this.model.set({
        title: tag
      });
    };

    return OptionListItem;

  })(Show.ListItem);
  Show.OptionList = (function(_super) {
    __extends(OptionList, _super);

    function OptionList() {
      return OptionList.__super__.constructor.apply(this, arguments);
    }

    OptionList.prototype.template = 'apps/filter/show/filter_options';

    OptionList.prototype.activeValues = [];

    OptionList.prototype.childView = Show.OptionListItem;

    OptionList.prototype.childViewContainer = 'ul.selection-list';

    OptionList.prototype.onRender = function() {
      if (this.collection.length <= 10) {
        $('.options-search-wrapper', this.$el).addClass('hidden');
      }
      return $('.options-search', this.$el).on('keyup', function() {
        var $list, val;
        val = $('.options-search', this.$el).val().toLocaleLowerCase();
        $list = $('.filter-options-list li', this.$el).removeClass('hidden');
        if (val.length > 0) {
          return $list.each(function(i, d) {
            var text;
            text = $(d).find('.option').text().toLowerCase();
            if (text.indexOf(val) === -1) {
              return $(d).addClass('hidden');
            }
          });
        }
      });
    };

    OptionList.prototype.triggers = {
      'click .deselect-all': 'filter:option:deselectall'
    };

    return OptionList;

  })(App.Views.CompositeView);
  Show.ActiveListItem = (function(_super) {
    __extends(ActiveListItem, _super);

    function ActiveListItem() {
      return ActiveListItem.__super__.constructor.apply(this, arguments);
    }

    ActiveListItem.prototype.triggers = {
      "click .filterable-remove": "filter:option:remove"
    };

    ActiveListItem.prototype.initialize = function() {
      var tag, text, tooltip;
      tooltip = t.gettext('Remove') + ' ' + t.gettext(this.model.get('key')) + ' ' + t.gettext('filter');
      text = this.themeTag('span', {
        'class': 'text'
      }, this.model.get('values').join(', '));
      tag = this.themeTag('span', {
        'class': 'filter-btn filterable-remove',
        title: tooltip
      }, text);
      return this.model.set({
        title: tag
      });
    };

    return ActiveListItem;

  })(Show.ListItem);
  Show.ActiveNewListItem = (function(_super) {
    __extends(ActiveNewListItem, _super);

    function ActiveNewListItem() {
      return ActiveNewListItem.__super__.constructor.apply(this, arguments);
    }

    ActiveNewListItem.prototype.triggers = {
      "click .filterable-add": "filter:add"
    };

    ActiveNewListItem.prototype.initialize = function() {
      var tag;
      tag = this.themeTag('span', {
        'class': 'filter-btn filterable-add'
      }, t.gettext('Add Filter'));
      return this.model.set({
        title: tag
      });
    };

    return ActiveNewListItem;

  })(Show.ListItem);
  Show.ActiveList = (function(_super) {
    __extends(ActiveList, _super);

    function ActiveList() {
      return ActiveList.__super__.constructor.apply(this, arguments);
    }

    ActiveList.prototype.childView = Show.ActiveListItem;

    ActiveList.prototype.emptyView = Show.ActiveNewListItem;

    ActiveList.prototype.className = "active-list";

    return ActiveList;

  })(Show.List);
  return Show.FilterBar = (function(_super) {
    __extends(FilterBar, _super);

    function FilterBar() {
      return FilterBar.__super__.constructor.apply(this, arguments);
    }

    FilterBar.prototype.template = 'apps/filter/show/filters_bar';

    FilterBar.prototype.className = "filters-active-bar";

    FilterBar.prototype.onRender = function() {
      if (this.options.filters) {
        return $('.filters-active-all', this.$el).html(this.options.filters.join(', '));
      }
    };

    FilterBar.prototype.triggers = {
      'click .remove': 'filter:remove:all'
    };

    return FilterBar;

  })(App.Views.ItemView);
});

this.Kodi.module("Images", function(Images, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    imagesPath: 'images/',
    defaultFanartPath: 'fanart_default/',
    defaultFanartFiles: ['buds.jpg', 'cans.jpg', 'guitar.jpg', 'speaker.jpg', 'turntable.jpg'],
    getDefaultThumbnail: function() {
      return API.imagesPath + 'thumbnail_default.png';
    },
    getRandomFanart: function() {
      var file, path, rand;
      rand = helpers.global.getRandomInt(0, API.defaultFanartFiles.length - 1);
      file = API.defaultFanartFiles[rand];
      path = API.imagesPath + API.defaultFanartPath + file;
      return path;
    },
    parseRawPath: function(rawPath) {
      var path;
      path = config.get('static', 'reverseProxy') ? 'image/' + encodeURIComponent(rawPath) : '/image/' + encodeURIComponent(rawPath);
      return path;
    },
    setFanartBackground: function(path, region) {
      var $body;
      $body = App.getRegion(region).$el;
      if (path !== 'none') {
        if (!path) {
          path = this.getRandomFanart();
        }
        return $body.css('background-image', 'url(' + path + ')');
      } else {
        return $body.removeAttr('style');
      }
    },
    getImageUrl: function(rawPath, type) {
      var path;
      if (type == null) {
        type = 'thumbnail';
      }
      path = '';
      if ((rawPath == null) || rawPath === '') {
        switch (type) {
          case 'fanart':
            path = API.getRandomFanart();
            break;
          default:
            path = API.getDefaultThumbnail();
        }
      } else {
        path = API.parseRawPath(rawPath);
      }
      return path;
    }
  };
  App.commands.setHandler("images:fanart:set", function(path, region) {
    if (region == null) {
      region = 'regionFanart';
    }
    return API.setFanartBackground(path, region);
  });
  App.reqres.setHandler("images:path:get", function(rawPath, type) {
    if (rawPath == null) {
      rawPath = '';
    }
    if (type == null) {
      type = 'thumbnail';
    }
    return API.getImageUrl(rawPath, type);
  });
  return App.reqres.setHandler("images:path:entity", function(model) {
    var i, person, _ref;
    if (model.thumbnail != null) {
      model.thumbnail = API.getImageUrl(model.thumbnail, 'thumbnail');
    }
    if (model.fanart != null) {
      model.fanart = API.getImageUrl(model.fanart, 'fanart');
    }
    if ((model.cast != null) && model.cast.length > 0) {
      _ref = model.cast;
      for (i in _ref) {
        person = _ref[i];
        model.cast[i].thumbnail = API.getImageUrl(person.thumbnail, 'thumbnail');
      }
    }
    return model;
  });
});

this.Kodi.module("InputApp", function(InputApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    initKeyBind: function() {
      return $(document).keydown((function(_this) {
        return function(e) {
          return _this.keyBind(e);
        };
      })(this));
    },
    inputController: function() {
      return App.request("command:kodi:controller", 'auto', 'Input');
    },
    doInput: function(action) {
      return this.inputController().sendInput(action);
    },
    doCommand: function(command, params, callback) {
      return App.request('command:kodi:player', command, params, (function(_this) {
        return function() {
          return _this.pollingUpdate(callback);
        };
      })(this));
    },
    appController: function() {
      return App.request("command:kodi:controller", 'auto', 'Application');
    },
    pollingUpdate: function(callback) {
      if (!App.request('sockets:active')) {
        return App.request('state:kodi:update', callback);
      }
    },
    toggleRemote: function(open) {
      var $body, rClass;
      if (open == null) {
        open = 'auto';
      }
      $body = $('body');
      rClass = 'remote-open';
      if (open === 'auto') {
        open = $body.hasClass(rClass) ? true : false;
      }
      if (open) {
        App.navigate(helpers.backscroll.lastPath);
        helpers.backscroll.scrollToLast();
        return $body.removeClass(rClass);
      } else {
        helpers.backscroll.setLast();
        App.navigate('remote');
        return $body.addClass(rClass);
      }
    },
    keyBind: function(e) {
      var stateObj, vol;
      if ($(e.target).is("input, textarea")) {
        return;
      }
      stateObj = App.request("state:kodi");
      switch (e.which) {
        case 37:
          return this.doInput("Left");
        case 38:
          return this.doInput("Up");
        case 39:
          return this.doInput("Right");
        case 40:
          return this.doInput("Down");
        case 8:
          return this.doInput("Back");
        case 13:
          return this.doInput("Select");
        case 67:
          return this.doInput("ContextMenu");
        case 107:
          vol = stateObj.getState('volume') + 5;
          return this.appController().setVolume((vol > 100 ? 100 : Math.ceil(vol)));
        case 109:
          vol = stateObj.getState('volume') - 5;
          return this.appController().setVolume((vol < 0 ? 0 : Math.ceil(vol)));
        case 32:
          return this.doCommand("PlayPause", "toggle");
        case 88:
          return this.doCommand("Stop");
        case 190:
          return this.doCommand("GoTo", "next");
        case 188:
          return this.doCommand("GoTo", "previous");
      }
    }
  };
  App.commands.setHandler("input:textbox", function(msg) {
    App.execute("ui:textinput:show", "Input required", msg, function(text) {
      API.inputController().sendText(text);
      return App.execute("notification:show", t.gettext('Sent text') + ' "' + text + '" ' + t.gettext('to Kodi'));
    });
    return App.commands.setHandler("input:textbox:close", function() {
      return App.execute("ui:modal:close");
    });
  });
  App.commands.setHandler("input:send", function(action) {
    return API.doInput(action);
  });
  App.commands.setHandler("input:remote:toggle", function() {
    return API.toggleRemote();
  });
  return App.addInitializer(function() {
    var controller;
    controller = new InputApp.Remote.Controller();
    return API.initKeyBind();
  });
});

this.Kodi.module("InputApp.Remote", function(Remote, App, Backbone, Marionette, $, _) {
  return Remote.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      return App.vent.on("shell:ready", (function(_this) {
        return function(options) {
          return _this.getRemote();
        };
      })(this));
    };

    Controller.prototype.getRemote = function() {
      var view;
      view = new Remote.Control();
      this.listenTo(view, "remote:input", function(type) {
        return App.execute("input:send", type);
      });
      this.listenTo(view, "remote:player", function(type) {
        return App.request('command:kodi:player', type, []);
      });
      this.listenTo(view, "remote:power", function() {
        var appController;
        appController = App.request("command:kodi:controller", 'auto', 'Application');
        return appController.quit();
      });
      App.regionRemote.show(view);
      return App.vent.on("state:changed", function(state) {
        var playingItem, stateObj;
        stateObj = App.request("state:current");
        if (stateObj.isPlayingItemChanged()) {
          playingItem = stateObj.getPlaying('item');
          return App.execute("images:fanart:set", playingItem.fanart, 'regionRemote');
        }
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("InputApp.Remote", function(Remote, App, Backbone, Marionette, $, _) {
  return Remote.Control = (function(_super) {
    __extends(Control, _super);

    function Control() {
      return Control.__super__.constructor.apply(this, arguments);
    }

    Control.prototype.template = 'apps/input/remote/remote_control';

    Control.prototype.events = {
      'click .input-button': 'inputClick',
      'click .player-button': 'playerClick'
    };

    Control.prototype.triggers = {
      'click .power-button': 'remote:power'
    };

    Control.prototype.inputClick = function(e) {
      var type;
      type = $(e.target).data('type');
      return this.trigger('remote:input', type);
    };

    Control.prototype.playerClick = function(e) {
      var type;
      type = $(e.target).data('type');
      return this.trigger('remote:player', type);
    };

    return Control;

  })(App.Views.ItemView);
});

this.Kodi.module("LoadingApp", function(LoadingApp, App, Backbone, Marionette, $, _) {
  App.commands.setHandler("loading:show:page", function() {
    var page;
    page = new LoadingApp.Show.Page();
    return App.regionContent.show(page);
  });
  return App.commands.setHandler("loading:show:view", function(region) {
    var view;
    view = new LoadingApp.Show.Page();
    return region.show(view);
  });
});

this.Kodi.module("LoadingApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  return Show.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.template = "apps/loading/show/loading_page";

    return Page;

  })(Backbone.Marionette.ItemView);
});

this.Kodi.module("localPlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var id, playlists;
      id = options.id;
      playlists = App.request("localplaylist:entities");
      this.layout = this.getLayoutView(playlists);
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getListsView(playlists);
          return _this.getItems(id);
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new List.ListLayout({
        collection: collection
      });
    };

    Controller.prototype.getListsView = function(playlists) {
      var view;
      this.sideLayout = new List.SideLayout();
      view = new List.Lists({
        collection: playlists
      });
      App.listenTo(this.sideLayout, "show", (function(_this) {
        return function() {
          if (playlists.length > 0) {
            return _this.sideLayout.regionLists.show(view);
          }
        };
      })(this));
      App.listenTo(this.sideLayout, 'lists:new', function() {
        return App.execute("localplaylist:newlist");
      });
      return this.layout.regionSidebarFirst.show(this.sideLayout);
    };

    Controller.prototype.getItems = function(id) {
      var collection, playlist;
      playlist = App.request("localplaylist:entity", id);
      collection = App.request("localplaylist:item:entities", id);
      this.itemLayout = new List.Layout({
        list: playlist
      });
      App.listenTo(this.itemLayout, "show", (function(_this) {
        return function() {
          var media, view;
          media = playlist.get('media');
          if (collection.length > 0) {
            view = App.request("" + media + ":list:view", collection, true);
            return _this.itemLayout.regionListItems.show(view);
          }
        };
      })(this));
      this.bindLayout(id);
      return this.layout.regionContent.show(this.itemLayout);
    };

    Controller.prototype.bindLayout = function(id) {
      var collection;
      collection = App.request("localplaylist:item:entities", id);
      App.listenTo(this.itemLayout, 'list:clear', function() {
        App.execute("localplaylist:clear:entities", id);
        return App.execute("localplaylist:reload", id);
      });
      App.listenTo(this.itemLayout, 'list:delete', function() {
        App.execute("localplaylist:clear:entities", id);
        App.execute("localplaylist:remove:entity", id);
        return App.navigate("playlists", {
          trigger: true
        });
      });
      App.listenTo(this.itemLayout, 'list:play', function() {
        var kodiPlaylist;
        kodiPlaylist = App.request("command:kodi:controller", 'audio', 'PlayList');
        return kodiPlaylist.playCollection(collection);
      });
      return App.listenTo(this.itemLayout, 'list:localplay', function() {
        var localPlaylist;
        localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
        return localPlaylist.playCollection(collection);
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("localPlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "local-playlist-list";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.SideLayout = (function(_super) {
    __extends(SideLayout, _super);

    function SideLayout() {
      return SideLayout.__super__.constructor.apply(this, arguments);
    }

    SideLayout.prototype.template = 'apps/localPlaylist/list/playlist_sidebar_layout';

    SideLayout.prototype.tagName = 'div';

    SideLayout.prototype.className = 'side-inner';

    SideLayout.prototype.regions = {
      regionLists: '.current-lists'
    };

    SideLayout.prototype.triggers = {
      'click .new-list': 'lists:new'
    };

    return SideLayout;

  })(App.Views.LayoutView);
  List.List = (function(_super) {
    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.template = 'apps/localPlaylist/list/playlist';

    List.prototype.tagName = "li";

    List.prototype.initialize = function() {
      var classes, path, tag;
      path = helpers.url.get('playlist', this.model.get('id'));
      classes = [];
      if (path === helpers.url.path()) {
        classes.push('active');
      }
      tag = this.themeLink(this.model.get('name'), path, {
        'className': classes.join(' ')
      });
      return this.model.set({
        title: tag
      });
    };

    return List;

  })(App.Views.ItemView);
  List.Lists = (function(_super) {
    __extends(Lists, _super);

    function Lists() {
      return Lists.__super__.constructor.apply(this, arguments);
    }

    Lists.prototype.template = 'apps/localPlaylist/list/playlist_list';

    Lists.prototype.childView = List.List;

    Lists.prototype.tagName = "div";

    Lists.prototype.childViewContainer = 'ul.lists';

    Lists.prototype.onRender = function() {
      return $('h3', this.$el).html(t.gettext('Playlists'));
    };

    return Lists;

  })(App.Views.CompositeView);
  List.Selection = (function(_super) {
    __extends(Selection, _super);

    function Selection() {
      return Selection.__super__.constructor.apply(this, arguments);
    }

    Selection.prototype.template = 'apps/localPlaylist/list/playlist';

    Selection.prototype.tagName = "li";

    Selection.prototype.initialize = function() {
      return this.model.set({
        title: this.model.get('name')
      });
    };

    Selection.prototype.triggers = {
      'click .item': 'item:selected'
    };

    return Selection;

  })(App.Views.ItemView);
  List.SelectionList = (function(_super) {
    __extends(SelectionList, _super);

    function SelectionList() {
      return SelectionList.__super__.constructor.apply(this, arguments);
    }

    SelectionList.prototype.template = 'apps/localPlaylist/list/playlist_list';

    SelectionList.prototype.childView = List.Selection;

    SelectionList.prototype.tagName = "div";

    SelectionList.prototype.className = 'playlist-selection-list';

    SelectionList.prototype.childViewContainer = 'ul.lists';

    SelectionList.prototype.onRender = function() {
      return $('h3', this.$el).html(t.gettext('Existing playlists'));
    };

    return SelectionList;

  })(App.Views.CompositeView);
  return List.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.template = 'apps/localPlaylist/list/playlist_layout';

    Layout.prototype.tagName = 'div';

    Layout.prototype.className = 'local-playlist';

    Layout.prototype.regions = {
      regionListItems: '.item-container'
    };

    Layout.prototype.triggers = {
      'click .local-playlist-header .clear': 'list:clear',
      'click .local-playlist-header .delete': 'list:delete',
      'click .local-playlist-header .play': 'list:play',
      'click .local-playlist-header .localplay': 'list:localplay'
    };

    Layout.prototype.onRender = function() {
      if (this.options && this.options.list) {
        return $('h2', this.$el).html(this.options.list.get('name'));
      }
    };

    return Layout;

  })(App.Views.LayoutView);
});

this.Kodi.module("localPlaylistApp", function(localPlaylistApp, App, Backbone, Marionette, $, _) {
  var API;
  localPlaylistApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "playlists": "list",
      "playlist/:id": "list"
    };

    return Router;

  })(App.Router.Base);

  /*
    Main functionality.
   */
  API = {
    list: function(id) {
      var item, items, lists;
      if (id === null) {
        lists = App.request("localplaylist:entities");
        items = lists.getRawCollection();
        if (_.isEmpty(lists)) {
          id = 0;
        } else {
          item = _.min(items, function(list) {
            return list.id;
          });
          id = item.id;
          App.navigate(helpers.url.get('playlist', id));
        }
      }
      return new localPlaylistApp.List.Controller({
        id: id
      });
    },
    addToList: function(entityType, id) {
      var $content, $new, playlists, view;
      playlists = App.request("localplaylist:entities");
      if (!playlists || playlists.length === 0) {
        return this.createNewList(entityType, id);
      } else {
        view = new localPlaylistApp.List.SelectionList({
          collection: playlists
        });
        $content = view.render().$el;
        $new = $('<button>').html(t.gettext('Create a new list')).addClass('btn btn-primary');
        $new.on('click', (function(_this) {
          return function() {
            return _.defer(function() {
              return API.createNewList(entityType, id);
            });
          };
        })(this));
        App.execute("ui:modal:show", t.gettext('Add to playlist'), $content, $new);
        return App.listenTo(view, 'childview:item:selected', (function(_this) {
          return function(list, item) {
            return _this.addToExistingList(item.model.get('id'), entityType, id);
          };
        })(this));
      }
    },
    addToExistingList: function(playlistId, entityType, id) {
      var collection;
      if (helpers.global.inArray(entityType, ['albumid', 'artistid'])) {
        collection = App.request("song:filtered:entities", {
          filter: helpers.global.paramObj(entityType, id)
        });
        return App.execute("when:entity:fetched", collection, (function(_this) {
          return function() {
            return _this.addCollectionToList(collection, playlistId);
          };
        })(this));
      } else if (entityType === 'songid') {
        return App.request("song:byid:entities", [id], (function(_this) {
          return function(collection) {
            return _this.addCollectionToList(collection, playlistId);
          };
        })(this));
      } else if (entityType === 'playlist') {
        collection = App.request("playlist:kodi:entities", 'audio');
        return App.execute("when:entity:fetched", collection, (function(_this) {
          return function() {
            return _this.addCollectionToList(collection, playlistId);
          };
        })(this));
      } else {

      }
    },
    addCollectionToList: function(collection, playlistId) {
      App.request("localplaylist:item:add:entities", playlistId, collection);
      App.execute("ui:modal:close");
      return App.execute("notification:show", t.gettext("Added to your playlist"));
    },
    createNewList: function(entityType, id) {
      return App.execute("ui:textinput:show", t.gettext('Add a new playlist'), t.gettext('Give your playlist a name'), (function(_this) {
        return function(text) {
          var playlistId;
          if (text !== '') {
            playlistId = App.request("localplaylist:add:entity", text, 'song');
            return _this.addToExistingList(playlistId, entityType, id);
          }
        };
      })(this), false);
    },
    createEmptyList: function() {
      return App.execute("ui:textinput:show", t.gettext('Add a new playlist'), t.gettext('Give your playlist a name'), (function(_this) {
        return function(text) {
          var playlistId;
          if (text !== '') {
            playlistId = App.request("localplaylist:add:entity", text, 'song');
            return App.navigate("playlist/" + playlistId, {
              trigger: true
            });
          }
        };
      })(this));
    }
  };

  /*
    Listeners.
   */
  App.commands.setHandler("localplaylist:addentity", function(entityType, id) {
    return API.addToList(entityType, id);
  });
  App.commands.setHandler("localplaylist:newlist", function() {
    return API.createEmptyList();
  });
  App.commands.setHandler("localplaylist:reload", function(id) {
    return API.list(id);
  });

  /*
    Init the router
   */
  return App.on("before:start", function() {
    return new localPlaylistApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("MovieApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {
  return Edit.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var form, options;
      this.model = this.getOption('model');
      options = {
        title: this.model.get('title'),
        form: this.getSructure(),
        formState: this.model.attributes,
        config: {
          attributes: {
            "class": 'edit-form'
          },
          callback: (function(_this) {
            return function(data, formView) {
              return _this.saveCallback(data, formView);
            };
          })(this)
        }
      };
      return form = App.request("form:popup:wrapper", options);
    };

    Controller.prototype.getSructure = function() {
      return [
        {
          title: 'Information',
          id: 'general',
          children: [
            {
              id: 'title',
              title: 'Title',
              type: 'textfield',
              defaultValue: ''
            }, {
              id: 'tagline',
              title: 'Tagline',
              type: 'textarea',
              defaultValue: ''
            }, {
              id: 'plotoutline',
              title: 'Plot Outline',
              type: 'textarea',
              defaultValue: ''
            }, {
              id: 'plot',
              title: 'Plot',
              type: 'textarea',
              defaultValue: ''
            }, {
              id: 'rating',
              title: 'Rating',
              type: 'textfield',
              defaultValue: ''
            }, {
              id: 'imdbnumber',
              title: 'Imdb',
              type: 'textfield',
              defaultValue: ''
            }
          ]
        }
      ];
    };

    Controller.prototype.saveCallback = function(data, formView) {
      var videoLib;
      data.rating = parseFloat(data.rating);
      videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      return videoLib.setMovieDetails(this.model.get('id'), data, function() {
        return Kodi.execute("notification:show", t.gettext("Updated movie details"));
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("MovieApp.Landing", function(Landing, App, Backbone, Marionette, $, _) {
  return Landing.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.subNavId = 11;

    Controller.prototype.initialize = function() {
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getPageView();
          return _this.getSubNav();
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayoutView = function() {
      return new Landing.Layout();
    };

    Controller.prototype.getSubNav = function() {
      var subNav;
      subNav = App.request("navMain:children:show", this.subNavId, 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    Controller.prototype.getPageView = function() {
      this.page = new Landing.Page();
      this.listenTo(this.page, "show", (function(_this) {
        return function() {
          return _this.renderRecentlyAdded();
        };
      })(this));
      return this.layout.regionContent.show(this.page);
    };

    Controller.prototype.renderRecentlyAdded = function() {
      var collection;
      collection = App.request("movie:recentlyadded:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var view;
          view = App.request("movie:list:view", collection);
          return _this.page.regionRecentlyAdded.show(view);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("MovieApp.Landing", function(Landing, App, Backbone, Marionette, $, _) {
  Landing.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.className = "movie-landing landing-page";

    return Layout;

  })(App.Views.LayoutWithSidebarFirstView);
  return Landing.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.template = 'apps/movie/landing/landing';

    Page.prototype.className = "movie-recent";

    Page.prototype.regions = {
      regionRecentlyAdded: '.region-recently-added'
    };

    return Page;

  })(App.Views.LayoutView);
});

this.Kodi.module("MovieApp.List", function(List, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getMoviesView: function(collection, set) {
      var view, viewName;
      if (set == null) {
        set = false;
      }
      viewName = set ? 'MoviesSet' : 'Movies';
      view = new List[viewName]({
        collection: collection
      });
      API.bindTriggers(view);
      return view;
    },
    bindTriggers: function(view) {
      App.listenTo(view, 'childview:movie:play', function(parent, viewItem) {
        return App.execute('movie:action', 'play', viewItem);
      });
      App.listenTo(view, 'childview:movie:add', function(parent, viewItem) {
        return App.execute('movie:action', 'add', viewItem);
      });
      App.listenTo(view, 'childview:movie:localplay', function(parent, viewItem) {
        return App.execute('movie:action', 'localplay', viewItem);
      });
      App.listenTo(view, 'childview:movie:download', function(parent, viewItem) {
        return App.execute('movie:action', 'download', viewItem);
      });
      App.listenTo(view, 'childview:movie:watched', function(parent, viewItem) {
        parent.$el.toggleClass('is-watched');
        return App.execute('movie:action', 'toggleWatched', viewItem);
      });
      return App.listenTo(view, 'childview:movie:edit', function(parent, viewItem) {
        return App.execute('movie:action', 'edit', viewItem);
      });
    }
  };
  List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var collection;
      collection = App.request("movie:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          collection.availableFilters = _this.getAvailableFilters();
          collection.sectionId = 11;
          App.request('filter:init', _this.getAvailableFilters());
          _this.layout = _this.getLayoutView(collection);
          _this.listenTo(_this.layout, "show", function() {
            _this.renderList(collection);
            return _this.getFiltersView(collection);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new List.ListLayout({
        collection: collection
      });
    };

    Controller.prototype.getAvailableFilters = function() {
      return {
        sort: ['title', 'year', 'dateadded', 'rating'],
        filter: ['year', 'genre', 'writer', 'director', 'cast', 'set', 'unwatched']
      };
    };

    Controller.prototype.getFiltersView = function(collection) {
      var filters;
      filters = App.request('filter:show', collection);
      this.layout.regionSidebarFirst.show(filters);
      return this.listenTo(filters, "filter:changed", (function(_this) {
        return function() {
          return _this.renderList(collection);
        };
      })(this));
    };

    Controller.prototype.renderList = function(collection) {
      var filteredCollection, view;
      App.execute("loading:show:view", this.layout.regionContent);
      filteredCollection = App.request('filter:apply:entites', collection);
      view = API.getMoviesView(filteredCollection);
      return this.layout.regionContent.show(view);
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("movie:list:view", function(collection) {
    return API.getMoviesView(collection, true);
  });
});

this.Kodi.module("MovieApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "movie-list with-filters";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.MovieTeaser = (function(_super) {
    __extends(MovieTeaser, _super);

    function MovieTeaser() {
      return MovieTeaser.__super__.constructor.apply(this, arguments);
    }

    MovieTeaser.prototype.triggers = {
      "click .play": "movie:play",
      "click .watched": "movie:watched",
      "click .add": "movie:add",
      "click .localplay": "movie:localplay",
      "click .download": "movie:download",
      "click .edit": "movie:edit"
    };

    MovieTeaser.prototype.initialize = function() {
      MovieTeaser.__super__.initialize.apply(this, arguments);
      if (this.model != null) {
        this.model.set({
          subtitle: this.model.get('year')
        });
        return this.model.set(App.request('movie:action:items'));
      }
    };

    MovieTeaser.prototype.attributes = function() {
      var classes;
      classes = ['card'];
      if (helpers.entities.isWatched(this.model)) {
        classes.push('is-watched');
      }
      return {
        "class": classes.join(' ')
      };
    };

    return MovieTeaser;

  })(App.Views.CardView);
  List.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "movie-empty-result";

    return Empty;

  })(App.Views.EmptyView);
  List.Movies = (function(_super) {
    __extends(Movies, _super);

    function Movies() {
      return Movies.__super__.constructor.apply(this, arguments);
    }

    Movies.prototype.childView = List.MovieTeaser;

    Movies.prototype.emptyView = List.Empty;

    Movies.prototype.tagName = "ul";

    Movies.prototype.className = "card-grid--tall";

    return Movies;

  })(App.Views.VirtualListView);
  return List.MoviesSet = (function(_super) {
    __extends(MoviesSet, _super);

    function MoviesSet() {
      return MoviesSet.__super__.constructor.apply(this, arguments);
    }

    MoviesSet.prototype.childView = List.MovieTeaser;

    MoviesSet.prototype.emptyView = List.Empty;

    MoviesSet.prototype.tagName = "ul";

    MoviesSet.prototype.className = "card-grid--tall";

    return MoviesSet;

  })(App.Views.CollectionView);
});

this.Kodi.module("MovieApp", function(MovieApp, App, Backbone, Marionette, $, _) {
  var API;
  MovieApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "movies/recent": "landing",
      "movies": "list",
      "movie/:id": "view"
    };

    return Router;

  })(App.Router.Base);
  API = {
    landing: function() {
      return new MovieApp.Landing.Controller();
    },
    list: function() {
      return new MovieApp.List.Controller();
    },
    view: function(id) {
      return new MovieApp.Show.Controller({
        id: id
      });
    },
    action: function(op, view) {
      var files, model, playlist, videoLib;
      model = view.model;
      playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      files = App.request("command:kodi:controller", 'video', 'Files');
      videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      switch (op) {
        case 'play':
          return playlist.play('movieid', model.get('movieid'));
        case 'add':
          return playlist.add('movieid', model.get('movieid'));
        case 'localplay':
          return files.videoStream(model.get('file'));
        case 'download':
          return files.downloadFile(model.get('file'));
        case 'toggleWatched':
          return videoLib.toggleWatched(model);
        case 'edit':
          return App.execute('movie:edit', model);
      }
    }
  };
  App.reqres.setHandler('movie:action:items', function() {
    return {
      actions: {
        watched: 'Watched',
        thumbs: 'Thumbs up'
      },
      menu: {
        add: 'Add to Kodi playlist',
        edit: 'Edit',
        divider: '',
        download: 'Download',
        localplay: 'Play in browser'
      }
    };
  });
  App.commands.setHandler('movie:action', function(op, view) {
    return API.action(op, view);
  });
  App.commands.setHandler('movie:edit', function(model) {
    var loadedModel;
    loadedModel = App.request("movie:entity", model.get('id'));
    return App.execute("when:entity:fetched", loadedModel, (function(_this) {
      return function() {
        return new MovieApp.Edit.Controller({
          model: loadedModel
        });
      };
    })(this));
  });
  return App.on("before:start", function() {
    return new MovieApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("MovieApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    bindTriggers: function(view) {
      App.listenTo(view, 'movie:play', function(viewItem) {
        return App.execute('movie:action', 'play', viewItem);
      });
      App.listenTo(view, 'movie:add', function(viewItem) {
        return App.execute('movie:action', 'add', viewItem);
      });
      App.listenTo(view, 'movie:localplay', function(viewItem) {
        return App.execute('movie:action', 'localplay', viewItem);
      });
      return App.listenTo(view, 'movie:download', function(viewItem) {
        console.log(viewItem);
        return App.execute('movie:action', 'download', viewItem);
      });
    }
  };
  return Show.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var id, movie;
      id = parseInt(options.id);
      movie = App.request("movie:entity", id);
      return App.execute("when:entity:fetched", movie, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(movie);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", 'none');
          });
          _this.listenTo(_this.layout, "show", function() {
            _this.getDetailsLayoutView(movie);
            return _this.getContentView(movie);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(movie) {
      return new Show.PageLayout({
        model: movie
      });
    };

    Controller.prototype.getContentView = function(movie) {
      this.contentLayout = new Show.Content({
        model: movie
      });
      this.listenTo(this.contentLayout, "movie:youtube", function(view) {
        var trailer;
        trailer = movie.get('trailer');
        return App.execute("ui:modal:youtube", movie.get('title') + ' Trailer', trailer.id);
      });
      this.listenTo(this.contentLayout, 'show', (function(_this) {
        return function() {
          if (movie.get('cast').length > 0) {
            _this.contentLayout.regionCast.show(_this.getCast(movie));
          }
          return _this.getSetView(movie);
        };
      })(this));
      return this.layout.regionContent.show(this.contentLayout);
    };

    Controller.prototype.getCast = function(movie) {
      return App.request('cast:list:view', movie.get('cast'), 'movies');
    };

    Controller.prototype.getDetailsLayoutView = function(movie) {
      var headerLayout;
      headerLayout = new Show.HeaderLayout({
        model: movie
      });
      this.listenTo(headerLayout, "show", (function(_this) {
        return function() {
          var detail, teaser;
          teaser = new Show.MovieTeaser({
            model: movie
          });
          API.bindTriggers(teaser);
          detail = new Show.Details({
            model: movie
          });
          API.bindTriggers(detail);
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        };
      })(this));
      return this.layout.regionHeader.show(headerLayout);
    };

    Controller.prototype.getSetView = function(movie) {
      var collection;
      if (movie.get('set') !== '') {
        collection = App.request("movie:entities");
        return App.execute("when:entity:fetched", collection, (function(_this) {
          return function() {
            var filteredCollection, view;
            filteredCollection = new App.Entities.Filtered(collection);
            filteredCollection.filterBy('set', {
              set: movie.get('set')
            });
            view = new Show.Set({
              set: movie.get('set')
            });
            App.listenTo(view, "show", function() {
              var listview;
              listview = App.request("movie:list:view", filteredCollection);
              return view.regionCollection.show(listview);
            });
            return _this.contentLayout.regionSets.show(view);
          };
        })(this));
      }
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("MovieApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  Show.PageLayout = (function(_super) {
    __extends(PageLayout, _super);

    function PageLayout() {
      return PageLayout.__super__.constructor.apply(this, arguments);
    }

    PageLayout.prototype.className = 'movie-show detail-container';

    return PageLayout;

  })(App.Views.LayoutWithHeaderView);
  Show.HeaderLayout = (function(_super) {
    __extends(HeaderLayout, _super);

    function HeaderLayout() {
      return HeaderLayout.__super__.constructor.apply(this, arguments);
    }

    HeaderLayout.prototype.className = 'movie-details';

    return HeaderLayout;

  })(App.Views.LayoutDetailsHeaderView);
  Show.Details = (function(_super) {
    __extends(Details, _super);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.template = 'apps/movie/show/details_meta';

    Details.prototype.triggers = {
      'click .play': 'movie:play',
      'click .add': 'movie:add',
      'click .stream': 'movie:localplay',
      'click .download': 'movie:download'
    };

    return Details;

  })(App.Views.ItemView);
  Show.MovieTeaser = (function(_super) {
    __extends(MovieTeaser, _super);

    function MovieTeaser() {
      return MovieTeaser.__super__.constructor.apply(this, arguments);
    }

    MovieTeaser.prototype.tagName = "div";

    MovieTeaser.prototype.className = "card-detail";

    MovieTeaser.prototype.triggers = {
      'click .play': 'movie:play'
    };

    return MovieTeaser;

  })(App.Views.CardView);
  Show.Content = (function(_super) {
    __extends(Content, _super);

    function Content() {
      return Content.__super__.constructor.apply(this, arguments);
    }

    Content.prototype.template = 'apps/movie/show/content';

    Content.prototype.className = "movie-content content-sections";

    Content.prototype.onRender = $('[data-toggle="tooltip"]', Content.$el).tooltip();

    Content.prototype.triggers = {
      'click .youtube': 'movie:youtube'
    };

    Content.prototype.regions = {
      regionCast: '.region-cast',
      regionSets: '.region-sets'
    };

    return Content;

  })(App.Views.LayoutView);
  return Show.Set = (function(_super) {
    __extends(Set, _super);

    function Set() {
      return Set.__super__.constructor.apply(this, arguments);
    }

    Set.prototype.template = 'apps/movie/show/set';

    Set.prototype.className = 'movie-set';

    Set.prototype.onRender = function() {
      if (this.options) {
        if (this.options.set) {
          return $('h2.set-name', this.$el).html(this.options.set);
        }
      }
    };

    Set.prototype.regions = function() {
      return {
        regionCollection: '.collection-items'
      };
    };

    return Set;

  })(App.Views.LayoutView);
});

this.Kodi.module("NavMain", function(NavMain, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getNav: function() {
      var navStructure;
      navStructure = App.request('navMain:entities');
      return new NavMain.List({
        collection: navStructure
      });
    },
    getNavChildren: function(parentId, title) {
      var navStructure;
      if (title == null) {
        title = 'default';
      }
      navStructure = App.request('navMain:entities', parentId);
      if (title !== 'default') {
        navStructure.set({
          title: title
        });
      }
      return new NavMain.ItemList({
        model: navStructure
      });
    }
  };
  this.onStart = function(options) {
    return App.vent.on("shell:ready", (function(_this) {
      return function(options) {
        var nav;
        nav = API.getNav();
        return App.regionNav.show(nav);
      };
    })(this));
  };
  return App.reqres.setHandler("navMain:children:show", function(parentId, title) {
    if (title == null) {
      title = 'default';
    }
    return API.getNavChildren(parentId, title);
  });
});

this.Kodi.module("NavMain", function(NavMain, App, Backbone, Marionette, $, _) {
  NavMain.List = (function(_super) {
    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.template = "apps/navMain/show/navMain";

    return List;

  })(Backbone.Marionette.ItemView);
  NavMain.Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.template = "apps/navMain/show/nav_item";

    Item.prototype.tagName = "li";

    Item.prototype.initialize = function() {
      var classes, tag;
      classes = [];
      if (this.model.get('path') === helpers.url.path()) {
        classes.push('active');
      }
      tag = this.themeLink(this.model.get('title'), this.model.get('path'), {
        'className': classes.join(' ')
      });
      return this.model.set({
        link: tag
      });
    };

    return Item;

  })(Backbone.Marionette.ItemView);
  return NavMain.ItemList = (function(_super) {
    __extends(ItemList, _super);

    function ItemList() {
      return ItemList.__super__.constructor.apply(this, arguments);
    }

    ItemList.prototype.template = 'apps/navMain/show/nav_sub';

    ItemList.prototype.childView = NavMain.Item;

    ItemList.prototype.tagName = "div";

    ItemList.prototype.childViewContainer = 'ul.items';

    ItemList.prototype.className = "nav-sub";

    ItemList.prototype.initialize = function() {
      return this.collection = this.model.get('items');
    };

    return ItemList;

  })(App.Views.CompositeView);
});

this.Kodi.module("NotificationsApp", function(NotificationApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    notificationMinTimeOut: 5000
  };
  return App.commands.setHandler("notification:show", function(msg, severity) {
    var timeout;
    if (severity == null) {
      severity = 'normal';
    }
    timeout = msg.length < 50 ? API.notificationMinTimeOut : msg.length * 100;
    return $.snackbar({
      content: msg,
      style: 'type-' + severity,
      timeout: timeout
    });
  });
});

this.Kodi.module("PlayerApp", function(PlayerApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getPlayer: function(player) {
      return new PlayerApp.Show.Player({
        player: player
      });
    },
    doCommand: function(player, command, params, callback) {
      return App.request("command:" + player + ":player", command, params, (function(_this) {
        return function() {
          return _this.pollingUpdate(callback);
        };
      })(this));
    },
    getAppController: function(player) {
      return App.request("command:" + player + ":controller", 'auto', 'Application');
    },
    pollingUpdate: function(callback) {
      var stateObj;
      stateObj = App.request("state:current");
      if (stateObj.getPlayer() === 'kodi') {
        if (!App.request('sockets:active')) {
          return App.request('state:kodi:update', callback);
        }
      } else {

      }
    },
    initPlayer: function(player, playerView) {
      var $playerCtx, $progress, $volume, appController;
      this.initProgress(player);
      this.initVolume(player);
      App.vent.trigger("state:player:updated", player);
      appController = this.getAppController(player);
      App.vent.on("state:initialized", (function(_this) {
        return function() {
          var stateObj;
          stateObj = App.request("state:kodi");
          if (stateObj.isPlaying()) {
            _this.timerStop();
            return _this.timerStart();
          }
        };
      })(this));
      App.listenTo(playerView, "control:play", (function(_this) {
        return function() {
          return _this.doCommand(player, 'PlayPause', 'toggle');
        };
      })(this));
      App.listenTo(playerView, "control:prev", (function(_this) {
        return function() {
          return _this.doCommand(player, 'GoTo', 'previous');
        };
      })(this));
      App.listenTo(playerView, "control:next", (function(_this) {
        return function() {
          return _this.doCommand(player, 'GoTo', 'next');
        };
      })(this));
      App.listenTo(playerView, "control:repeat", (function(_this) {
        return function() {
          return _this.doCommand(player, 'SetRepeat', 'cycle');
        };
      })(this));
      App.listenTo(playerView, "control:shuffle", (function(_this) {
        return function() {
          return _this.doCommand(player, 'SetShuffle', 'toggle');
        };
      })(this));
      App.listenTo(playerView, "control:mute", (function(_this) {
        return function() {
          return appController.toggleMute(function() {
            return _this.pollingUpdate();
          });
        };
      })(this));
      App.listenTo(playerView, 'control:menu', function() {
        return App.execute("ui:playermenu", 'toggle');
      });
      if (player === 'kodi') {
        App.listenTo(playerView, "remote:toggle", (function(_this) {
          return function() {
            return App.execute("input:remote:toggle");
          };
        })(this));
      }
      $playerCtx = $('#player-' + player);
      $progress = $('.playing-progress', $playerCtx);
      if (player === 'kodi') {
        $progress.on('change', function() {
          API.timerStop();
          return API.doCommand(player, 'Seek', Math.round(this.vGet()), function() {
            return API.timerStart();
          });
        });
        $progress.on('slide', function() {
          return API.timerStop();
        });
      } else {
        $progress.on('change', function() {
          return API.doCommand(player, 'Seek', Math.round(this.vGet()));
        });
      }
      $volume = $('.volume', $playerCtx);
      return $volume.on('change', function() {
        return appController.setVolume(Math.round(this.vGet()), function() {
          return API.pollingUpdate();
        });
      });
    },
    timerStart: function() {
      return App.playingTimerInterval = setTimeout(((function(_this) {
        return function() {
          return _this.timerUpdate();
        };
      })(this)), 1000);
    },
    timerStop: function() {
      return clearTimeout(App.playingTimerInterval);
    },
    timerUpdate: function() {
      var cur, curTimeObj, dur, percent, stateObj;
      stateObj = App.request("state:kodi");
      this.timerStop();
      if (stateObj.isPlaying() && (stateObj.getPlaying('time') != null)) {
        cur = helpers.global.timeToSec(stateObj.getPlaying('time')) + 1;
        dur = helpers.global.timeToSec(stateObj.getPlaying('totaltime'));
        percent = Math.ceil(cur / dur * 100);
        curTimeObj = helpers.global.secToTime(cur);
        stateObj.setPlaying('time', curTimeObj);
        this.setProgress('kodi', percent, curTimeObj);
        return this.timerStart();
      }
    },
    setProgress: function(player, percent, currentTime) {
      var $cur, $playerCtx;
      if (percent == null) {
        percent = 0;
      }
      $playerCtx = $('#player-' + player);
      $cur = $('.playing-time-current', $playerCtx);
      $cur.html(helpers.global.formatTime(currentTime));
      return $('.playing-progress', $playerCtx).val(percent);
    },
    initProgress: function(player, percent) {
      var $playerCtx;
      if (percent == null) {
        percent = 0;
      }
      $playerCtx = $('#player-' + player);
      return $('.playing-progress', $playerCtx).noUiSlider({
        start: percent,
        connect: 'upper',
        step: 1,
        range: {
          min: 0,
          max: 100
        }
      });
    },
    initVolume: function(player, percent) {
      var $playerCtx;
      if (percent == null) {
        percent = 50;
      }
      $playerCtx = $('#player-' + player);
      return $('.volume', $playerCtx).noUiSlider({
        start: percent,
        connect: 'upper',
        step: 1,
        range: {
          min: 0,
          max: 100
        }
      });
    }
  };
  return this.onStart = function(options) {
    App.vent.on("shell:ready", (function(_this) {
      return function(options) {
        App.kodiPlayer = API.getPlayer('kodi');
        App.listenTo(App.kodiPlayer, "show", function() {
          API.initPlayer('kodi', App.kodiPlayer);
          return App.execute("player:kodi:timer", 'start');
        });
        App.regionPlayerKodi.show(App.kodiPlayer);
        App.localPlayer = API.getPlayer('local');
        App.listenTo(App.localPlayer, "show", function() {
          return API.initPlayer('local', App.localPlayer);
        });
        return App.regionPlayerLocal.show(App.localPlayer);
      };
    })(this));
    App.commands.setHandler('player:kodi:timer', function(state) {
      if (state == null) {
        state = 'start';
      }
      if (state === 'start') {
        return API.timerStart();
      } else if (state === 'stop') {
        return API.timerStop();
      } else if (state === 'update') {
        return API.timerUpdate();
      }
    });
    return App.commands.setHandler('player:local:progress:update', function(percent, currentTime) {
      return API.setProgress('local', percent, currentTime);
    });
  };
});

this.Kodi.module("PlayerApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  return Show.Player = (function(_super) {
    __extends(Player, _super);

    function Player() {
      return Player.__super__.constructor.apply(this, arguments);
    }

    Player.prototype.template = "apps/player/show/player";

    Player.prototype.regions = {
      regionProgress: '.playing-progress',
      regionVolume: '.volume',
      regionThumbnail: '.playing-thumb',
      regionTitle: '.playing-title',
      regionSubtitle: '.playing-subtitle',
      regionTimeCur: '.playing-time-current',
      regionTimeDur: '.playing-time-duration'
    };

    Player.prototype.triggers = {
      'click .remote-toggle': 'remote:toggle',
      'click .control-prev': 'control:prev',
      'click .control-play': 'control:play',
      'click .control-next': 'control:next',
      'click .control-stop': 'control:stop',
      'click .control-mute': 'control:mute',
      'click .control-shuffle': 'control:shuffle',
      'click .control-repeat': 'control:repeat',
      'click .control-menu': 'control:menu'
    };

    return Player;

  })(App.Views.ItemView);
});

this.Kodi.module("PlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      return App.vent.on("shell:ready", (function(_this) {
        return function(options) {
          return _this.getPlaylistBar();
        };
      })(this));
    };

    Controller.prototype.playlistController = function(player, media) {
      return App.request("command:" + player + ":controller", media, 'PlayList');
    };

    Controller.prototype.playerCommand = function(player, command, params) {
      if (params == null) {
        params = [];
      }
      return App.request("command:" + player + ":player", command, params, function() {
        return App.request("state:kodi:update");
      });
    };

    Controller.prototype.stateObj = function() {
      return App.request("state:current");
    };

    Controller.prototype.getPlaylistBar = function() {
      this.layout = this.getLayout();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.renderList('kodi', 'audio');
          _this.renderList('local', 'audio');
          return App.vent.on("state:initialized", function() {
            return _this.changePlaylist(_this.stateObj().getState('player'), _this.stateObj().getState('media'));
          });
        };
      })(this));
      this.listenTo(this.layout, 'playlist:kodi:audio', (function(_this) {
        return function() {
          return _this.changePlaylist('kodi', 'audio');
        };
      })(this));
      this.listenTo(this.layout, 'playlist:kodi:video', (function(_this) {
        return function() {
          return _this.changePlaylist('kodi', 'video');
        };
      })(this));
      this.listenTo(this.layout, 'playlist:kodi', (function(_this) {
        return function() {
          _this.stateObj().setPlayer('kodi');
          return _this.renderList('kodi', 'audio');
        };
      })(this));
      this.listenTo(this.layout, 'playlist:local', (function(_this) {
        return function() {
          _this.stateObj().setPlayer('local');
          return _this.renderList('local', 'audio');
        };
      })(this));
      this.listenTo(this.layout, 'playlist:clear', (function(_this) {
        return function() {
          return _this.playlistController(_this.stateObj().getPlayer(), _this.stateObj().getState('media')).clear();
        };
      })(this));
      this.listenTo(this.layout, 'playlist:refresh', (function(_this) {
        return function() {
          _this.renderList(_this.stateObj().getPlayer(), _this.stateObj().getState('media'));
          return App.execute("notification:show", t.gettext('Playlist refreshed'));
        };
      })(this));
      this.listenTo(this.layout, 'playlist:party', (function(_this) {
        return function() {
          return _this.playerCommand('kodi', 'SetPartymode', ['toggle']);
        };
      })(this));
      this.listenTo(this.layout, 'playlist:save', (function(_this) {
        return function() {
          return App.execute("localplaylist:addentity", 'playlist');
        };
      })(this));
      return App.regionPlaylist.show(this.layout);
    };

    Controller.prototype.getLayout = function() {
      return new List.Layout();
    };

    Controller.prototype.getList = function(collection) {
      return new List.Items({
        collection: collection
      });
    };

    Controller.prototype.renderList = function(type, media) {
      var collection, listView;
      this.layout.$el.removeClassStartsWith('media-').addClass('media-' + media);
      if (type === 'kodi') {
        collection = App.request("playlist:list", type, media);
        return App.execute("when:entity:fetched", collection, (function(_this) {
          return function() {
            var listView;
            listView = _this.getList(collection);
            App.listenTo(listView, "show", function() {
              return _this.bindActions(listView, type, media);
            });
            _this.layout.kodiPlayList.show(listView);
            return App.vent.trigger("state:content:updated");
          };
        })(this));
      } else {
        collection = App.request("localplayer:get:entities");
        listView = this.getList(collection);
        App.listenTo(listView, "show", (function(_this) {
          return function() {
            return _this.bindActions(listView, type, media);
          };
        })(this));
        this.layout.localPlayList.show(listView);
        return App.vent.trigger("state:content:updated");
      }
    };

    Controller.prototype.bindActions = function(listView, type, media) {
      var playlist;
      playlist = this.playlistController(type, media);
      this.listenTo(listView, "childview:playlist:item:remove", function(playlistView, item) {
        return playlist.remove(item.model.get('position'));
      });
      this.listenTo(listView, "childview:playlist:item:play", function(playlistView, item) {
        return playlist.playEntity('position', parseInt(item.model.get('position')));
      });
      return this.initSortable(type, media);
    };

    Controller.prototype.changePlaylist = function(player, media) {
      return this.renderList(player, media);
    };

    Controller.prototype.initSortable = function(type, media) {
      var $ctx, playlist;
      $ctx = $('.' + type + '-playlist');
      playlist = this.playlistController(type, media);
      return $('ul.playlist-items', $ctx).sortable({
        onEnd: function(e) {
          return playlist.moveItem($(e.item).data('type'), $(e.item).data('id'), e.oldIndex, e.newIndex);
        }
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("PlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.template = "apps/playlist/list/playlist_bar";

    Layout.prototype.tagName = "div";

    Layout.prototype.className = "playlist-bar";

    Layout.prototype.regions = {
      kodiPlayList: '.kodi-playlist',
      localPlayList: '.local-playlist'
    };

    Layout.prototype.triggers = {
      'click .kodi-playlists .media-toggle .video': 'playlist:kodi:video',
      'click .kodi-playlists .media-toggle .audio': 'playlist:kodi:audio',
      'click .player-toggle .kodi': 'playlist:kodi',
      'click .player-toggle .local': 'playlist:local',
      'click .clear-playlist': 'playlist:clear',
      'click .refresh-playlist': 'playlist:refresh',
      'click .party-mode': 'playlist:party',
      'click .save-playlist': 'playlist:save'
    };

    Layout.prototype.events = {
      'click .playlist-menu a': 'menuClick'
    };

    Layout.prototype.menuClick = function(e) {
      return e.preventDefault();
    };

    return Layout;

  })(App.Views.LayoutView);
  List.Item = (function(_super) {
    __extends(Item, _super);

    function Item() {
      return Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.template = "apps/playlist/list/playlist_item";

    Item.prototype.tagName = "li";

    Item.prototype.initialize = function() {
      var subtitle;
      subtitle = '';
      switch (this.model.get('type')) {
        case 'song':
          subtitle = this.model.get('artist') ? this.model.get('artist').join(', ') : '';
          break;
        default:
          subtitle = '';
      }
      return this.model.set({
        subtitle: subtitle
      });
    };

    Item.prototype.triggers = {
      "click .remove": "playlist:item:remove",
      "click .play": "playlist:item:play"
    };

    Item.prototype.attributes = function() {
      return {
        "class": 'item pos-' + this.model.get('position'),
        'data-type': this.model.get('type'),
        'data-id': this.model.get('id')
      };
    };

    return Item;

  })(App.Views.ItemView);
  return List.Items = (function(_super) {
    __extends(Items, _super);

    function Items() {
      return Items.__super__.constructor.apply(this, arguments);
    }

    Items.prototype.childView = List.Item;

    Items.prototype.tagName = "ul";

    Items.prototype.className = "playlist-items";

    return Items;

  })(App.Views.CollectionView);
});

this.Kodi.module("PlaylistApp", function(PlaylistApp, App, Backbone, Marionette, $, _) {
  var API;
  PlaylistApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "playlist": "list"
    };

    return Router;

  })(App.Router.Base);
  API = {
    list: function() {},
    type: 'kodi',
    media: 'audio',
    setContext: function(type, media) {
      if (type == null) {
        type = 'kodi';
      }
      if (media == null) {
        media = 'audio';
      }
      this.type = type;
      return this.media = media;
    },
    getController: function() {
      return App.request("command:" + this.type + ":controller", this.media, 'PlayList');
    },
    getPlaylistItems: function() {
      return App.request("playlist:" + this.type + ":entities", this.media);
    }
  };
  App.reqres.setHandler("playlist:list", function(type, media) {
    API.setContext(type, media);
    return API.getPlaylistItems();
  });
  App.on("before:start", function() {
    return new PlaylistApp.Router({
      controller: API
    });
  });
  return App.addInitializer(function() {
    var controller;
    controller = new PlaylistApp.List.Controller();
    return App.commands.setHandler("playlist:refresh", function(type, media) {
      return controller.renderList(type, media);
    });
  });
});

this.Kodi.module("ChannelApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var collection;
      collection = App.request("channel:entities", options.group);
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(collection);
          _this.listenTo(_this.layout, "show", function() {
            _this.renderChannels(collection);
            return _this.getSubNav();
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(collection) {
      return new List.Layout({
        collection: collection
      });
    };

    Controller.prototype.renderChannels = function(collection) {
      var view;
      view = new List.ChannelList({
        collection: collection
      });
      this.listenTo(view, 'childview:channel:play', function(parent, child) {
        var player;
        player = App.request("command:kodi:controller", 'auto', 'Player');
        return player.playEntity('channelid', child.model.get('id'), {}, (function(_this) {
          return function() {};
        })(this));
      });
      this.listenTo(view, 'childview:channel:record', function(parent, child) {
        var record;
        record = App.request("command:kodi:controller", 'auto', 'PVR');
        return record.setPVRRecord(child.model.get('id'), {
          "record": "toggle"
        }, (function(_this) {
          return function() {
            return App.execute("notification:show", t.gettext("Channel recording toggled"));
          };
        })(this));
      });
      return this.layout.regionContent.show(view);
    };

    Controller.prototype.getSubNav = function() {
      var subNav, subNavId;
      subNavId = this.getOption('group') === 'alltv' ? 21 : 1;
      subNav = App.request("navMain:children:show", subNavId, 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("ChannelApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.className = "pvr-page";

    return Layout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.ChannelTeaser = (function(_super) {
    __extends(ChannelTeaser, _super);

    function ChannelTeaser() {
      return ChannelTeaser.__super__.constructor.apply(this, arguments);
    }

    ChannelTeaser.prototype.tagName = "li";

    ChannelTeaser.prototype.triggers = {
      "click .play": "channel:play",
      "click .record": "channel:record"
    };

    ChannelTeaser.prototype.initialize = function() {
      ChannelTeaser.__super__.initialize.apply(this, arguments);
      if (this.model != null) {
        return this.model.set({
          subtitle: this.model.get('broadcastnow').title
        });
      }
    };

    return ChannelTeaser;

  })(App.Views.CardView);
  return List.ChannelList = (function(_super) {
    __extends(ChannelList, _super);

    function ChannelList() {
      return ChannelList.__super__.constructor.apply(this, arguments);
    }

    ChannelList.prototype.childView = List.ChannelTeaser;

    ChannelList.prototype.tagName = "ul";

    ChannelList.prototype.className = "card-grid--square";

    return ChannelList;

  })(App.Views.CollectionView);
});

this.Kodi.module("ChannelApp", function(ChannelApp, App, Backbone, Marionette, $, _) {
  var API;
  ChannelApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "tvshows/live": "tv",
      "music/radio": "radio"
    };

    return Router;

  })(App.Router.Base);
  API = {
    tv: function() {
      return new ChannelApp.List.Controller({
        group: 'alltv'
      });
    },
    radio: function() {
      return new ChannelApp.List.Controller({
        group: 'allradio'
      });
    }
  };
  return App.on("before:start", function() {
    return new ChannelApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("SearchApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var entities, media;
      this.layout = this.getLayout();
      media = this.getOption('media');
      if (media === 'all') {
        entities = ['song', 'artist', 'album', 'tvshow', 'movie'];
      } else {
        entities = [media];
      }
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          var entity, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = entities.length; _i < _len; _i++) {
            entity = entities[_i];
            _results.push(_this.getResult(entity));
          }
          return _results;
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayout = function() {
      return new List.ListLayout();
    };

    Controller.prototype.getResult = function(entity) {
      var limit, query;
      query = this.getOption('query');
      limit = this.getOption('media') === 'all' ? 'limit' : 'all';
      return App.execute("" + entity + ":search:entities", query, limit, (function(_this) {
        return function(loaded) {
          var setView, view;
          if (loaded.length > 0) {
            view = App.request("" + entity + ":list:view", loaded, true);
            setView = new List.ListSet({
              entity: entity,
              more: (loaded.more ? true : false),
              query: query
            });
            App.listenTo(setView, "show", function() {
              return setView.regionResult.show(view);
            });
            return _this.layout["" + entity + "Set"].show(setView);
          }
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("SearchApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.template = 'apps/search/list/search_layout';

    ListLayout.prototype.className = "search-page set-page";

    ListLayout.prototype.regions = {
      artistSet: '.entity-set-artist',
      albumSet: '.entity-set-album',
      songSet: '.entity-set-song',
      movieSet: '.entity-set-movie',
      tvshowSet: '.entity-set-tvshow'
    };

    return ListLayout;

  })(App.Views.LayoutView);
  return List.ListSet = (function(_super) {
    __extends(ListSet, _super);

    function ListSet() {
      return ListSet.__super__.constructor.apply(this, arguments);
    }

    ListSet.prototype.template = 'apps/search/list/search_set';

    ListSet.prototype.className = "search-set";

    ListSet.prototype.onRender = function() {
      var moreLink;
      if (this.options) {
        if (this.options.entity) {
          $('h2.set-header', this.$el).html(t.gettext(this.options.entity + 's'));
          if (this.options.more && this.options.query) {
            moreLink = this.themeLink(t.gettext('Show More'), 'search/' + this.options.entity + '/' + this.options.query);
            return $('.more', this.$el).html(moreLink);
          }
        }
      }
    };

    ListSet.prototype.regions = {
      regionResult: '.set-results'
    };

    return ListSet;

  })(App.Views.LayoutView);
});

this.Kodi.module("SearchApp", function(SearchApp, App, Backbone, Marionette, $, _) {
  var API;
  SearchApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "search": "view",
      "search/:media/:query": "list"
    };

    return Router;

  })(App.Router.Base);
  API = {
    keyUpTimeout: 2000,
    list: function(media, query) {
      App.navigate("search/" + media + "/" + query);
      return new SearchApp.List.Controller({
        query: query,
        media: media
      });
    },
    view: function() {},
    searchBind: function() {
      return $('#search').on('keyup', function(e) {
        var val;
        val = $('#search').val();
        clearTimeout(App.searchAllTimeout);
        if (e.which === 13) {
          return API.list('all', val);
        } else {
          return App.searchAllTimeout = setTimeout((function() {
            return API.list('all', val);
          }), API.keyUpTimeout);
        }
      });
    }
  };
  App.on("before:start", function() {
    return new SearchApp.Router({
      controller: API
    });
  });
  return App.addInitializer(function() {
    return App.vent.on("shell:ready", function() {
      return API.searchBind();
    });
  });
});

this.Kodi.module("SettingsApp", function(SettingsApp, App, Backbone, Marionette, $, _) {
  var API;
  SettingsApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "settings/web": "local",
      "settings/kodi": "kodi"
    };

    return Router;

  })(App.Router.Base);
  API = {
    subNavId: 51,
    local: function() {
      return new SettingsApp.Show.Local.Controller();
    },
    kodi: function() {
      return new SettingsApp.Show.Kodi.Controller();
    },
    getSubNav: function() {
      return App.request("navMain:children:show", this.subNavId, 'Sections');
    }
  };
  App.on("before:start", function() {
    return new SettingsApp.Router({
      controller: API
    });
  });
  return App.reqres.setHandler('settings:subnav', function() {
    return API.getSubNav();
  });
});

this.Kodi.module("SettingsApp.Show.Kodi", function(Kodi, App, Backbone, Marionette, $, _) {
  return Kodi.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getSubNav();
          return _this.getForm();
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayoutView = function() {
      return new App.SettingsApp.Show.Layout();
    };

    Controller.prototype.getSubNav = function() {
      var subNav;
      subNav = App.request('settings:subnav');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    Controller.prototype.getForm = function() {
      var form, options;
      options = {
        form: this.getSructure(),
        formState: this.getState(),
        config: {
          attributes: {
            "class": 'settings-form'
          }
        }
      };
      form = App.request("form:wrapper", options);
      return this.layout.regionContent.show(form);
    };

    Controller.prototype.getSructure = function() {
      return [
        {
          title: 'List options',
          id: 'list',
          children: [
            {
              id: 'ignore-article',
              title: 'Ignore Article',
              type: 'checkbox',
              defaultValue: true,
              description: 'Ignore terms such as "The" and "a" when sorting lists'
            }
          ]
        }
      ];
    };

    Controller.prototype.getState = function() {
      return {
        'default-player': 'local',
        'jsonrpc-address': '/jsonrpc',
        'test-checkbox': false
      };
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("SettingsApp.Show.Local", function(Local, App, Backbone, Marionette, $, _) {
  return Local.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getSubNav();
          return _this.getForm();
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayoutView = function() {
      return new App.SettingsApp.Show.Layout();
    };

    Controller.prototype.getSubNav = function() {
      var subNav;
      subNav = App.request('settings:subnav');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    Controller.prototype.getForm = function() {
      var form, options;
      options = {
        form: this.getStructure(),
        formState: this.getState(),
        config: {
          attributes: {
            "class": 'settings-form'
          },
          callback: (function(_this) {
            return function(data, formView) {
              return _this.saveCallback(data, formView);
            };
          })(this)
        }
      };
      form = App.request("form:wrapper", options);
      return this.layout.regionContent.show(form);
    };

    Controller.prototype.getStructure = function() {
      return [
        {
          title: 'General Options',
          id: 'general',
          children: [
            {
              id: 'lang',
              title: t.gettext("Language"),
              type: 'select',
              options: helpers.translate.getLanguages(),
              defaultValue: 'en',
              description: t.gettext('Preferred language, need to refresh browser to take effect')
            }, {
              id: 'defaultPlayer',
              title: t.gettext("Default player"),
              type: 'select',
              options: {
                auto: 'Auto',
                kodi: 'Kodi',
                local: 'Local'
              },
              defaultValue: 'auto',
              description: t.gettext('Which player to start with')
            }
          ]
        }, {
          title: 'List options',
          id: 'list',
          children: [
            {
              id: 'ignoreArticle',
              title: t.gettext("Ignore article"),
              type: 'checkbox',
              defaultValue: true,
              description: t.gettext("Ignore articles (terms such as 'The' and 'A') when sorting lists")
            }, {
              id: 'albumAtristsOnly',
              title: t.gettext("Album artists only"),
              type: 'checkbox',
              defaultValue: true,
              description: t.gettext('When listing artists should we only see artists with albums or all artists found. Warning: turning this off can impact performance with large libraries')
            }
          ]
        }, {
          title: 'Advanced Options',
          id: 'advanced',
          children: [
            {
              id: 'socketsPort',
              title: t.gettext("Websockets Port"),
              type: 'textfield',
              defaultValue: '9090',
              description: "9090 " + t.gettext("is the default")
            }, {
              id: 'socketsHost',
              title: t.gettext("Websockets Host"),
              type: 'textfield',
              defaultValue: 'auto',
              description: t.gettext("The hostname used for websockets connection. Set to 'auto' to use the current hostname.")
            }, {
              id: 'pollInterval',
              title: t.gettext("Poll Interval"),
              type: 'select',
              defaultValue: '10000',
              options: {
                '5000': "5 " + t.gettext('sec'),
                '10000': "10 " + t.gettext('sec'),
                '30000': "30 " + t.gettext('sec'),
                '60000': "60 " + t.gettext('sec')
              },
              description: t.gettext("How often do I poll for updates from Kodi (Only applies when websockets inactive)")
            }, {
              id: 'reverseProxy',
              title: t.gettext("Reverse Proxy Support"),
              type: 'checkbox',
              defaultValue: false,
              description: t.gettext('Enable support for reverse proxying.')
            }
          ]
        }
      ];
    };

    Controller.prototype.getState = function() {
      return config.get('app', 'config:local', config["static"]);
    };

    Controller.prototype.saveCallback = function(data, formView) {
      config.set('app', 'config:local', data);
      return Kodi.execute("notification:show", t.gettext("Web Settings saved."));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("SettingsApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  return Show.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.className = "settings-page";

    return Layout;

  })(App.Views.LayoutWithSidebarFirstView);
});

this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {
  var API;
  Shell.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "": "homePage",
      "home": "homePage"
    };

    return Router;

  })(App.Router.Base);
  API = {
    homePage: function() {
      var home;
      home = new Shell.HomepageLayout();
      App.regionContent.show(home);
      this.setFanart();
      App.vent.on("state:changed", (function(_this) {
        return function(state) {
          var stateObj;
          stateObj = App.request("state:current");
          if (stateObj.isPlayingItemChanged() && helpers.url.arg(0) === '') {
            return _this.setFanart();
          }
        };
      })(this));
      return App.listenTo(home, "destroy", (function(_this) {
        return function() {
          return App.execute("images:fanart:set", 'none');
        };
      })(this));
    },
    setFanart: function() {
      var playingItem, stateObj;
      stateObj = App.request("state:current");
      if (stateObj != null) {
        playingItem = stateObj.getPlaying('item');
        return App.execute("images:fanart:set", playingItem.fanart);
      } else {
        return App.execute("images:fanart:set");
      }
    },
    renderLayout: function() {
      var playlistState, shellLayout;
      shellLayout = new Shell.Layout();
      App.root.show(shellLayout);
      App.addRegions(shellLayout.regions);
      App.execute("loading:show:page");
      playlistState = config.get('app', 'shell:playlist:state', 'open');
      if (playlistState === 'closed') {
        this.alterRegionClasses('add', "shell-playlist-closed");
      }
      App.listenTo(shellLayout, "shell:playlist:toggle", (function(_this) {
        return function(child, args) {
          var state;
          playlistState = config.get('app', 'shell:playlist:state', 'open');
          state = playlistState === 'open' ? 'closed' : 'open';
          config.set('app', 'shell:playlist:state', state);
          return _this.alterRegionClasses('toggle', "shell-playlist-closed");
        };
      })(this));
      App.listenTo(shellLayout, "shell:audio:scan", (function(_this) {
        return function() {
          return App.request("command:kodi:controller", 'auto', 'AudioLibrary').scan();
        };
      })(this));
      App.listenTo(shellLayout, "shell:video:scan", (function(_this) {
        return function() {
          return App.request("command:kodi:controller", 'auto', 'VideoLibrary').scan();
        };
      })(this));
      return App.listenTo(shellLayout, "shell:about", (function(_this) {
        return function() {};
      })(this));
    },
    alterRegionClasses: function(op, classes, region) {
      var $body, action;
      if (region == null) {
        region = 'root';
      }
      $body = App.getRegion(region).$el;
      action = "" + op + "Class";
      return $body[action](classes);
    }
  };
  return App.addInitializer(function() {
    return App.commands.setHandler("shell:view:ready", function() {
      API.renderLayout();
      new Shell.Router({
        controller: API
      });
      App.vent.trigger("shell:ready");
      return App.commands.setHandler("body:state", function(op, state) {
        return API.alterRegionClasses(op, state);
      });
    });
  });
});

this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {
  Shell.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.template = "apps/shell/show/shell";

    Layout.prototype.regions = {
      regionNav: '#nav-bar',
      regionContent: '#content',
      regionSidebarFirst: '#sidebar-first',
      regionPlaylist: '#playlist-bar',
      regionTitle: '#page-title .title',
      regionTitleContext: '#page-title .context',
      regionFanart: '#fanart',
      regionPlayerKodi: '#player-kodi',
      regionPlayerLocal: '#player-local',
      regionModal: '#modal-window',
      regionModalTitle: '.modal-title',
      regionModalBody: '.modal-body',
      regionModalFooter: '.modal-footer',
      regionRemote: '#remote'
    };

    Layout.prototype.triggers = {
      "click .playlist-toggle-open": "shell:playlist:toggle",
      "click .audio-scan": "shell:audio:scan",
      "click .video-scan": "shell:video:scan",
      "click .about": "shell:about"
    };

    Layout.prototype.events = {
      "click .player-menu > li": "closePlayerMenu"
    };

    Layout.prototype.closePlayerMenu = function() {
      return App.execute("ui:playermenu", 'close');
    };

    return Layout;

  })(Backbone.Marionette.LayoutView);
  Shell.HomepageLayout = (function(_super) {
    __extends(HomepageLayout, _super);

    function HomepageLayout() {
      return HomepageLayout.__super__.constructor.apply(this, arguments);
    }

    HomepageLayout.prototype.template = "apps/shell/show/homepage";

    return HomepageLayout;

  })(Backbone.Marionette.LayoutView);
  return App.execute("shell:view:ready");
});

this.Kodi.module("SongApp.List", function(List, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getSongsView: function(songs, verbose) {
      if (verbose == null) {
        verbose = false;
      }
      this.songsView = new List.Songs({
        collection: songs,
        verbose: verbose
      });
      App.listenTo(this.songsView, 'childview:song:play', (function(_this) {
        return function(list, item) {
          return _this.playSong(item.model.get('songid'));
        };
      })(this));
      App.listenTo(this.songsView, 'childview:song:add', (function(_this) {
        return function(list, item) {
          return _this.addSong(item.model.get('songid'));
        };
      })(this));
      App.listenTo(this.songsView, 'childview:song:localadd', (function(_this) {
        return function(list, item) {
          return _this.localAddSong(item.model.get('songid'));
        };
      })(this));
      App.listenTo(this.songsView, 'childview:song:localplay', (function(_this) {
        return function(list, item) {
          return _this.localPlaySong(item.model);
        };
      })(this));
      App.listenTo(this.songsView, 'childview:song:download', (function(_this) {
        return function(list, item) {
          return _this.downloadSong(item.model);
        };
      })(this));
      App.listenTo(this.songsView, 'childview:song:musicvideo', (function(_this) {
        return function(list, item) {
          return _this.musicVideo(item.model);
        };
      })(this));
      App.listenTo(this.songsView, "show", function() {
        return App.vent.trigger("state:content:updated");
      });
      return this.songsView;
    },
    playSong: function(songId) {
      return App.execute("command:audio:play", 'songid', songId);
    },
    addSong: function(songId) {
      return App.execute("command:audio:add", 'songid', songId);
    },
    localAddSong: function(songId) {
      return App.execute("localplaylist:addentity", 'songid', songId);
    },
    localPlaySong: function(model) {
      var localPlaylist;
      localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
      return localPlaylist.play(model.attributes);
    },
    downloadSong: function(model) {
      var files;
      files = App.request("command:kodi:controller", 'video', 'Files');
      return files.downloadFile(model.get('file'));
    },
    musicVideo: function(model) {
      var query;
      query = model.get('label') + ' ' + model.get('artist');
      return App.execute("youtube:search:view", query, function(view) {
        var $footer;
        $footer = $('<a>', {
          "class": 'btn btn-primary',
          href: 'https://www.youtube.com/results?search_query=' + query,
          target: '_blank'
        });
        $footer.html('More videos');
        return App.execute("ui:modal:show", query, view.render().$el, $footer);
      });
    }
  };
  return App.reqres.setHandler("song:list:view", function(songs, verbose) {
    if (verbose == null) {
      verbose = false;
    }
    return API.getSongsView(songs, verbose);
  });
});

this.Kodi.module("SongApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.Song = (function(_super) {
    __extends(Song, _super);

    function Song() {
      return Song.__super__.constructor.apply(this, arguments);
    }

    Song.prototype.template = 'apps/song/list/song';

    Song.prototype.tagName = "tr";

    Song.prototype.initialize = function() {
      var duration, menu;
      duration = helpers.global.secToTime(this.model.get('duration'));
      menu = {
        'song-localadd': 'Add to playlist',
        'song-download': 'Download Song',
        'song-localplay': 'Play in browser',
        'song-musicvideo': 'Music Video'
      };
      return this.model.set({
        displayDuration: helpers.global.formatTime(duration),
        menu: menu
      });
    };

    Song.prototype.triggers = {
      "click .play": "song:play",
      "dblclick .song-title": "song:play",
      "click .add": "song:add",
      "click .song-localadd": "song:localadd",
      "click .song-download": "song:download",
      "click .song-localplay": "song:localplay",
      "click .song-musicvideo": "song:musicvideo"
    };

    Song.prototype.events = {
      "click .dropdown > i": "populateMenu",
      "click .thumbs": "toggleThumbs"
    };

    Song.prototype.populateMenu = function() {
      var key, menu, val, _ref;
      menu = '';
      if (this.model.get('menu')) {
        _ref = this.model.get('menu');
        for (key in _ref) {
          val = _ref[key];
          menu += this.themeTag('li', {
            "class": key
          }, val);
        }
        return this.$el.find('.dropdown-menu').html(menu);
      }
    };

    Song.prototype.toggleThumbs = function() {
      App.request("thumbsup:toggle:entity", this.model);
      return this.$el.toggleClass('thumbs-up');
    };

    Song.prototype.attributes = function() {
      var classes;
      classes = ['song', 'table-row', 'can-play', 'item-song-' + this.model.get('songid')];
      if (App.request("thumbsup:check", this.model)) {
        classes.push('thumbs-up');
      }
      return {
        "class": classes.join(' ')
      };
    };

    Song.prototype.onShow = function() {
      $('.dropdown', this.$el).on('show.bs.dropdown', (function(_this) {
        return function() {
          return _this.$el.addClass('menu-open');
        };
      })(this));
      $('.dropdown', this.$el).on('hide.bs.dropdown', (function(_this) {
        return function() {
          return _this.$el.removeClass('menu-open');
        };
      })(this));
      return $('.dropdown', this.$el).on('click', function() {
        return $(this).removeClass('open').trigger('hide.bs.dropdown');
      });
    };

    return Song;

  })(App.Views.ItemView);
  return List.Songs = (function(_super) {
    __extends(Songs, _super);

    function Songs() {
      return Songs.__super__.constructor.apply(this, arguments);
    }

    Songs.prototype.childView = List.Song;

    Songs.prototype.tagName = "table";

    Songs.prototype.attributes = function() {
      var verbose;
      verbose = this.options.verbose ? 'verbose' : 'basic';
      return {
        "class": 'songs-table table table-hover ' + verbose
      };
    };

    return Songs;

  })(App.Views.CollectionView);
});

this.Kodi.module("StateApp", function(StateApp, App, Backbone, Marionette, $, _) {
  return StateApp.Base = (function(_super) {
    __extends(Base, _super);

    function Base() {
      return Base.__super__.constructor.apply(this, arguments);
    }

    Base.prototype.instanceSettings = {};

    Base.prototype.state = {
      player: 'kodi',
      media: 'audio',
      volume: 50,
      lastVolume: 50,
      muted: false,
      shuffled: false,
      repeat: 'off'
    };

    Base.prototype.playing = {
      playing: false,
      paused: false,
      playState: '',
      item: {},
      media: 'audio',
      itemChanged: false,
      latPlaying: '',
      canrepeat: true,
      canseek: true,
      canshuffle: true,
      partymode: false,
      percentage: 0,
      playlistid: 0,
      position: 0,
      speed: 0,
      time: {
        hours: 0,
        milliseconds: 0,
        minutes: 0,
        seconds: 0
      },
      totaltime: {
        hours: 0,
        milliseconds: 0,
        minutes: 0,
        seconds: 0
      }
    };

    Base.prototype.defaultPlayingItem = {
      thumbnail: '',
      fanart: '',
      id: 0,
      songid: 0,
      episodeid: 0,
      album: '',
      albumid: '',
      duration: 0,
      type: 'song'
    };

    Base.prototype.getState = function(key) {
      if (key == null) {
        key = 'all';
      }
      if (key === 'all') {
        return this.state;
      } else {
        return this.state[key];
      }
    };

    Base.prototype.setState = function(key, value) {
      return this.state[key] = value;
    };

    Base.prototype.getPlaying = function(key) {
      var ret;
      if (key == null) {
        key = 'all';
      }
      ret = this.playing;
      if (ret.item.length === 0) {
        ret.item = this.defaultPlayingItem;
      }
      if (key === 'all') {
        return this.playing;
      } else {
        return this.playing[key];
      }
    };

    Base.prototype.setPlaying = function(key, value) {
      return this.playing[key] = value;
    };

    Base.prototype.isPlaying = function() {
      return this.getPlaying('playing');
    };

    Base.prototype.isPlayingItemChanged = function() {
      return this.getPlaying('itemChanged');
    };

    Base.prototype.doCallback = function(callback, resp) {
      if (typeof callback === 'function') {
        return callback(resp);
      }
    };

    Base.prototype.getCurrentState = function(callback) {};

    Base.prototype.getCachedState = function() {
      return {
        state: this.state,
        playing: this.playing
      };
    };

    Base.prototype.setPlayer = function(player) {
      var $body;
      if (player == null) {
        player = 'kodi';
      }
      $body = App.getRegion('root').$el;
      $body.removeClassStartsWith('active-player-').addClass('active-player-' + player);
      return config.set('state', 'lastplayer', player);
    };

    Base.prototype.getPlayer = function() {
      var $body, player;
      player = 'kodi';
      $body = App.getRegion('root').$el;
      if ($body.hasClass('active-player-local')) {
        player = 'local';
      }
      return player;
    };

    return Base;

  })(Marionette.Object);
});

this.Kodi.module("StateApp.Kodi", function(StateApp, App, Backbone, Marionette, $, _) {
  return StateApp.State = (function(_super) {
    __extends(State, _super);

    function State() {
      return State.__super__.constructor.apply(this, arguments);
    }

    State.prototype.playerController = {};

    State.prototype.applicationController = {};

    State.prototype.playlistApi = {};

    State.prototype.initialize = function() {
      this.state = _.extend({}, this.state);
      this.playing = _.extend({}, this.playing);
      this.setState('player', 'kodi');
      this.playerController = App.request("command:kodi:controller", 'auto', 'Player');
      this.applicationController = App.request("command:kodi:controller", 'auto', 'Application');
      this.playlistApi = App.request("playlist:kodi:entity:api");
      App.reqres.setHandler("state:kodi:update", (function(_this) {
        return function(callback) {
          return _this.getCurrentState(callback);
        };
      })(this));
      return App.reqres.setHandler("state:kodi:get", (function(_this) {
        return function() {
          return _this.getCachedState();
        };
      })(this));
    };

    State.prototype.getCurrentState = function(callback) {
      return this.applicationController.getProperties((function(_this) {
        return function(properties) {
          _this.setState('volume', properties.volume);
          _this.setState('muted', properties.muted);
          App.reqres.setHandler('player:kodi:timer', 'stop');
          return _this.playerController.getPlaying(function(playing) {
            var autoMap, key, media, _i, _len;
            if (playing) {
              _this.setPlaying('playing', true);
              _this.setPlaying('paused', playing.properties.speed === 0);
              _this.setPlaying('playState', (playing.properties.speed === 0 ? 'paused' : 'playing'));
              autoMap = ['canrepeat', 'canseek', 'canshuffle', 'partymode', 'percentage', 'playlistid', 'position', 'speed', 'time', 'totaltime'];
              for (_i = 0, _len = autoMap.length; _i < _len; _i++) {
                key = autoMap[_i];
                if (playing.properties[key]) {
                  _this.setPlaying(key, playing.properties[key]);
                }
              }
              _this.setState('shuffled', playing.properties.shuffled);
              _this.setState('repeat', playing.properties.repeat);
              media = _this.playerController.playerIdToName(playing.properties.playlistid);
              if (media) {
                _this.setState('media', media);
              }
              if (playing.item.file !== _this.getPlaying('lastPlaying')) {
                _this.setPlaying('itemChanged', true);
                App.vent.trigger("state:kodi:itemchanged", _this.getCachedState());
              } else {
                _this.setPlaying('itemChanged', false);
              }
              _this.setPlaying('lastPlaying', playing.item.file);
              _this.setPlaying('item', _this.parseItem(playing.item, {
                media: media,
                playlistid: playing.properties.playlistid
              }));
              App.reqres.setHandler('player:kodi:timer', 'start');
            } else {
              _this.setPlaying('playing', false);
              _this.setPlaying('paused', false);
              _this.setPlaying('item', _this.defaultPlayingItem);
              _this.setPlaying('lstPlaying', '');
            }
            App.vent.trigger("state:kodi:changed", _this.getCachedState());
            App.vent.trigger("state:changed");
            return _this.doCallback(callback, _this.getCachedState());
          });
        };
      })(this));
    };

    State.prototype.parseItem = function(model, options) {
      model = this.playlistApi.parseItem(model, options);
      model = App.request("images:path:entity", model);
      model.url = helpers.url.get(model.type, model.id);
      model.url = helpers.url.playlistUrl(model);
      return model;
    };

    return State;

  })(App.StateApp.Base);
});

this.Kodi.module("StateApp.Kodi", function(StateApp, App, Backbone, Marionette, $, _) {
  return StateApp.Notifications = (function(_super) {
    __extends(Notifications, _super);

    function Notifications() {
      return Notifications.__super__.constructor.apply(this, arguments);
    }

    Notifications.prototype.wsActive = false;

    Notifications.prototype.wsObj = {};

    Notifications.prototype.getConnection = function() {
      var host, socketHost, socketPath, socketPort;
      host = config.get('static', 'socketsHost');
      socketPath = config.get('static', 'jsonRpcEndpoint');
      socketPort = config.get('static', 'socketsPort');
      socketHost = host === 'auto' ? location.hostname : host;
      return "ws://" + socketHost + ":" + socketPort + "/" + socketPath + "?kodi";
    };

    Notifications.prototype.initialize = function() {
      var msg, ws;
      if (window.WebSocket) {
        ws = new WebSocket(this.getConnection());
        ws.onopen = (function(_this) {
          return function(e) {
            helpers.debug.msg("Websockets Active");
            _this.wsActive = true;
            return App.vent.trigger("sockets:available");
          };
        })(this);
        ws.onerror = (function(_this) {
          return function(resp) {
            helpers.debug.msg(_this.socketConnectionErrorMsg(), "warning", resp);
            _this.wsActive = false;
            return App.vent.trigger("sockets:unavailable");
          };
        })(this);
        ws.onmessage = (function(_this) {
          return function(resp) {
            return _this.messageRecieved(resp);
          };
        })(this);
        ws.onclose = (function(_this) {
          return function(resp) {
            helpers.debug.msg("Websockets Closed", "warning", resp);
            return _this.wsActive = false;
          };
        })(this);
      } else {
        msg = "Your browser doesn't support websockets! Get with the times and update your browser.";
        helpers.debug.msg(t.gettext(msg), "warning", resp);
        App.vent.trigger("sockets:unavailable");
      }
      return App.reqres.setHandler("sockets:active", function() {
        return this.wsActive;
      });
    };

    Notifications.prototype.parseResponse = function(resp) {
      return jQuery.parseJSON(resp.data);
    };

    Notifications.prototype.messageRecieved = function(resp) {
      var data;
      data = this.parseResponse(resp);
      this.onMessage(data);
      return console.log(data);
    };

    Notifications.prototype.socketConnectionErrorMsg = function() {
      var msg;
      msg = "Failed to connect to websockets";
      return t.gettext(msg);
    };

    Notifications.prototype.refreshStateNow = function(callback) {
      App.vent.trigger("state:kodi:changed", this.getCachedState());
      return setTimeout(((function(_this) {
        return function() {
          return App.request("state:kodi:update", function(state) {
            if (callback) {
              return callback(state);
            }
          });
        };
      })(this)), 1000);
    };

    Notifications.prototype.onMessage = function(data) {
      var playerController, wait;
      switch (data.method) {
        case 'Player.OnPlay':
          this.setPlaying('paused', false);
          this.setPlaying('playState', 'playing');
          App.execute("player:kodi:timer", 'start');
          this.refreshStateNow();
          break;
        case 'Player.OnStop':
          this.setPlaying('playing', false);
          App.execute("player:kodi:timer", 'stop');
          this.refreshStateNow();
          break;
        case 'Player.OnPropertyChanged':
          this.refreshStateNow();
          break;
        case 'Player.OnPause':
          this.setPlaying('paused', true);
          this.setPlaying('playState', 'paused');
          App.execute("player:kodi:timer", 'stop');
          this.refreshStateNow();
          break;
        case 'Player.OnSeek':
          App.execute("player:kodi:timer", 'stop');
          this.refreshStateNow(function() {
            return App.execute("player:kodi:timer", 'start');
          });
          break;
        case 'Playlist.OnClear':
        case 'Playlist.OnAdd':
        case 'Playlist.OnRemove':
          playerController = App.request("command:kodi:controller", 'auto', 'Player');
          App.execute("playlist:refresh", 'kodi', playerController.playerIdToName(data.params.data.playlistid));
          this.refreshStateNow();
          break;
        case 'Application.OnVolumeChanged':
          this.setState('volume', data.params.data.volume);
          this.setState('muted', data.params.data.muted);
          this.refreshStateNow();
          break;
        case 'VideoLibrary.OnScanStarted':
          App.execute("notification:show", t.gettext("Video library scan started"));
          break;
        case 'VideoLibrary.OnScanFinished':
          App.execute("notification:show", t.gettext("Video library scan complete"));
          Backbone.fetchCache.clearItem('MovieCollection');
          Backbone.fetchCache.clearItem('TVShowCollection');
          break;
        case 'AudioLibrary.OnScanStarted':
          App.execute("notification:show", t.gettext("Audio library scan started"));
          break;
        case 'AudioLibrary.OnScanFinished':
          App.execute("notification:show", t.gettext("Audio library scan complete"));
          Backbone.fetchCache.clearItem('AlbumCollection');
          Backbone.fetchCache.clearItem('ArtistCollection');
          break;
        case 'Input.OnInputRequested':
          App.execute("input:textbox", '');
          wait = 60;
          App.inputTimeout = setTimeout((function() {
            var msg;
            msg = wait + t.gettext(' seconds ago, an input dialog opened on xbmc and it is still open! To prevent ' + 'a mainframe implosion, you should probably give me some text. I don\'t really care what it is at this point, ' + 'why not be creative? Do you have a ') + '<a href="http://goo.gl/PGE7wg" target="_blank">' + t.gettext('word of the day') + '</a>? ' + t.gettext('I won\'t tell...');
            App.execute("input:textbox", msg);
          }), 1000 * wait);
          break;
        case 'Input.OnInputFinished':
          clearTimeout(App.inputTimeout);
          App.execute("input:textbox:close");
          break;
        case 'System.OnQuit':
          App.execute("notification:show", t.gettext("Kodi has quit"));
          break;
      }
    };

    return Notifications;

  })(App.StateApp.Base);
});

this.Kodi.module("StateApp.Kodi", function(StateApp, App, Backbone, Marionette, $, _) {
  return StateApp.Polling = (function(_super) {
    __extends(Polling, _super);

    function Polling() {
      return Polling.__super__.constructor.apply(this, arguments);
    }

    Polling.prototype.commander = {};

    Polling.prototype.checkInterval = 10000;

    Polling.prototype.currentInterval = '';

    Polling.prototype.timeoutObj = {};

    Polling.prototype.failures = 0;

    Polling.prototype.maxFailures = 100;

    Polling.prototype.initialize = function() {
      var interval;
      interval = config.get('static', 'pollInterval');
      this.checkInterval = parseInt(interval);
      return this.currentInterval = this.checkInterval;
    };

    Polling.prototype.startPolling = function() {
      return this.update();
    };

    Polling.prototype.updateState = function() {
      var stateObj;
      stateObj = App.request("state:kodi");
      return stateObj.getCurrentState();
    };

    Polling.prototype.update = function() {
      if (App.kodiPolling.failures < App.kodiPolling.maxFailures) {
        App.kodiPolling.updateState();
        return App.kodiPolling.timeout = setTimeout(App.kodiPolling.ping, App.kodiPolling.currentInterval);
      } else {
        return App.execute("notification:show", t.gettext("Unable to communicate with Kodi in a long time. I think it's dead Jim!"));
      }
    };

    Polling.prototype.ping = function() {
      var commander;
      commander = App.request("command:kodi:controller", 'auto', 'Commander');
      commander.setOptions({
        timeout: 5000,
        error: function() {
          return App.kodiPolling.failure();
        }
      });
      commander.onError = function() {};
      return commander.sendCommand('Ping', [], function() {
        return App.kodiPolling.alive();
      });
    };

    Polling.prototype.alive = function() {
      App.kodiPolling.failures = 0;
      App.kodiPolling.currentInterval = App.kodiPolling.checkInterval;
      return App.kodiPolling.update();
    };

    Polling.prototype.failure = function() {
      App.kodiPolling.failures++;
      if (App.kodiPolling.failures > 10) {
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 5;
      }
      if (App.kodiPolling.failures > 20) {
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 10;
      }
      if (App.kodiPolling.failures > 30) {
        App.kodiPolling.currentInterval = App.kodiPolling.checkInterval * 30;
      }
      return App.kodiPolling.update();
    };

    return Polling;

  })(App.StateApp.Base);
});

this.Kodi.module("StateApp.Local", function(StateApp, App, Backbone, Marionette, $, _) {
  return StateApp.State = (function(_super) {
    __extends(State, _super);

    function State() {
      return State.__super__.constructor.apply(this, arguments);
    }

    State.prototype.initialize = function() {
      this.state = _.extend({}, this.state);
      this.playing = _.extend({}, this.playing);
      this.setState('player', 'local');
      this.setState('currentPlaybackId', 'browser-none');
      this.setState('localPlay', false);
      App.reqres.setHandler("state:local:update", (function(_this) {
        return function(callback) {
          return _this.getCurrentState(callback);
        };
      })(this));
      return App.reqres.setHandler("state:local:get", (function(_this) {
        return function() {
          return _this.getCachedState();
        };
      })(this));
    };

    State.prototype.getCurrentState = function(callback) {
      return this.doCallback(callback, this.getCachedState());
    };

    return State;

  })(App.StateApp.Base);
});

this.Kodi.module("StateApp", function(StateApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    setState: function(player) {
      if (player == null) {
        player = 'kodi';
      }
      this.setBodyClasses(player);
      this.setPlayingContent(player);
      this.setPlayerPlaying(player);
      this.setAppProperties(player);
      return this.setTitle(player);
    },
    playerClass: function(className, player) {
      return player + '-' + className;
    },
    setBodyClasses: function(player) {
      var $body, c, newClasses, stateObj, _i, _len, _results;
      stateObj = App.request("state:" + player);
      $body = App.getRegion('root').$el;
      $body.removeClassStartsWith(player + '-');
      newClasses = [];
      newClasses.push('shuffled-' + (stateObj.getState('shuffled') ? 'on' : 'off'));
      newClasses.push('partymode-' + (stateObj.getPlaying('partymode') ? 'on' : 'off'));
      newClasses.push('mute-' + (stateObj.getState('muted') ? 'on' : 'off'));
      newClasses.push('repeat-' + stateObj.getState('repeat'));
      newClasses.push('media-' + stateObj.getState('media'));
      if (stateObj.isPlaying()) {
        newClasses.push(stateObj.getPlaying('playState'));
      } else {
        newClasses.push('not-playing');
      }
      _results = [];
      for (_i = 0, _len = newClasses.length; _i < _len; _i++) {
        c = newClasses[_i];
        _results.push($body.addClass(this.playerClass(c, player)));
      }
      return _results;
    },
    setPlayingContent: function(player) {
      var $playlistCtx, className, item, playState, stateObj;
      stateObj = App.request("state:" + player);
      $playlistCtx = $('.media-' + stateObj.getState('media') + ' .' + player + '-playlist');
      $('.can-play').removeClassStartsWith(player + '-row-');
      $('.item', $playlistCtx).removeClassStartsWith('row-');
      if (stateObj.isPlaying()) {
        item = stateObj.getPlaying('item');
        playState = stateObj.getPlaying('playState');
        className = '.item-' + item.type + '-' + item.id;
        $(className).addClass(this.playerClass('row-' + playState, player));
        return $('.pos-' + stateObj.getPlaying('position'), $playlistCtx).addClass('row-' + playState);
      }
    },
    setPlayerPlaying: function(player) {
      var $dur, $img, $playerCtx, $subtitle, $title, item, stateObj;
      stateObj = App.request("state:" + player);
      $playerCtx = $('#player-' + player);
      $title = $('.playing-title', $playerCtx);
      $subtitle = $('.playing-subtitle', $playerCtx);
      $dur = $('.playing-time-duration', $playerCtx);
      $img = $('.playing-thumb', $playerCtx);
      if (stateObj.isPlaying()) {
        item = stateObj.getPlaying('item');
        $title.html(helpers.entities.playingLink(item));
        $subtitle.html(helpers.entities.getSubtitle(item));
        $dur.html(helpers.global.formatTime(stateObj.getPlaying('totaltime')));
        return $img.css("background-image", "url('" + item.thumbnail + "')");
      } else {
        $title.html(t.gettext('Nothing Playing'));
        $subtitle.html('');
        $dur.html('0');
        return $img.attr('src', App.request("images:path:get"));
      }
    },
    setAppProperties: function(player) {
      var $playerCtx, stateObj;
      stateObj = App.request("state:" + player);
      $playerCtx = $('#player-' + player);
      return $('.volume', $playerCtx).val(stateObj.getState('volume'));
    },
    setTitle: function(player) {
      var stateObj;
      if (player === 'kodi') {
        stateObj = App.request("state:" + player);
        if (stateObj.isPlaying() && stateObj.getPlaying('playState') === 'playing') {
          return helpers.global.appTitle(stateObj.getPlaying('item'));
        } else {
          return helpers.global.appTitle();
        }
      }
    },
    initKodiState: function() {
      App.kodiState = new StateApp.Kodi.State();
      App.localState = new StateApp.Local.State();
      App.kodiState.setPlayer(config.get('state', 'lastplayer', 'kodi'));
      App.kodiState.getCurrentState(function(state) {
        API.setState('kodi');
        App.kodiSockets = new StateApp.Kodi.Notifications();
        App.kodiPolling = new StateApp.Kodi.Polling();
        App.vent.on("sockets:unavailable", function() {
          return App.kodiPolling.startPolling();
        });
        App.vent.on("playlist:rendered", function() {
          return App.request("playlist:refresh", App.kodiState.getState('player'), App.kodiState.getState('media'));
        });
        App.vent.on("state:content:updated", function() {
          API.setPlayingContent('kodi');
          return API.setPlayingContent('local');
        });
        App.vent.on("state:kodi:changed", function(state) {
          return API.setState('kodi');
        });
        App.vent.on("state:local:changed", function(state) {
          return API.setState('local');
        });
        App.vent.on("state:player:updated", function(player) {
          return API.setPlayerPlaying(player);
        });
        return App.vent.trigger("state:initialized");
      });
      App.reqres.setHandler("state:kodi", function() {
        return App.kodiState;
      });
      App.reqres.setHandler("state:local", function() {
        return App.localState;
      });
      App.reqres.setHandler("state:current", function() {
        var stateObj;
        stateObj = App.kodiState.getPlayer() === 'kodi' ? App.kodiState : App.localState;
        return stateObj;
      });
      return App.vent.trigger("state:changed");
    }
  };
  return App.addInitializer(function() {
    return API.initKodiState();
  });
});

this.Kodi.module("ThumbsApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var entities;
      this.layout = this.getLayout();
      entities = ['song', 'artist', 'album', 'tvshow', 'movie'];
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          var entity, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = entities.length; _i < _len; _i++) {
            entity = entities[_i];
            _results.push(_this.getResult(entity));
          }
          return _results;
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayout = function() {
      return new List.ListLayout();
    };

    Controller.prototype.getResult = function(entity) {
      var limit, loaded, query, setView, view;
      query = this.getOption('query');
      limit = this.getOption('media') === 'all' ? 'limit' : 'all';
      loaded = App.request("thumbsup:get:entities", entity);
      if (loaded.length > 0) {
        view = App.request("" + entity + ":list:view", loaded, true);
        setView = new List.ListSet({
          entity: entity
        });
        App.listenTo(setView, "show", (function(_this) {
          return function() {
            return setView.regionResult.show(view);
          };
        })(this));
        return this.layout["" + entity + "Set"].show(setView);
      }
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("ThumbsApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.template = 'apps/thumbs/list/thumbs_layout';

    ListLayout.prototype.className = "thumbs-page set-page";

    ListLayout.prototype.regions = {
      artistSet: '.entity-set-artist',
      albumSet: '.entity-set-album',
      songSet: '.entity-set-song',
      movieSet: '.entity-set-movie',
      tvshowSet: '.entity-set-tvshow'
    };

    return ListLayout;

  })(App.Views.LayoutView);
  return List.ListSet = (function(_super) {
    __extends(ListSet, _super);

    function ListSet() {
      return ListSet.__super__.constructor.apply(this, arguments);
    }

    ListSet.prototype.template = 'apps/thumbs/list/thumbs_set';

    ListSet.prototype.className = "thumbs-set";

    ListSet.prototype.onRender = function() {
      if (this.options) {
        if (this.options.entity) {
          return $('h2.set-header', this.$el).html(t.gettext(this.options.entity + 's'));
        }
      }
    };

    ListSet.prototype.regions = {
      regionResult: '.set-results'
    };

    return ListSet;

  })(App.Views.LayoutView);
});

this.Kodi.module("ThumbsApp", function(ThumbsApp, App, Backbone, Marionette, $, _) {
  var API;
  ThumbsApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "thumbsup": "list"
    };

    return Router;

  })(App.Router.Base);
  API = {
    list: function() {
      return new ThumbsApp.List.Controller();
    }
  };
  return App.on("before:start", function() {
    return new ThumbsApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("TVShowApp.Episode", function(Episode, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getEpisodeList: function(collection) {
      var view;
      view = new Episode.Episodes({
        collection: collection
      });
      App.listenTo(view, 'childview:episode:play', function(parent, viewItem) {
        return App.execute('episode:action', 'play', viewItem);
      });
      App.listenTo(view, 'childview:episode:add', function(parent, viewItem) {
        return App.execute('episode:action', 'add', viewItem);
      });
      App.listenTo(view, 'childview:episode:localplay', function(parent, viewItem) {
        return App.execute('episode:action', 'localplay', viewItem);
      });
      App.listenTo(view, 'childview:episode:download', function(parent, viewItem) {
        return App.execute('episode:action', 'download', viewItem);
      });
      App.listenTo(view, 'childview:episode:watched', function(parent, viewItem) {
        parent.$el.toggleClass('is-watched');
        return App.execute('episode:action', 'toggleWatched', viewItem);
      });
      return view;
    },
    bindTriggers: function(view) {
      App.listenTo(view, 'episode:play', function(viewItem) {
        return App.execute('episode:action', 'play', viewItem);
      });
      App.listenTo(view, 'episode:add', function(viewItem) {
        return App.execute('episode:action', 'add', viewItem);
      });
      App.listenTo(view, 'episode:localplay', function(viewItem) {
        return App.execute('episode:action', 'localplay', viewItem);
      });
      App.listenTo(view, 'episode:download', function(viewItem) {
        return App.execute('episode:action', 'download', viewItem);
      });
      return App.listenTo(view, 'episode:watched', function(viewItem) {
        parent.$el.toggleClass('is-watched');
        return App.execute('episode:action', 'toggleWatched', viewItem);
      });
    }
  };
  Episode.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var episode, episodeId, id, seasonId;
      id = parseInt(options.id);
      seasonId = parseInt(options.season);
      episodeId = parseInt(options.episodeid);
      episode = App.request("episode:entity", episodeId);
      return App.execute("when:entity:fetched", episode, (function(_this) {
        return function() {
          console.log(episode);
          _this.layout = _this.getLayoutView(episode);
          _this.listenTo(_this.layout, "show", function() {
            _this.getDetailsLayoutView(episode);
            return _this.getContentView(episode);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(tvshow) {
      return new Episode.PageLayout({
        tvshow: tvshow
      });
    };

    Controller.prototype.getDetailsLayoutView = function(episode) {
      var headerLayout;
      headerLayout = new Episode.HeaderLayout({
        model: episode
      });
      this.listenTo(headerLayout, "show", (function(_this) {
        return function() {
          var detail, teaser;
          teaser = new Episode.EpisodeDetailTeaser({
            model: episode
          });
          detail = new Episode.Details({
            model: episode
          });
          API.bindTriggers(detail);
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        };
      })(this));
      return this.layout.regionHeader.show(headerLayout);
    };

    Controller.prototype.getContentView = function(episode) {
      var contentLayout;
      contentLayout = new Episode.Content({
        model: episode
      });
      App.listenTo(contentLayout, 'show', (function(_this) {
        return function() {
          if (episode.get('cast').length > 0) {
            return contentLayout.regionCast.show(_this.getCast(episode));
          }
        };
      })(this));
      return this.layout.regionContent.show(contentLayout);
    };

    Controller.prototype.getCast = function(episode) {
      return App.request('cast:list:view', episode.get('cast'), 'tvshows');
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("episode:list:view", function(collection) {
    return API.getEpisodeList(collection);
  });
});

this.Kodi.module("TVShowApp.Episode", function(Episode, App, Backbone, Marionette, $, _) {
  Episode.EpisodeTeaser = (function(_super) {
    __extends(EpisodeTeaser, _super);

    function EpisodeTeaser() {
      return EpisodeTeaser.__super__.constructor.apply(this, arguments);
    }

    EpisodeTeaser.prototype.triggers = {
      "click .play": "episode:play",
      "click .watched": "episode:watched",
      "click .add": "episode:add",
      "click .localplay": "episode:localplay",
      "click .download": "episode:download"
    };

    EpisodeTeaser.prototype.initialize = function() {
      EpisodeTeaser.__super__.initialize.apply(this, arguments);
      if (this.model != null) {
        this.model.set(this.getMeta());
        this.model.set({
          actions: {
            watched: 'Watched'
          }
        });
        return this.model.set({
          menu: {
            add: 'Add to Kodi playlist',
            divider: '',
            download: 'Download',
            localplay: 'Play in browser'
          }
        });
      }
    };

    EpisodeTeaser.prototype.attributes = function() {
      var classes;
      classes = ['card'];
      if (helpers.entities.isWatched(this.model)) {
        classes.push('is-watched');
      }
      return {
        "class": classes.join(' ')
      };
    };

    EpisodeTeaser.prototype.getMeta = function() {
      var epNum, epNumFull, showLink;
      epNum = this.themeTag('span', {
        "class": 'ep-num'
      }, this.model.get('season') + 'x' + this.model.get('episode') + ' ');
      epNumFull = this.themeTag('span', {
        "class": 'ep-num-full'
      }, t.gettext('Episode') + ' ' + this.model.get('episode'));
      showLink = this.themeLink(this.model.get('showtitle') + ' ', 'tvshow/' + this.model.get('tvshowid'), {
        className: 'show-name'
      });
      return {
        label: epNum + this.model.get('title'),
        subtitle: showLink + epNumFull
      };
    };

    return EpisodeTeaser;

  })(App.Views.CardView);
  Episode.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "episode-empty-result";

    return Empty;

  })(App.Views.EmptyView);
  Episode.Episodes = (function(_super) {
    __extends(Episodes, _super);

    function Episodes() {
      return Episodes.__super__.constructor.apply(this, arguments);
    }

    Episodes.prototype.childView = Episode.EpisodeTeaser;

    Episodes.prototype.emptyView = Episode.Empty;

    Episodes.prototype.tagName = "ul";

    Episodes.prototype.className = "card-grid--episode";

    return Episodes;

  })(App.Views.CollectionView);
  Episode.PageLayout = (function(_super) {
    __extends(PageLayout, _super);

    function PageLayout() {
      return PageLayout.__super__.constructor.apply(this, arguments);
    }

    PageLayout.prototype.className = 'episode-show detail-container';

    return PageLayout;

  })(App.Views.LayoutWithHeaderView);
  Episode.HeaderLayout = (function(_super) {
    __extends(HeaderLayout, _super);

    function HeaderLayout() {
      return HeaderLayout.__super__.constructor.apply(this, arguments);
    }

    HeaderLayout.prototype.className = 'episode-details';

    return HeaderLayout;

  })(App.Views.LayoutDetailsHeaderView);
  Episode.Details = (function(_super) {
    __extends(Details, _super);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.template = 'apps/tvshow/episode/details_meta';

    Details.prototype.triggers = {
      'click .play': 'episode:play',
      'click .add': 'episode:add',
      'click .stream': 'episode:localplay',
      'click .download': 'episode:download'
    };

    return Details;

  })(App.Views.ItemView);
  Episode.EpisodeDetailTeaser = (function(_super) {
    __extends(EpisodeDetailTeaser, _super);

    function EpisodeDetailTeaser() {
      return EpisodeDetailTeaser.__super__.constructor.apply(this, arguments);
    }

    EpisodeDetailTeaser.prototype.tagName = "div";

    EpisodeDetailTeaser.prototype.className = "card-detail";

    EpisodeDetailTeaser.prototype.triggers = {
      "click .menu": "episode-menu:clicked"
    };

    return EpisodeDetailTeaser;

  })(App.Views.CardView);
  return Episode.Content = (function(_super) {
    __extends(Content, _super);

    function Content() {
      return Content.__super__.constructor.apply(this, arguments);
    }

    Content.prototype.template = 'apps/tvshow/episode/content';

    Content.prototype.className = "episode-content content-sections";

    Content.prototype.regions = {
      regionCast: '.region-cast'
    };

    return Content;

  })(App.Views.LayoutView);
});

this.Kodi.module("TVShowApp.Landing", function(Landing, App, Backbone, Marionette, $, _) {
  return Landing.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.subNavId = 21;

    Controller.prototype.initialize = function() {
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", (function(_this) {
        return function() {
          _this.getPageView();
          return _this.getSubNav();
        };
      })(this));
      return App.regionContent.show(this.layout);
    };

    Controller.prototype.getLayoutView = function() {
      return new Landing.Layout();
    };

    Controller.prototype.getSubNav = function() {
      var subNav;
      subNav = App.request("navMain:children:show", this.subNavId, 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    };

    Controller.prototype.getPageView = function() {
      this.page = new Landing.Page();
      this.listenTo(this.page, "show", (function(_this) {
        return function() {
          return _this.renderRecentlyAdded();
        };
      })(this));
      return this.layout.regionContent.show(this.page);
    };

    Controller.prototype.renderRecentlyAdded = function() {
      var collection;
      collection = App.request("episode:recentlyadded:entities");
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var view;
          view = App.request("episode:list:view", collection);
          return _this.page.regionRecentlyAdded.show(view);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("TVShowApp.Landing", function(Landing, App, Backbone, Marionette, $, _) {
  Landing.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.className = "movie-landing landing-page";

    return Layout;

  })(App.Views.LayoutWithSidebarFirstView);
  return Landing.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.template = 'apps/movie/landing/landing';

    Page.prototype.className = "movie-recent";

    Page.prototype.regions = {
      regionRecentlyAdded: '.region-recently-added'
    };

    return Page;

  })(App.Views.LayoutView);
});

this.Kodi.module("TVShowApp.List", function(List, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getTVShowsList: function(tvshows, set) {
      var view, viewName;
      if (set == null) {
        set = false;
      }
      viewName = set ? 'TVShowsSet' : 'TVShows';
      view = new List[viewName]({
        collection: tvshows
      });
      App.listenTo(view, 'childview:tvshow:play', function(list, item) {
        var playlist;
        playlist = App.request("command:kodi:controller", 'video', 'PlayList');
        return playlist.play('tvshowid', item.model.get('tvshowid'));
      });
      return view;
    }
  };
  List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var collection;
      collection = App.request("tvshow:entities");
      collection.availableFilters = this.getAvailableFilters();
      collection.sectionId = 21;
      App.request('filter:init', this.getAvailableFilters());
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(collection);
          _this.listenTo(_this.layout, "show", function() {
            _this.getFiltersView(collection);
            return _this.renderList(collection);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(tvshows) {
      return new List.ListLayout({
        collection: tvshows
      });
    };

    Controller.prototype.getAvailableFilters = function() {
      return {
        sort: ['title', 'year', 'dateadded', 'rating'],
        filter: ['year', 'genre', 'unwatched', 'cast']
      };
    };

    Controller.prototype.getFiltersView = function(collection) {
      var filters;
      filters = App.request('filter:show', collection);
      this.layout.regionSidebarFirst.show(filters);
      return this.listenTo(filters, "filter:changed", (function(_this) {
        return function() {
          return _this.renderList(collection);
        };
      })(this));
    };

    Controller.prototype.renderList = function(collection) {
      var filteredCollection, view;
      App.execute("loading:show:view", this.layout.regionContent);
      filteredCollection = App.request('filter:apply:entites', collection);
      view = API.getTVShowsList(filteredCollection);
      return this.layout.regionContent.show(view);
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("tvshow:list:view", function(collection) {
    return API.getTVShowsList(collection, true);
  });
});

this.Kodi.module("TVShowApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "tvshow-list with-filters";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.TVShowTeaser = (function(_super) {
    __extends(TVShowTeaser, _super);

    function TVShowTeaser() {
      return TVShowTeaser.__super__.constructor.apply(this, arguments);
    }

    TVShowTeaser.prototype.triggers = {
      "click .play": "tvshow:play",
      "click .menu": "tvshow-menu:clicked"
    };

    TVShowTeaser.prototype.initialize = function() {
      var subtitle;
      TVShowTeaser.__super__.initialize.apply(this, arguments);
      subtitle = '';
      subtitle += ' ' + this.model.get('rating');
      return this.model.set({
        subtitle: subtitle
      });
    };

    return TVShowTeaser;

  })(App.Views.CardView);
  List.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "tvshow-empty-result";

    return Empty;

  })(App.Views.EmptyView);
  List.TVShows = (function(_super) {
    __extends(TVShows, _super);

    function TVShows() {
      return TVShows.__super__.constructor.apply(this, arguments);
    }

    TVShows.prototype.childView = List.TVShowTeaser;

    TVShows.prototype.emptyView = List.Empty;

    TVShows.prototype.tagName = "ul";

    TVShows.prototype.className = "card-grid--tall";

    return TVShows;

  })(App.Views.VirtualListView);
  return List.TVShowsSet = (function(_super) {
    __extends(TVShowsSet, _super);

    function TVShowsSet() {
      return TVShowsSet.__super__.constructor.apply(this, arguments);
    }

    TVShowsSet.prototype.childView = List.TVShowTeaser;

    TVShowsSet.prototype.emptyView = List.Empty;

    TVShowsSet.prototype.tagName = "ul";

    TVShowsSet.prototype.className = "card-grid--tall";

    return TVShowsSet;

  })(App.Views.CollectionView);
});

this.Kodi.module("TVShowApp.Season", function(Season, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getSeasonList: function(collection) {
      var view;
      view = new Season.Seasons({
        collection: collection
      });
      App.listenTo(view, 'childview:season:play', function(list, item) {
        var playlist;
        return playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      });
      return view;
    }
  };
  Season.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var id, seasonId, tvshow;
      id = parseInt(options.id);
      seasonId = parseInt(options.season);
      tvshow = App.request("tvshow:entity", id);
      return App.execute("when:entity:fetched", tvshow, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(tvshow);
          _this.listenTo(_this.layout, "show", function() {
            _this.getDetailsLayoutView(tvshow, seasonId);
            return _this.getEpisodes(tvshow, seasonId);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(tvshow) {
      return new Season.PageLayout({
        tvshow: tvshow
      });
    };

    Controller.prototype.getDetailsLayoutView = function(tvshow, seasonId) {
      var seasons;
      seasons = App.request("season:entities", tvshow.get('id'));
      return App.execute("when:entity:fetched", seasons, (function(_this) {
        return function() {
          var headerLayout, season;
          season = seasons.findWhere({
            season: seasonId
          });
          tvshow.set({
            season: seasonId,
            thumbnail: season.get('thumbnail'),
            seasons: seasons
          });
          console.log(tvshow);
          headerLayout = new Season.HeaderLayout({
            model: tvshow
          });
          _this.listenTo(headerLayout, "show", function() {
            var detail, teaser;
            teaser = new Season.SeasonDetailTeaser({
              model: tvshow
            });
            detail = new Season.Details({
              model: tvshow
            });
            headerLayout.regionSide.show(teaser);
            return headerLayout.regionMeta.show(detail);
          });
          return _this.layout.regionHeader.show(headerLayout);
        };
      })(this));
    };

    Controller.prototype.getEpisodes = function(tvshow, seasonId) {
      var collection;
      collection = App.request("episode:entities", tvshow.get('tvshowid'), seasonId);
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var view;
          collection.sortCollection('episode', 'asc');
          view = App.request("episode:list:view", collection);
          return _this.layout.regionContent.show(view);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
  return App.reqres.setHandler("season:list:view", function(collection) {
    return API.getSeasonList(collection);
  });
});

this.Kodi.module("TVShowApp.Season", function(Season, App, Backbone, Marionette, $, _) {
  Season.SeasonTeaser = (function(_super) {
    __extends(SeasonTeaser, _super);

    function SeasonTeaser() {
      return SeasonTeaser.__super__.constructor.apply(this, arguments);
    }

    SeasonTeaser.prototype.triggers = {
      "click .play": "season:play"
    };

    SeasonTeaser.prototype.initialize = function() {
      SeasonTeaser.__super__.initialize.apply(this, arguments);
      return this.model.set({
        label: 'Season ' + this.model.get('season')
      });
    };

    return SeasonTeaser;

  })(App.Views.CardView);
  Season.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "season-empty-result";

    return Empty;

  })(App.Views.EmptyView);
  Season.Seasons = (function(_super) {
    __extends(Seasons, _super);

    function Seasons() {
      return Seasons.__super__.constructor.apply(this, arguments);
    }

    Seasons.prototype.childView = Season.SeasonTeaser;

    Seasons.prototype.emptyView = Season.Empty;

    Seasons.prototype.tagName = "ul";

    Seasons.prototype.className = "card-grid--tall";

    return Seasons;

  })(App.Views.CollectionView);
  Season.PageLayout = (function(_super) {
    __extends(PageLayout, _super);

    function PageLayout() {
      return PageLayout.__super__.constructor.apply(this, arguments);
    }

    PageLayout.prototype.className = 'season-show detail-container';

    return PageLayout;

  })(App.Views.LayoutWithHeaderView);
  Season.HeaderLayout = (function(_super) {
    __extends(HeaderLayout, _super);

    function HeaderLayout() {
      return HeaderLayout.__super__.constructor.apply(this, arguments);
    }

    HeaderLayout.prototype.className = 'season-details';

    return HeaderLayout;

  })(App.Views.LayoutDetailsHeaderView);
  Season.Details = (function(_super) {
    __extends(Details, _super);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.template = 'apps/tvshow/season/details_meta';

    return Details;

  })(App.Views.ItemView);
  return Season.SeasonDetailTeaser = (function(_super) {
    __extends(SeasonDetailTeaser, _super);

    function SeasonDetailTeaser() {
      return SeasonDetailTeaser.__super__.constructor.apply(this, arguments);
    }

    SeasonDetailTeaser.prototype.tagName = "div";

    SeasonDetailTeaser.prototype.className = "card-detail";

    SeasonDetailTeaser.prototype.triggers = {
      "click .menu": "season-menu:clicked"
    };

    return SeasonDetailTeaser;

  })(App.Views.CardView);
});

this.Kodi.module("TVShowApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  return Show.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function(options) {
      var id, tvshow;
      id = parseInt(options.id);
      tvshow = App.request("tvshow:entity", id);
      return App.execute("when:entity:fetched", tvshow, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(tvshow);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", 'none');
          });
          _this.listenTo(_this.layout, "show", function() {
            _this.getDetailsLayoutView(tvshow);
            return _this.getSeasons(tvshow);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(tvshow) {
      return new Show.PageLayout({
        model: tvshow
      });
    };

    Controller.prototype.getDetailsLayoutView = function(tvshow) {
      var headerLayout;
      headerLayout = new Show.HeaderLayout({
        model: tvshow
      });
      this.listenTo(headerLayout, "show", (function(_this) {
        return function() {
          var detail, teaser;
          teaser = new Show.TVShowTeaser({
            model: tvshow
          });
          detail = new Show.Details({
            model: tvshow
          });
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        };
      })(this));
      return this.layout.regionHeader.show(headerLayout);
    };

    Controller.prototype.getSeasons = function(tvshow) {
      var collection;
      collection = App.request("season:entities", tvshow.get('tvshowid'));
      return App.execute("when:entity:fetched", collection, (function(_this) {
        return function() {
          var view;
          view = App.request("season:list:view", collection);
          return _this.layout.regionContent.show(view);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("TVShowApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  Show.PageLayout = (function(_super) {
    __extends(PageLayout, _super);

    function PageLayout() {
      return PageLayout.__super__.constructor.apply(this, arguments);
    }

    PageLayout.prototype.className = 'tvshow-show detail-container';

    return PageLayout;

  })(App.Views.LayoutWithHeaderView);
  Show.HeaderLayout = (function(_super) {
    __extends(HeaderLayout, _super);

    function HeaderLayout() {
      return HeaderLayout.__super__.constructor.apply(this, arguments);
    }

    HeaderLayout.prototype.className = 'tvshow-details';

    return HeaderLayout;

  })(App.Views.LayoutDetailsHeaderView);
  Show.Details = (function(_super) {
    __extends(Details, _super);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.template = 'apps/tvshow/show/details_meta';

    return Details;

  })(App.Views.ItemView);
  return Show.TVShowTeaser = (function(_super) {
    __extends(TVShowTeaser, _super);

    function TVShowTeaser() {
      return TVShowTeaser.__super__.constructor.apply(this, arguments);
    }

    TVShowTeaser.prototype.tagName = "div";

    TVShowTeaser.prototype.className = "card-detail";

    TVShowTeaser.prototype.triggers = {
      "click .menu": "tvshow-menu:clicked"
    };

    return TVShowTeaser;

  })(App.Views.CardView);
});

this.Kodi.module("TVShowApp", function(TVShowApp, App, Backbone, Marionette, $, _) {
  var API;
  TVShowApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "tvshows/recent": "landing",
      "tvshows": "list",
      "tvshow/:tvshowid": "view",
      "tvshow/:tvshowid/:season": "season",
      "tvshow/:tvshowid/:season/:episodeid": "episode"
    };

    return Router;

  })(App.Router.Base);
  API = {
    landing: function() {
      return new TVShowApp.Landing.Controller();
    },
    list: function() {
      return new TVShowApp.List.Controller();
    },
    view: function(tvshowid) {
      return new TVShowApp.Show.Controller({
        id: tvshowid
      });
    },
    season: function(tvshowid, season) {
      return new TVShowApp.Season.Controller({
        id: tvshowid,
        season: season
      });
    },
    episode: function(tvshowid, season, episodeid) {
      return new TVShowApp.Episode.Controller({
        id: tvshowid,
        season: season,
        episodeid: episodeid
      });
    },
    episodeAction: function(op, view) {
      var files, model, playlist, videoLib;
      model = view.model;
      playlist = App.request("command:kodi:controller", 'video', 'PlayList');
      files = App.request("command:kodi:controller", 'video', 'Files');
      videoLib = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      switch (op) {
        case 'play':
          return playlist.play('episodeid', model.get('episodeid'));
        case 'add':
          return playlist.add('episodeid', model.get('episodeid'));
        case 'localplay':
          return files.videoStream(model.get('file'));
        case 'download':
          return files.downloadFile(model.get('file'));
        case 'toggleWatched':
          return videoLib.toggleWatched(model);
      }
    }
  };
  App.commands.setHandler('episode:action', function(op, view) {
    return API.episodeAction(op, view);
  });
  return App.on("before:start", function() {
    return new TVShowApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("UiApp", function(UiApp, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    openModal: function(title, msg, open, style) {
      var $body, $modal, $title;
      if (open == null) {
        open = true;
      }
      if (style == null) {
        style = '';
      }
      $title = App.getRegion('regionModalTitle').$el;
      $body = App.getRegion('regionModalBody').$el;
      $modal = App.getRegion('regionModal').$el;
      $modal.removeClassStartsWith('style-');
      $modal.addClass('style-' + style);
      $title.html(title);
      $body.html(msg);
      if (open) {
        $modal.modal();
      }
      $modal.on('hidden.bs.modal', function(e) {
        return $body.html('');
      });
      return $modal;
    },
    closeModal: function() {
      App.getRegion('regionModal').$el.modal('hide');
      return $('.modal-body').html('');
    },
    closeModalButton: function() {
      return API.getButton('Close', 'default').on('click', function() {
        return API.closeModal();
      });
    },
    getModalButtonContainer: function() {
      return App.getRegion('regionModalFooter').$el.empty();
    },
    getButton: function(text, type) {
      if (type == null) {
        type = 'primary';
      }
      return $('<button>').addClass('btn btn-' + type).html(text);
    },
    defaultButtons: function(callback) {
      var $ok;
      $ok = API.getButton('Ok', 'primary').on('click', function() {
        if (callback) {
          callback();
        }
        return API.closeModal();
      });
      return API.getModalButtonContainer().append(API.closeModalButton()).append($ok);
    },
    playerMenu: function(op) {
      var $el, openClass;
      if (op == null) {
        op = 'toggle';
      }
      $el = $('.player-menu-wrapper');
      openClass = 'opened';
      switch (op) {
        case 'open':
          return $el.addClass(openClass);
        case 'close':
          return $el.removeClass(openClass);
        default:
          return $el.toggleClass(openClass);
      }
    }
  };
  App.commands.setHandler("ui:textinput:show", function(title, msg, callback, open) {
    var $input, $msg;
    if (msg == null) {
      msg = '';
    }
    if (open == null) {
      open = true;
    }
    $input = $('<input>', {
      id: 'text-input',
      "class": 'form-control',
      type: 'text'
    }).on('keyup', function(e) {
      if (e.keyCode === 13 && callback) {
        callback($('#text-input').val());
        return API.closeModal();
      }
    });
    $msg = $('<p>').html(msg);
    API.defaultButtons(function() {
      return callback($('#text-input').val());
    });
    API.openModal(title, $msg, callback, open);
    App.getRegion('regionModalBody').$el.append($input.wrap('<div class="form-control-wrapper"></div>')).find('input').first().focus();
    return $.material.init();
  });
  App.commands.setHandler("ui:modal:close", function() {
    return API.closeModal();
  });
  App.commands.setHandler("ui:modal:show", function(title, msg, footer) {
    if (msg == null) {
      msg = '';
    }
    if (footer == null) {
      footer = '';
    }
    API.getModalButtonContainer().html(footer);
    return API.openModal(title, msg, open);
  });
  App.commands.setHandler("ui:modal:form:show", function(title, msg) {
    if (msg == null) {
      msg = '';
    }
    return API.openModal(title, msg, true, 'form');
  });
  App.commands.setHandler("ui:modal:close", function() {
    return API.closeModal();
  });
  App.commands.setHandler("ui:modal:youtube", function(title, videoid) {
    var msg;
    API.getModalButtonContainer().html('');
    msg = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoid + '?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>';
    return API.openModal(title, msg, true, 'video');
  });
  App.commands.setHandler("ui:playermenu", function(op) {
    return API.playerMenu(op);
  });
  return App.vent.on("shell:ready", (function(_this) {
    return function(options) {
      return $('html').on('click', function() {
        return API.playerMenu('close');
      });
    };
  })(this));
});
