var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
  App.on("initialize:after", function(options) {
    if (Backbone.history) {
      return Backbone.history.start();
    }
  });
  return App;
})(Backbone, Marionette);

this.Kodi.start();

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
  Our generic global helpers so we dont have add complexity to our app.
 */

helpers.global = {
  shuffle: function(array) {
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
  },
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

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
    xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
    return $.when.apply($, xhrs).done(function() {
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
      arg[name] = value;
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

    return Model;

  })(App.Entities.Model);
});

this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    getFields: function(type) {
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
        artistid: id,
        properties: API.getFields('full')
      });
      return artist.fetch(options);
    },
    getArtists: function(options) {
      var artists, defaultOptions;
      artists = new KodiEntities.ArtistCollection();
      defaultOptions = {
        reset: true
      };
      options = _.extend(defaultOptions, options);
      if (typeof callback !== "undefined" && callback !== null) {
        options(callback);
      }
      return artists.fetch(options);
    }
  };
  KodiEntities.Artist = (function(_super) {
    __extends(Artist, _super);

    function Artist() {
      return Artist.__super__.constructor.apply(this, arguments);
    }

    Artist.prototype.defaults = function() {
      var field, fields, _i, _len, _ref;
      fields = _.extend(this.modelDefaults, {
        artistid: 1,
        artist: ''
      });
      _ref = API.getFields('full');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        fields[field] = '';
      }
      return fields;
    };

    Artist.prototype.methods = {
      read: ['AudioLibrary.GetArtistDetails', 'artistid', 'properties']
    };

    Artist.prototype.arg2 = API.getFields('full');

    Artist.prototype.parse = function(resp, xhr) {
      var obj;
      obj = resp.artistdetails != null ? resp.artistdetails : resp;
      if (resp.artistdetails != null) {
        obj.fullyloaded = true;
      }
      obj.id = obj.artistid;
      return obj;
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
      console.log(this);
      return true;
    };

    ArtistCollection.prototype.arg2 = function() {
      return API.getFields('small');
    };

    ArtistCollection.prototype.arg3 = function() {
      return this.argLimit();
    };

    ArtistCollection.prototype.arg4 = function() {
      return this.argSort("artist", "descending");
    };

    ArtistCollection.prototype.parse = function(resp, xhr) {
      return resp.artists;
    };

    return ArtistCollection;

  })(App.KodiEntities.Collection);
  App.commands.setHandler("artist:entity", function(id, options) {
    if (options == null) {
      options = {};
    }
    return API.getArtist(id, options);
  });
  return App.commands.setHandler("artist:entities", function(options) {
    if (options == null) {
      options = {};
    }
    return API.getArtists(options);
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
        path: '#tv',
        icon: 'mdi-hardware-tv',
        classes: 'nav-tv',
        parent: 0
      });
      nav.push({
        id: 22,
        title: "Recently Added",
        path: '#tv/added',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 23,
        title: "All",
        path: '#tv/all',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 24,
        title: "Genres",
        path: '#tv/genres',
        icon: '',
        classes: '',
        parent: 21
      });
      nav.push({
        id: 25,
        title: "Years",
        path: '#tv/years',
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
      return new ArtistApp.List.Controller;
    },
    view: function(id) {
      var foo;
      return foo = 'bar';
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
      var crew;
      crew = App.request("artist:entities");
      return App.execute("when:entity:fetched", crew, (function(_this) {
        return function() {
          _this.layout = _this.getLayoutView(crew);
          _this.listenTo(_this.layout, "show", function() {
            _this.titleRegion();
            _this.panelRegion();
            return _this.crewRegion(crew);
          });
          return App.mainRegion.show(_this.layout);
        };
      })(this));
    };

    return Controller;

  })(App.Controllers.Base);
});

this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {
  List.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.template = "artist/list/list_layout";

    Layout.prototype.regions = {
      filtersRegion: ".region-filters",
      contentRegion: ".region-content"
    };

    return Layout;

  })(App.Views.LayoutView);
  List.ArtistTeaser = (function(_super) {
    __extends(ArtistTeaser, _super);

    function ArtistTeaser() {
      return ArtistTeaser.__super__.constructor.apply(this, arguments);
    }

    ArtistTeaser.prototype.template = "artist/list/artist_teaser";

    ArtistTeaser.prototype.tagName = "li";

    ArtistTeaser.prototype.className = "card";

    ArtistTeaser.prototype.triggers = {
      "click .menu": "artist-menu:clicked"
    };

    return ArtistTeaser;

  })(App.Views.ItemView);
  List.Empty = (function(_super) {
    __extends(Empty, _super);

    function Empty() {
      return Empty.__super__.constructor.apply(this, arguments);
    }

    Empty.prototype.template = "artist/list/empty";

    Empty.prototype.tagName = "li";

    Empty.prototype.className = "empty-result";

    return Empty;

  })(App.Views.ItemView);
  return List.Artists = (function(_super) {
    __extends(Artists, _super);

    function Artists() {
      return Artists.__super__.constructor.apply(this, arguments);
    }

    Artists.prototype.itemView = List.ArtistTeaser;

    Artists.prototype.emptyView = List.Empty;

    return Artists;

  })(App.Views.CollectionView);
});

this.Kodi.module("Images", function(Images, App, Backbone, Marionette, $, _) {
  var API;
  API = {
    defaultFanartPath: 'dist/images/fanart_default/',
    defaultFanartFiles: ['wallpaper-443657.jpg', 'wallpaper-45040.jpg', 'wallpaper-765190.jpg', 'wallpaper-84050.jpg'],
    getRandomFanart: function() {
      var file, path, rand;
      rand = helpers.global.getRandomInt(0, API.defaultFanartFiles.length - 1);
      file = API.defaultFanartFiles[rand];
      path = API.defaultFanartPath + file;
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
        type = 'default';
      }
      if ((rawPath == null) || rawPath === '') {
        path = API.getRandomFanart();
      } else {
        path = 'image/' + encodeURIComponent(rawPath);
      }
      return path;
    }
  };
  return App.commands.setHandler("images:fanart:set", function(rawPath, region) {
    var path;
    if (region == null) {
      region = 'regionFanart';
    }
    path = API.getImageUrl(rawPath);
    return API.setFanartBackground(path, region);
  });
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

    List.prototype.template = "navMain/show/navMain";

    return List;

  })(Backbone.Marionette.ItemView);
});

this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {
  var API;
  API = {
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
      App.execute("images:fanart:set");
      App.execute('artist:entities', {
        success: function(data) {
          return console.log(data);
        }
      });
      return App.execute('artist:entity', 171, {
        success: function(data) {
          console.log(data);
          return App.execute("images:fanart:set", data.attributes.fanart);
        }
      });
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
      return App.execute("shell:ready");
    });
  });
});

this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {
  Shell.Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.template = "shell/show/shell";

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
