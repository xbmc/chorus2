var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

this.helpers = {};

this.config = {
  "static": {
    jsonRpcEndpoint: 'jsonrpc'
  }
};

this.Kodi = (function(Backbone, Marionette) {
  var App;
  App = new Backbone.Marionette.Application();
  App.addRegions({
    root: "body"
  });
  App.vent.on("shell:ready", (function(_this) {
    return function(options) {
      return Backbone.history.start();
    };
  })(this));
  return App;
})(Backbone, Marionette);

this.Kodi.start();


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
  if ((helpers.cache.store[key] != null) && helpers.cache.store[key].expires <= helpers.global.time()) {
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
  url: config.get('static', 'jsonRpcEndpoint'),
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

helpers.debug = {};


/*
  Debug styles

  @param severity
  The severity level: info, success, warning, error
 */

helpers.debug.consoleStyle = function(severity) {
  var defaults, mods, prop, styles;
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
  if (typeof style !== "undefined" && style !== null) {
    defaults.background = mods[severity];
  }
  for (prop in defaults) {
    styles.push(prop + ": " + defaults[prop]);
  }
  return styles.join("; ");
};


/*
  Log a deubg message.
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
    return msg;
  } else {
    return console.log("%c Bam! Error occurred in: " + caller, helpers.debug.consoleStyle(severity), data);
  }
};


/*
  Request Error.
 */

helpers.debug.rpcError = function(obj) {
  var caller;
  caller = arguments.callee.caller.toString();
  return helpers.debug.log("jsonRPC Rquequest", obj, 'error', caller);
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

helpers.global.formatTime = function(time) {
  var timeStr;
  if (time == null) {
    return 0;
  } else {
    timeStr = (time.hours > 0 ? time.hours + ":" : "") + (time.hours > 0 && time.minutes < 10 ? "0" : "") + (time.minutes > 0 ? time.minutes + ":" : "") + ((time.minutes > 0 || time.hours > 0) && time.seconds < 10 ? "0" : "") + time.seconds;
    return timeStr;
  }
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
  tvseason: 'tvshow/:tvshowid/:id',
  tvepisode: 'tvshow/:tvshowid/:tvseason/:id',
  file: 'browser/file/:id'
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

    return Collection;

  })(Backbone.Collection);
});

this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
  return Entities.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      this.saveError = __bind(this.saveError, this);
      this.saveSuccess = __bind(this.saveSuccess, this);
      return Model.__super__.constructor.apply(this, arguments);
    }

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
      id: 0,
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

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    initialize: function() {
      return $.jsonrpc.defaultUrl = config.get('static', 'jsonRpcEndpoint');
    },
    multipleCommands: function(commands, callback) {
      var obj;
      obj = $.jsonrpc(commands);
      obj.fail(function(error) {
        return helpers.debug.rpcError(error);
      });
      return obj;
    },
    singleCommand: function(command, params) {
      var obj;
      command = {
        method: command
      };
      if ((params != null) && params.length > 0) {
        command.params = params;
      }
      obj = API.multipleCommands([command]);
      return obj;
    },
    parseResponse: function(response) {
      var result, results, _i, _len;
      results = [];
      console.log(response);
      for (_i = 0, _len = response.length; _i < _len; _i++) {
        result = response[_i];
        if (result.result) {
          results.push(result.result);
        } else {
          helpers.debug.rpcError(result.error);
        }
      }
      return results;
    }
  };
  App.commands.setHandler("when:commands:fetched", function(commands, callback) {
    var request;
    request = API.multipleCommands(commands);
    return request.done(function(response) {
      var result;
      result = API.parseResponse(response);
      return callback(result);
    });
  });
  App.commands.setHandler("when:command:fetched", function(command, params, callback) {
    var request;
    request = API.singleCommand(command, params);
    return request.done(function(response) {
      var result, results;
      results = API.parseResponse(response);
      result = results.length === 1 ? results[0] : {};
      return callback(result);
    });
  });
  return App.commands.setHandler("when:entity:fetched", function(entities, callback) {
    var xhrs;
    helpers.global.loading("start");
    xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
    return $.when.apply($, xhrs).done(function() {
      helpers.global.loading("end");
      return callback();
    });
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  return KodiEntities.Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.url = config.get('static', 'jsonRpcEndpoint');

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
        ignorearticle: true
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

    return Collection;

  })(App.Entities.Collection);
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  return KodiEntities.Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.url = config.get('static', 'jsonRpcEndpoint');

    Model.prototype.rpc = new Backbone.Rpc({
      useNamedParameters: true,
      namespaceDelimiter: ''
    });

    Model.prototype.modelDefaults = {
      fullyloaded: false,
      thumbnail: '',
      thumbsUp: false
    };

    Model.prototype.parseModel = function(type, model, id) {
      model.id = id;
      model = App.request("images:path:entity", model);
      model.url = helpers.url.get(type, id);
      model.type = type;
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
        reset: false
      };
      options = _.extend(defaultOptions, options);
      albums = helpers.cache.get("album:entities");
      if (albums === false || options.reset === true) {
        albums = new KodiEntities.AlbumCollection();
        albums.fetch(options);
      }
      helpers.cache.set("album:entities", albums);
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
      return this.argSort("album", "ascending");
    };

    AlbumCollection.prototype.arg3 = function() {
      return this.argFilter();
    };

    AlbumCollection.prototype.parse = function(resp, xhr) {
      return resp.albums;
    };

    return AlbumCollection;

  })(App.KodiEntities.Collection);
  App.reqres.setHandler("album:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getAlbum(id, options);
  });
  return App.reqres.setHandler("album:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getAlbums(options);
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
      baseFields = ['thumbnail'];
      extraFields = ['fanart', 'genre', 'style', 'mood', 'born', 'formed', 'description'];
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
        reset: false
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
      return true;
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
      return resp.artists;
    };

    return ArtistCollection;

  })(App.KodiEntities.Collection);
  App.reqres.setHandler("artist:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getArtist(id, options);
  });
  return App.reqres.setHandler("artist:entities", function(options) {
    if (options == null) {
      options = {};
    }
    console.log('fetching');
    return API.getArtists(options);
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
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'resume', 'rating', 'year', 'file'],
      full: ['fanart', 'plotoutline', 'studio', 'mpaa', 'cast', 'imdbnumber', 'runtime', 'streamdetails']
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
        reset: false
      };
      options = _.extend(defaultOptions, options);
      collection = new KodiEntities.MovieCollection();
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
      return resp.movies;
    };

    return MovieCollection;

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
  return App.reqres.setHandler("movie:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getCollection(options);
  });
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getSongFields: function(type) {
      var baseFields, extraFields, fields, minimalFields;
      if (type == null) {
        type = 'small';
      }
      minimalFields = ['title', 'file'];
      baseFields = ['thumbnail', 'artist', 'artistid', 'album', 'albumid', 'lastplayed', 'track', 'year', 'duration'];
      extraFields = ['fanart', 'genre', 'style', 'mood', 'born', 'formed', 'description', 'lyrics'];
      if (type === 'full') {
        fields = minimalFields.concat(baseFields).concat(extraFields);
        return fields;
      } else if (type === 'minimal') {
        return minimalFields;
      } else {
        return baseFields;
      }
    },
    getSong: function(id, options) {
      var artist;
      artist = new App.KodiEntities.Song();
      artist.set({
        songid: parseInt(id),
        properties: API.getSongFields('full')
      });
      artist.fetch(options);
      return artist;
    },
    getFilteredSongs: function(options) {
      var defaultOptions, songs;
      defaultOptions = {
        reset: false
      };
      options = _.extend(defaultOptions, options);
      songs = new KodiEntities.SongFilteredCollection();
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
      return this.parseFieldsToDefaults(API.getSongFields('full'), fields);
    };

    Song.prototype.methods = {
      read: ['AudioLibrary.GetSongDetails', 'songidid', 'properties']
    };

    Song.prototype.arg2 = API.getSongFields('full');

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
      return API.getSongFields('small');
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
      return resp.songs;
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
  return App.reqres.setHandler("song:albumparse:entities", function(songs) {
    return API.parseSongsToAlbumSongs(songs);
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
      small: ['thumbnail', 'playcount', 'lastplayed', 'dateadded', 'episode', 'rating', 'year', 'file'],
      full: ['fanart', 'studio', 'mpaa', 'cast', 'imdbnumber', 'episodeguide', 'watchedepisodes']
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
        reset: false
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
      return resp.tvshows;
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
  return App.reqres.setHandler("tvshow:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getCollection(options);
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
      path: '#',
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
    getDefaultStructure: function(items, model) {
      var nav, navCollection, navParsed;
      nav = [];
      nav.push({
        id: 1,
        title: "Music",
        path: '#music',
        icon: 'mdi-av-my-library-music',
        classes: 'nav-music',
        parent: 0
      });
      nav.push({
        id: 2,
        title: "Artists",
        path: '#music/artists',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 2,
        title: "Albums",
        path: '#music/albums',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 3,
        title: "Recently Added",
        path: '#music/added',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 4,
        title: "Recently Played",
        path: '#music/played',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 5,
        title: "Genres",
        path: '#music/genres',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 6,
        title: "Years",
        path: '#music/years',
        icon: '',
        classes: '',
        parent: 1
      });
      nav.push({
        id: 11,
        title: "Movies",
        path: '#movies',
        icon: 'mdi-av-movie',
        classes: 'nav-movies',
        parent: 0
      });
      nav.push({
        id: 12,
        title: "Recently Added",
        path: '#movies/added',
        icon: '',
        classes: '',
        parent: 11
      });
      nav.push({
        id: 13,
        title: "All",
        path: '#movies/all',
        icon: '',
        classes: '',
        parent: 11
      });
      nav.push({
        id: 14,
        title: "Genres",
        path: '#movies/genres',
        icon: '',
        classes: '',
        parent: 11
      });
      nav.push({
        id: 15,
        title: "Years",
        path: '#movies/years',
        icon: '',
        classes: '',
        parent: 11
      });
      nav.push({
        id: 21,
        title: "TV Shows",
        path: '#tvshows',
        icon: 'mdi-hardware-tv',
        classes: 'nav-tv',
        parent: 0
      });
      nav.push({
        id: 22,
        title: "Recently Added",
        path: '#tvshows/added',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 23,
        title: "All",
        path: '#tvshows/all',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 24,
        title: "Genres",
        path: '#tvshows/genres',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 25,
        title: "Years",
        path: '#tvshows/years',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 31,
        title: "Browser",
        path: '#browser',
        icon: 'mdi-action-view-list',
        classes: 'nav-browser',
        parent: 0
      });
      nav.push({
        id: 32,
        title: "Files",
        path: '#browser/files',
        icon: '',
        classes: '',
        parent: 31
      });
      nav.push({
        id: 33,
        title: "AddOns",
        path: '#browser/addons',
        icon: '',
        classes: '',
        parent: 31
      });
      nav.push({
        id: 41,
        title: "Thumbs Up",
        path: '#thumbsup',
        icon: 'mdi-action-thumb-up',
        classes: 'nav-thumbs-up',
        parent: 0
      });
      navParsed = this.sortStructure(nav);
      navCollection = new Entities.NavMainCollection(navParsed);
      return navCollection;
    },
    sortStructure: function(structure) {
      var children, i, model, newParents, _i, _len, _name;
      children = {};
      for (_i = 0, _len = structure.length; _i < _len; _i++) {
        model = structure[_i];
        if (!((model.path != null) && model.parent !== 0)) {
          continue;
        }
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
  return App.reqres.setHandler("navMain:entities", function(items, model) {
    if (items == null) {
      items = [];
    }
    return API.getDefaultStructure(items, model);
  });
});

this.Kodi.module("Controllers", function(Controllers, App, Backbone, Marionette, $, _) {
  return Controllers.Base = (function(_super) {
    __extends(Base, _super);

    function Base(options) {
      if (options == null) {
        options = {};
      }
      this.region = options.region || App.request("default:region");
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

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.itemViewEventPrefix = "childview";

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

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {});

this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {
  return Views.CardView = (function(_super) {
    __extends(CardView, _super);

    function CardView() {
      return CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.prototype.template = "views/card/card";

    CardView.prototype.tagName = "li";

    CardView.prototype.className = "card";

    CardView.prototype.triggers = {
      "click .menu": "artist-menu:clicked"
    };

    return CardView;

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
      regionMetaBelow: ".region-details-meta-below"
    };

    return LayoutDetailsHeaderView;

  })(App.Views.LayoutView);
});

this.Kodi.module("AlbumApp", function(AlbumApp, App, Backbone, Marionette, $, _) {
  var API;
  AlbumApp.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "music/albums": "list",
      "music/album/:id": "view"
    };

    return Router;

  })(Marionette.AppRouter);
  API = {
    list: function() {
      return new AlbumApp.List.Controller();
    },
    view: function(id) {
      return new AlbumApp.Show.Controller({
        id: id
      });
    }
  };
  return App.addInitializer(function() {
    return new AlbumApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("AlbumApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var albums;
      albums = App.request("album:entities");
      return App.execute("when:entity:fetched", albums, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(albums);
          _this.listenTo(_this.layout, "show", function() {
            return _this.albumsRegion(albums);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(albums) {
      return new List.ListLayout({
        collection: albums
      });
    };

    Controller.prototype.albumsRegion = function(albums) {
      var albumsView;
      albumsView = this.getAlbumsView(albums);
      return this.layout.regionContent.show(albumsView);
    };

    Controller.prototype.getAlbumsView = function(albums) {
      return new List.Albums({
        collection: albums
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("AlbumApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "album-list";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.AlbumTeaser = (function(_super) {
    __extends(AlbumTeaser, _super);

    function AlbumTeaser() {
      return AlbumTeaser.__super__.constructor.apply(this, arguments);
    }

    AlbumTeaser.prototype.triggers = {
      "click .menu": "album-menu:clicked"
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
  return List.Albums = (function(_super) {
    __extends(Albums, _super);

    function Albums() {
      return Albums.__super__.constructor.apply(this, arguments);
    }

    Albums.prototype.childView = List.AlbumTeaser;

    Albums.prototype.emptyView = List.Empty;

    Albums.prototype.tagName = "ul";

    Albums.prototype.className = "card-grid--square";

    return Albums;

  })(App.Views.CollectionView);
});

this.Kodi.module("AlbumApp.Show", function(Show, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getAlbumsFromSongs: function(songs) {
      var album, albumid, albumsCollectionView, songCollection;
      albumsCollectionView = new Show.WithSongsCollection();
      albumsCollectionView.on("add:child", function(albumView) {
        return App.execute("when:entity:fetched", album, (function(_this) {
          return function() {
            var model, songView, teaser;
            model = albumView.model;
            teaser = new Show.AlbumTeaser({
              model: model
            });
            albumView.regionMeta.show(teaser);
            songView = App.request("song:list:view", songs[model.get('albumid')]);
            return albumView.regionSongs.show(songView);
          };
        })(this));
      });
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
      console.log(id);
      album = App.request("album:entity", id);
      return App.execute("when:entity:fetched", album, (function(_this) {
        return function() {
          App.execute("images:fanart:set", album.get('fanart'));
          _this.layout = _this.getLayoutView(album);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", '');
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
      return this.model.set({
        subtitle: this.model.get('year')
      });
    };

    AlbumTeaser.prototype.triggers = {
      "click .menu": "album-menu:clicked"
    };

    return AlbumTeaser;

  })(App.Views.CardView);
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

  })(Marionette.AppRouter);
  API = {
    list: function() {
      return new ArtistApp.List.Controller();
    },
    view: function(id) {
      return new ArtistApp.Show.Controller({
        id: id
      });
    }
  };
  return App.addInitializer(function() {
    return new ArtistApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var artists;
      artists = App.request("artist:entities");
      return App.execute("when:entity:fetched", artists, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(artists);
          _this.listenTo(_this.layout, "show", function() {
            return _this.artistsRegion(artists);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(artists) {
      return new List.ListLayout({
        collection: artists
      });
    };

    Controller.prototype.artistsRegion = function(artists) {
      var artistsView;
      artistsView = this.getArtistsView(artists);
      return this.layout.regionContent.show(artistsView);
    };

    Controller.prototype.getArtistsView = function(artists) {
      return new List.Artists({
        collection: artists
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "artist-list";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.ArtistTeaser = (function(_super) {
    __extends(ArtistTeaser, _super);

    function ArtistTeaser() {
      return ArtistTeaser.__super__.constructor.apply(this, arguments);
    }

    ArtistTeaser.prototype.triggers = {
      "click .menu": "artist-menu:clicked"
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
  return List.Artists = (function(_super) {
    __extends(Artists, _super);

    function Artists() {
      return Artists.__super__.constructor.apply(this, arguments);
    }

    Artists.prototype.childView = List.ArtistTeaser;

    Artists.prototype.emptyView = List.Empty;

    Artists.prototype.tagName = "ul";

    Artists.prototype.className = "card-grid--wide";

    return Artists;

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
          App.execute("images:fanart:set", artist.get('fanart'));
          _this.layout = _this.getLayoutView(artist);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", '');
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
          console.log(songsCollections);
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

    ArtistTeaser.prototype.triggers = {
      "click .menu": "artist-menu:clicked"
    };

    return ArtistTeaser;

  })(App.Views.CardView);
});

this.Kodi.module("Images", function(Images, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    imagesPath: 'dist/images/',
    defaultFanartPath: 'fanart_default/',
    defaultFanartFiles: ['wallpaper-443657.jpg', 'wallpaper-45040.jpg', 'wallpaper-765190.jpg', 'wallpaper-84050.jpg'],
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
      path = 'image/' + encodeURIComponent(rawPath);
      return path;
    },
    setFanartBackground: function(path, region) {
      var $body;
      $body = App.getRegion(region).$el;
      return $body.css('background-image', 'url(' + path + ')');
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
    if (type == null) {
      type = 'thumbnail';
    }
    return API.getImageUrl(rawPath, type);
  });
  return App.reqres.setHandler("images:path:entity", function(model) {
    if (model.thumbnail != null) {
      model.thumbnail = API.getImageUrl(model.thumbnail, 'thumbnail');
    }
    if (model.fanart != null) {
      model.fanart = API.getImageUrl(model.fanart, 'fanart');
    }
    return model;
  });
});

this.Kodi.module("MovieApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var movies;
      movies = App.request("movie:entities");
      return App.execute("when:entity:fetched", movies, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(movies);
          _this.listenTo(_this.layout, "show", function() {
            return _this.moviesRegion(movies);
          });
          return App.regionContent.show(_this.layout);
        };
      })(this));
    };

    Controller.prototype.getLayoutView = function(movies) {
      return new List.ListLayout({
        collection: movies
      });
    };

    Controller.prototype.moviesRegion = function(movies) {
      var moviesView;
      moviesView = this.getMoviesView(movies);
      return this.layout.regionContent.show(moviesView);
    };

    Controller.prototype.getMoviesView = function(movies) {
      return new List.Movies({
        collection: movies
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("MovieApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "movie-list";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.MovieTeaser = (function(_super) {
    __extends(MovieTeaser, _super);

    function MovieTeaser() {
      return MovieTeaser.__super__.constructor.apply(this, arguments);
    }

    MovieTeaser.prototype.triggers = {
      "click .menu": "movie-menu:clicked"
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
  return List.Movies = (function(_super) {
    __extends(Movies, _super);

    function Movies() {
      return Movies.__super__.constructor.apply(this, arguments);
    }

    Movies.prototype.childView = List.MovieTeaser;

    Movies.prototype.emptyView = List.Empty;

    Movies.prototype.tagName = "ul";

    Movies.prototype.className = "card-grid--tall";

    return Movies;

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
      "movies": "list",
      "movie/:id": "view"
    };

    return Router;

  })(Marionette.AppRouter);
  API = {
    list: function() {
      return new MovieApp.List.Controller();
    },
    view: function(id) {
      return new MovieApp.Show.Controller({
        id: id
      });
    }
  };
  return App.addInitializer(function() {
    return new MovieApp.Router({
      controller: API
    });
  });
});

this.Kodi.module("MovieApp.Show", function(Show, App, Backbone, Marionette, $, _) {
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
          App.execute("images:fanart:set", movie.get('fanart'));
          _this.layout = _this.getLayoutView(movie);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", '');
          });
          _this.listenTo(_this.layout, "show", function() {
            return _this.getDetailsLayoutView(movie);
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
          detail = new Show.Details({
            model: movie
          });
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        };
      })(this));
      return this.layout.regionHeader.show(headerLayout);
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

    return Details;

  })(App.Views.ItemView);
  return Show.MovieTeaser = (function(_super) {
    __extends(MovieTeaser, _super);

    function MovieTeaser() {
      return MovieTeaser.__super__.constructor.apply(this, arguments);
    }

    MovieTeaser.prototype.tagName = "div";

    MovieTeaser.prototype.className = "card-detail";

    MovieTeaser.prototype.triggers = {
      "click .menu": "movie-menu:clicked"
    };

    return MovieTeaser;

  })(App.Views.CardView);
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
    }
  };
  return this.onStart = function(options) {
    return App.reqres.setHandler("navMain:view", function(items, model) {
      if (items == null) {
        items = [];
      }
      return API.getNav();
    });
  };
});

this.Kodi.module("NavMain", function(NavMain, App, Backbone, Marionette, $, _) {
  return NavMain.List = (function(_super) {
    __extends(List, _super);

    function List() {
      return List.__super__.constructor.apply(this, arguments);
    }

    List.prototype.template = "apps/navMain/show/navMain";

    return List;

  })(Backbone.Marionette.ItemView);
});

this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {
  var API;
  Shell.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.appRoutes = {
      "home": "homePage"
    };

    return Router;

  })(Marionette.AppRouter);
  API = {
    homePage: function() {
      var foo;
      return foo = 'bar';
    },
    renderLayout: function() {
      var playlistState, shellLayout;
      shellLayout = new Shell.Layout();
      App.root.show(shellLayout);
      App.addRegions(shellLayout.regions);
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
      return App.execute("images:fanart:set");
    },
    renderNav: function() {
      var navView;
      navView = App.request('navMain:view');
      return App.regionNav.show(navView);
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
      API.renderNav();
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
      regionPlaylistSummary: '#playlist-summary',
      regionTitle: '#page-title .title',
      regionTitleContext: '#page-title .context',
      regionFanart: '#fanart'
    };

    Layout.prototype.triggers = {
      "click .playlist-toggle-open": "shell:playlist:toggle"
    };

    return Layout;

  })(Backbone.Marionette.LayoutView);
  return App.execute("shell:view:ready");
});

this.Kodi.module("SongApp.List", function(List, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getSongsView: function(songs) {
      return new List.Songs({
        collection: songs
      });
    }
  };
  return App.reqres.setHandler("song:list:view", function(songs) {
    return API.getSongsView(songs);
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

    Song.prototype.className = 'song table-row';

    Song.prototype.initialize = function() {
      var duration;
      duration = helpers.global.secToTime(this.model.get('duration'));
      return this.model.set({
        duration: helpers.global.formatTime(duration)
      });
    };

    Song.prototype.triggers = {
      "click .menu": "song-menu:clicked"
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

    Songs.prototype.className = "songs-table table table-striped table-hover";

    return Songs;

  })(App.Views.CollectionView);
});

this.Kodi.module("TVShowApp.List", function(List, App, Backbone, Marionette, $, _) {
  return List.Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {
      var tvshows;
      tvshows = App.request("tvshow:entities");
      return App.execute("when:entity:fetched", tvshows, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(tvshows);
          _this.listenTo(_this.layout, "show", function() {
            return _this.tvshowsRegion(tvshows);
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

    Controller.prototype.tvshowsRegion = function(tvshows) {
      var tvshowsView;
      tvshowsView = this.getTVShowsView(tvshows);
      return this.layout.regionContent.show(tvshowsView);
    };

    Controller.prototype.getTVShowsView = function(tvshows) {
      return new List.TVShows({
        collection: tvshows
      });
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("TVShowApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.ListLayout = (function(_super) {
    __extends(ListLayout, _super);

    function ListLayout() {
      return ListLayout.__super__.constructor.apply(this, arguments);
    }

    ListLayout.prototype.className = "tvshow-list";

    return ListLayout;

  })(App.Views.LayoutWithSidebarFirstView);
  List.TVShowTeaser = (function(_super) {
    __extends(TVShowTeaser, _super);

    function TVShowTeaser() {
      return TVShowTeaser.__super__.constructor.apply(this, arguments);
    }

    TVShowTeaser.prototype.triggers = {
      "click .menu": "tvshow-menu:clicked"
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
  return List.TVShows = (function(_super) {
    __extends(TVShows, _super);

    function TVShows() {
      return TVShows.__super__.constructor.apply(this, arguments);
    }

    TVShows.prototype.childView = List.TVShowTeaser;

    TVShows.prototype.emptyView = List.Empty;

    TVShows.prototype.tagName = "ul";

    TVShows.prototype.className = "card-grid--tall";

    return TVShows;

  })(App.Views.CollectionView);
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
          App.execute("images:fanart:set", tvshow.get('fanart'));
          _this.layout = _this.getLayoutView(tvshow);
          _this.listenTo(_this.layout, "destroy", function() {
            return App.execute("images:fanart:set", '');
          });
          _this.listenTo(_this.layout, "show", function() {
            return _this.getDetailsLayoutView(tvshow);
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
      "tvshows": "list",
      "tvshow/:id": "view"
    };

    return Router;

  })(Marionette.AppRouter);
  API = {
    list: function() {
      return new TVShowApp.List.Controller();
    },
    view: function(id) {
      return new TVShowApp.Show.Controller({
        id: id
      });
    }
  };
  return App.addInitializer(function() {
    return new TVShowApp.Router({
      controller: API
    });
  });
});
