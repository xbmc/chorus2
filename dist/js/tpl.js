window.JST["artist/list/tpl/artist_teaser.jst"] = function(__obj) {
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
      _print(_safe('<div class="artist artist-teaser">\n    <div class="artwork">\n        <a href="#music/artist/id" class="thumbnail"></a>\n    </div>\n    <div class="meta">\n        <div class="title"><a href="#music/artist/id" class="title">placeholder</a></div>\n        <div class="subtitle"></div>\n    </div>\n</div>'));
    
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

window.JST["artist/list/tpl/empty.jst"] = function(__obj) {
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

window.JST["artist/list/tpl/list_layout.jst"] = function(__obj) {
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
      _print(_safe('<div id="artists-list" class="with-side">\n\n\t<section class="region-first region-filters"></section>\n\n\t<section class="region-content region-list"></section>\n\n</div>'));
    
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

window.JST["navMain/show/tpl/navMain.jst"] = function(__obj) {
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

window.JST["shell/show/tpl/shell.jst"] = function(__obj) {
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
      _print(_safe('<div id="shell">\n\n    <div id="nav-bar"></div>\n\n    <div id="header">\n\n        <h1 id="page-title">\n            <span class="context"></span>\n            <span class="title"></span>\n        </h1>\n\n        <div id="search-region">\n            <input id="search" title="Search">\n            <span id="do-search"></span>\n        </div>\n\n    </div>\n\n    <div id="main">\n\n        <div id="sidebar-one"></div>\n\n        <div id="content">Loading things...</div>\n\n    </div>\n\n    <div id="sidebar-two">\n        <div class="playlist-toggle-open"></div>\n        <div id="playlist-summary"></div>\n        <div id="playlist-bar"></div>\n    </div>\n\n    <footer id="player"></footer>\n\n</div>\n\n<div id="fanart"></div>'));
    
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
