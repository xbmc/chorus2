window.JST["apps/album/show/tpl/album_with_songs.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="album album--with-songs">\n    <div class="region-album-side">\n        <div class="region-album-meta"></div>\n    </div>\n    <div class="region-album-content">\n        <div class="region-album-songs"></div>\n    </div>\n</div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["apps/album/show/tpl/details_meta.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="region-details-title">\n    <h2>'));
    
      _print(this.label);
    
      _print(_safe('</h2>\n</div>\n\n<div class="region-details-meta-side-first">\n    <div class="artist"><a href="#music/artist/'));
    
      _print(this.artistid);
    
      _print(_safe('">'));
    
      _print(this.artist);
    
      _print(_safe('</a></div>\n</div>\n\n<div class="region-details-meta-side-second">\n    '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n    <div class="genres">\n        '));
        _print(this.genre.join(', '));
        _print(_safe('\n    </div>\n    '));
      }
    
      _print(_safe('\n</div>\n\n<div class="region-details-meta-below">\n    <div class="description">'));
    
      _print(this.description);
    
      _print(_safe('</div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["apps/artist/show/tpl/details_meta.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="region-details-title">\n    <h2>'));
    
      _print(this.label);
    
      _print(_safe('</h2>\n</div>\n\n<div class="region-details-meta-side-first">\n    <div class="formed">'));
    
      _print(this.formed);
    
      _print(_safe('</div>\n</div>\n\n<div class="region-details-meta-side-second">\n    '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n    <div class="genres">\n        '));
        _print(this.genre.join(', '));
        _print(_safe('\n    </div>\n    '));
      }
    
      _print(_safe('\n</div>\n\n<div class="region-details-meta-below">\n    <div class="description">'));
    
      _print(this.description);
    
      _print(_safe('</div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["apps/navMain/show/tpl/navMain.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var child, item, _i, _j, _len, _len1, _ref, _ref1;
    
      _print(_safe('<div id="nav-header"></div>\n<nav>\n    <ul>\n        '));
    
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (!(item.path !== 'undefined' && item.parent === 0)) {
          continue;
        }
        _print(_safe('\n            <li class="'));
        _print(item["class"]);
        _print(_safe('">\n                <a href="'));
        _print(item.path);
        _print(_safe('">\n                    <i class="'));
        _print(item.icon);
        _print(_safe('"></i>\n                    <span>'));
        _print(item.title);
        _print(_safe('</span>\n                </a>\n\n                '));
        if (item.children.length !== 0) {
          _print(_safe('\n                <ul>\n                    '));
          _ref1 = item.children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            child = _ref1[_j];
            if (!(child.path !== 'undefined')) {
              continue;
            }
            _print(_safe('\n                      <li><a href="'));
            _print(child.path);
            _print(_safe('">'));
            _print(child.title);
            _print(_safe('</a></li>\n                    '));
          }
          _print(_safe('\n                </ul>\n                '));
        }
        _print(_safe('\n            </li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n</nav>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["apps/shell/show/tpl/shell.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div id="shell">\n\n    <a id="logo" href="#"></a>\n\n    <div id="nav-bar"></div>\n\n    <div id="header">\n\n        <h1 id="page-title">\n            <span class="context"></span>\n            <span class="title"></span>\n        </h1>\n\n        <div id="search-region">\n            <input id="search" title="Search">\n            <span id="do-search"></span>\n        </div>\n\n    </div>\n\n    <div id="main">\n\n        <div id="sidebar-one"></div>\n\n        <div id="content">Loading things...</div>\n\n    </div>\n\n    <div id="sidebar-two">\n        <div class="playlist-toggle-open"></div>\n        <div id="playlist-summary"></div>\n        <div id="playlist-bar"></div>\n    </div>\n\n    <footer id="player"></footer>\n\n</div>\n\n<div id="fanart"></div>\n<div id="fanart-overlay"></div>\n<div id="fanart-overlay-decal"></div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["apps/song/list/tpl/song.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<td class="cell-first">'));
    
      _print(this.track);
    
      _print(_safe('</td>\n<td class="cell-label">'));
    
      _print(this.label);
    
      _print(_safe('</td>\n<td class="cell-last">'));
    
      _print(this.duration);
    
      _print(_safe('</td>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["views/card/tpl/card.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="card-inner card-'));
    
      _print(this.type);
    
      _print(_safe('">\n    <div class="artwork">\n        <a href="#'));
    
      _print(this.url);
    
      _print(_safe('" class="thumb" title="'));
    
      _print(this.label);
    
      _print(_safe('">\n            <img src="'));
    
      _print(this.thumbnail);
    
      _print(_safe('" />\n        </a>\n    </div>\n    <div class="meta">\n        <div class="title"><a href="#'));
    
      _print(this.url);
    
      _print(_safe('" title="'));
    
      _print(this.label);
    
      _print(_safe('">'));
    
      _print(this.label);
    
      _print(_safe('</a></div>\n        '));
    
      if (this.subtitle != null) {
        _print(_safe('\n            <div class="subtitle">'));
        _print(this.subtitle);
        _print(_safe('</div>\n        '));
      }
    
      _print(_safe('\n    </div>\n</div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["views/empty/tpl/empty.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="empty-result">\n    <h2>No results found</h2>\n    <p>Have you done a library scan?</p>\n</div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["views/layouts/tpl/layout_details_header.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="layout-container details-header">\n\n    <div class="region-details-side"></div>\n\n    <div class="region-details-meta">\n\n        <div class="region-details-title"></div>\n\n        <div class="region-details-meta-side-first"></div>\n\n        <div class="region-details-meta-side-second"></div>\n\n        <div class="region-details-meta-below"></div>\n\n    </div>\n\n</div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["views/layouts/tpl/layout_with_header.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="layout-container with-header">\n\n    <header class="region-header"></header>\n\n    <section class="region-content"></section>\n\n</div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

window.JST["views/layouts/tpl/layout_with_sidebar_first.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class="layout-container with-sidebar-first">\n\n    <section class="region-first"></section>\n\n    <section class="region-content"></section>\n\n</div>'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
