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
      _print(_safe('<div class="region-details-title">\n    <h2><span class="title">'));
    
      _print(this.label);
    
      _print(_safe('</span> <span class="sub">'));
    
      _print(this.year);
    
      _print(_safe('</span></h2>\n</div>\n\n\n\n<div class="region-details-meta-below">\n\n    <div class="artist"><a href="#music/artist/'));
    
      _print(this.artistid);
    
      _print(_safe('">'));
    
      _print(this.artist);
    
      _print(_safe('</a></div>\n\n    '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n    <div class="album-genres">\n        '));
        _print(_safe(helpers.url.filterLinks('music/albums', 'genre', this.genre)));
        _print(_safe('\n    </div>\n    '));
      }
    
      _print(_safe('\n\n    <div class="description">'));
    
      _print(this.description);
    
      _print(_safe('</div>\n\n</div>\n'));
    
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
    
      _print(_safe(' <span class="sub">'));
    
      _print(this.formed);
    
      _print(_safe('</span></h2>\n</div>\n\n\n<div class="region-details-meta-below">\n\n    <div class="region-details-subtext">\n        '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n        <div class="artist-genres">\n            '));
        _print(_safe(helpers.url.filterLinks('music/artists', 'genre', this.genre)));
        _print(_safe('\n        </div>\n        '));
      }
    
      _print(_safe('\n    </div>\n\n    <div class="description">'));
    
      _print(this.description);
    
      _print(_safe('</div>\n\n</div>\n'));
    
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

window.JST["apps/browser/list/tpl/back_button.jst"] = function(__obj) {
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
      _print(_safe('<i class="thumb"></i><div class="title">'));
    
      _print(t.gettext('Back'));
    
      _print(_safe('</div>'));
    
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

window.JST["apps/browser/list/tpl/file.jst"] = function(__obj) {
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
      _print(_safe('<div class="thumb" style="background-image: url(\''));
    
      _print(this.thumbnail);
    
      _print(_safe('\')"><div class="play"></div></div>\n<div class="title">'));
    
      _print(this.label);
    
      _print(_safe('</div>'));
    
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

window.JST["apps/browser/list/tpl/folder_layout.jst"] = function(__obj) {
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
      _print(_safe('<div class="folder-layout">\n    <div class="loading-bar"><div class="inner"><span>'));
    
      _print(t.gettext('Loading folder...'));
    
      _print(_safe('</span></div></div>\n    <div class="path"></div>\n    <div class="folder-container">\n        <div class="folders-pane">\n            <div class="back"></div>\n            <div class="folders"></div>\n        </div>\n        <div class="files"></div>\n    </div>\n</div>'));
    
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

window.JST["apps/browser/list/tpl/path.jst"] = function(__obj) {
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
      _print(_safe('<div class="title">'));
    
      _print(this.label);
    
      _print(_safe('</div>'));
    
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

window.JST["apps/browser/list/tpl/source.jst"] = function(__obj) {
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
      _print(_safe('<div class="source source-'));
    
      _print(this.media);
    
      _print(_safe('">\n    '));
    
      _print(this.label);
    
      _print(_safe('\n</div>'));
    
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

window.JST["apps/browser/list/tpl/source_set.jst"] = function(__obj) {
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
      _print(_safe('<h3>'));
    
      _print(this.label);
    
      _print(_safe('</h3>\n<ul class="sources"></ul>'));
    
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

window.JST["apps/filter/show/tpl/filter_options.jst"] = function(__obj) {
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
      _print(_safe('<div class="options-search-wrapper">\n    <input class="options-search" value="" />\n</div>\n<div class="deselect-all">'));
    
      _print(t.gettext('Deselect All'));
    
      _print(_safe('</div>\n<ul class="selection-list"></ul>'));
    
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

window.JST["apps/filter/show/tpl/filters_bar.jst"] = function(__obj) {
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
      _print(_safe('<span class="filters-active-all">'));
    
      _print(this.filters);
    
      _print(_safe('</span><i class="remove"></i>'));
    
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

window.JST["apps/filter/show/tpl/filters_ui.jst"] = function(__obj) {
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
      _print(_safe('<div class="filters-container">\n\n    <div class="filters-current filter-pane">\n        <div class="nav-section"></div>\n\n        <h3 class="open-filters">'));
    
      _print(t.gettext('Filters'));
    
      _print(_safe('<i></i></h3>\n        <div class="filters-active"></div>\n\n        <h3>'));
    
      _print(t.gettext('Sort'));
    
      _print(_safe('</h3>\n        <div class="list sort-options"></div>\n    </div>\n\n    <div class="filters-page filter-pane">\n        <h3 class="close-filters">'));
    
      _print(t.gettext('Select a filter'));
    
      _print(_safe('</h3>\n        <div class="list filters-list"></div>\n    </div>\n\n    <div class="filters-options filter-pane">\n        <h3 class="close-options">'));
    
      _print(t.gettext('Select an option'));
    
      _print(_safe('</h3>\n        <div class="list filter-options-list"></div>\n    </div>\n\n</div>'));
    
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

window.JST["apps/filter/show/tpl/list_item.jst"] = function(__obj) {
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
      _print(_safe(this.title));
    
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

window.JST["apps/input/remote/tpl/remote_control.jst"] = function(__obj) {
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
      _print(_safe('<div class="remote kodi-remote">\n    <div class="toggle-visibility"></div>\n    <div class="playing-area">\n\n    </div>\n    <div class="main-controls">\n        <div class="direction">\n            <div class="pad">\n                <div class="ibut mdi-hardware-keyboard-arrow-left left input-button" data-type="Left"></div>\n                <div class="ibut mdi-hardware-keyboard-arrow-up up input-button" data-type="Up"></div>\n                <div class="ibut mdi-hardware-keyboard-arrow-down down input-button" data-type="Down"></div>\n                <div class="ibut mdi-hardware-keyboard-arrow-right right input-button" data-type="Right"></div>\n                <div class="ibut mdi-image-brightness-1 ok input-button" data-type="Select"></div>\n            </div>\n        </div>\n        <div class="buttons">\n            <div class="ibut mdi-action-settings-power power-button"></div>\n            <div class="ibut mdi-navigation-more-vert input-button" data-type="ContextMenu"></div>\n            <div class="ibut mdi-action-info input-button" data-type="Info"></div>\n        </div>\n    </div>\n    <div class="secondary-controls">\n        <div class="ibut mdi-hardware-keyboard-return input-button" data-type="Back"></div>\n        <div class="ibut mdi-av-stop player-button" data-type="Stop"></div>\n        <div class="ibut mdi-maps-store-mall-directory input-button" data-type="Home"></div>\n    </div>\n\n</div>'));
    
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

window.JST["apps/loading/show/tpl/loading_page.jst"] = function(__obj) {
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
      _print(_safe('<div id="loading-page">\n    <div class="spinner-double-section-far"></div>\n    <h2>'));
    
      _print(t.gettext("Just a sec..."));
    
      _print(_safe('</h2>\n</div>\n\n'));
    
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

window.JST["apps/localPlaylist/list/tpl/playlist.jst"] = function(__obj) {
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
      _print(_safe('<span class="item">'));
    
      _print(_safe(this.title));
    
      _print(_safe('</span>'));
    
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

window.JST["apps/localPlaylist/list/tpl/playlist_layout.jst"] = function(__obj) {
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
      _print(_safe('<div class="local-playlist-header">\n    <h2></h2>\n    <div class="dropdown">\n        <i data-toggle="dropdown"></i>\n        <ul class="dropdown-menu">\n            <li class="play">Play in Kodi</li>\n            <li class="localplay">Play in Browser</li>\n            <li class="lsit">Export List</li>\n            <div class="divider"></div>\n            <li class="clear">Clear Playlist</li>\n            <li class="delete">Delete Playlist</li>\n        </ul>\n    </div>\n</div>\n<div class="item-container">\n    <div class="empty-content">'));
    
      _print(t.gettext('Empty Playlist, you should probably add something to it?'));
    
      _print(_safe('</div>\n</div>'));
    
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

window.JST["apps/localPlaylist/list/tpl/playlist_list.jst"] = function(__obj) {
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
      _print(_safe('<h3></h3>\n<ul class="lists"></ul>'));
    
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

window.JST["apps/localPlaylist/list/tpl/playlist_sidebar_layout.jst"] = function(__obj) {
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
      _print(_safe('<div class="current-lists"></div>\n<div class="new-list">New Playlist</div>'));
    
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

window.JST["apps/movie/show/tpl/content.jst"] = function(__obj) {
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
      var cast, _i, _len, _ref;
    
      _print(_safe('\n<div class="entity-progress"><div class="current-progress" style="width: '));
    
      _print(this.progress);
    
      _print(_safe('%" title="'));
    
      _print(this.progress);
    
      _print(_safe('% '));
    
      _print(t.gettext('complete'));
    
      _print(_safe('"></div></div>\n\n<div class="section-content">\n    <h2>'));
    
      _print(t.gettext('Synopsis'));
    
      _print(_safe('</h2>\n    '));
    
      if (this.trailer.source === 'youtube') {
        _print(_safe('\n        <div class="trailer '));
        _print(this.trailer.source);
        _print(_safe('">\n            <img src="'));
        _print(_safe(this.trailer.img));
        _print(_safe('" />\n        </div>\n    '));
      }
    
      _print(_safe('\n    <p>'));
    
      _print(this.plot);
    
      _print(_safe('</p>\n    <ul class="inline-links">\n        <li>'));
    
      _print(_safe(helpers.url.imdbUrl(this.imdbnumber, 'View on imdb')));
    
      _print(_safe('</li>\n    </ul>\n</div>\n\n'));
    
      if (this.cast.length > 0) {
        _print(_safe('\n    <div class="section-content">\n        <h2>'));
        _print(t.gettext('Full Cast'));
        _print(_safe('</h2>\n        <ul class="cast-full">\n            '));
        _ref = this.cast;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cast = _ref[_i];
          _print(_safe('\n                <li><a href="#movies?cast='));
          _print(cast.name);
          _print(_safe('" title="'));
          _print(cast.name);
          _print(_safe(' ('));
          _print(cast.role);
          _print(_safe(')">\n                    <div class="thumb">\n                        <img src="'));
          _print(cast.thumbnail);
          _print(_safe('" />\n                    </div>\n                    <div class="meta">\n                        <strong>'));
          _print(cast.name);
          _print(_safe('</strong>\n                        <span title="'));
          _print(cast.role);
          _print(_safe('">'));
          _print(cast.role);
          _print(_safe('</span>\n                    </div>\n                </a></li>\n            '));
        }
        _print(_safe('\n        </ul>\n    </div>\n'));
      }
    
      _print(_safe('\n'));
    
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

window.JST["apps/movie/show/tpl/details_meta.jst"] = function(__obj) {
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
      var sub, _i, _len, _ref;
    
      _print(_safe('<div class="region-details-top">\n    <div class="region-details-title">\n        <h2><span class="title">'));
    
      _print(this.label);
    
      _print(_safe('</span> <span class="sub">'));
    
      _print(this.year);
    
      _print(_safe('</span></h2>\n    </div>\n    <div class="region-details-rating">\n        '));
    
      _print(this.rating);
    
      _print(_safe(' <i></i>\n    </div>\n</div>\n<div class="region-details-meta-below">\n\n    <div class="region-details-subtext">\n\n        <div class="runtime">\n            '));
    
      _print(helpers.global.formatTime(helpers.global.secToTime(this.runtime)));
    
      _print(_safe('\n        </div>\n\n        '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n        <div class="genres">\n            '));
        _print(_safe(helpers.url.filterLinks('movies', 'genre', this.genre)));
        _print(_safe('\n        </div>\n        '));
      }
    
      _print(_safe('\n    </div>\n\n    <div class="description">'));
    
      _print(this.plotoutline);
    
      _print(_safe('</div>\n\n    <ul class="people">\n        '));
    
      if (this.director.length > 0) {
        _print(_safe('\n            <li><label>Director:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('movies', 'director', this.director)));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n        '));
    
      if (this.writer.length > 0) {
        _print(_safe('\n            <li><label>Writer:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('movies', 'writer', this.writer)));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n        '));
    
      if (this.cast.length > 0) {
        _print(_safe('\n            <li><label>Cast:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('movies', 'cast', _.pluck(this.cast, 'name'))));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n\n    <ul class="streams">\n        <li><label>Video:</label> <span>'));
    
      _print(_.pluck(this.streamdetails.video, 'label').join(', '));
    
      _print(_safe('</span></li>\n        <li><label>Audio:</label> <span>'));
    
      _print(_.pluck(this.streamdetails.audio, 'label').join(', '));
    
      _print(_safe('</span></li>\n        '));
    
      if (this.streamdetails.subtitle.length > 0 && this.streamdetails.subtitle[0].label !== '') {
        _print(_safe('\n            <li><label>Subtitle:</label>\n                <span class="dropdown"><span data-toggle="dropdown">'));
        _print(_.first(_.pluck(this.streamdetails.subtitle, 'label')));
        _print(_safe('</span>\n                <ul class="dropdown-menu">\n                    '));
        _ref = this.streamdetails.subtitle;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          _print(_safe('\n                        <li>'));
          _print(sub.label);
          _print(_safe('</li>\n                    '));
        }
        _print(_safe('\n                </ul>\n                </span>\n            </li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n\n    <ul class="inline-links">\n        <li class="btn-flat-play play">'));
    
      _print(t.gettext('Play'));
    
      _print(_safe('</li>\n        <li class="btn-flat-add add">'));
    
      _print(t.gettext('Queue'));
    
      _print(_safe('</li>\n        <li class="btn-flat-stream stream">'));
    
      _print(t.gettext('Stream'));
    
      _print(_safe('</li>\n        <li class="btn-flat-download download">'));
    
      _print(t.gettext('Download'));
    
      _print(_safe('</li>\n    </ul>\n</div>\n'));
    
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
        _print(_safe('">\n                <a href="#'));
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
            _print(_safe('\n                      <li><a href="#'));
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

window.JST["apps/navMain/show/tpl/nav_item.jst"] = function(__obj) {
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
      _print(_safe(this.link));
    
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

window.JST["apps/navMain/show/tpl/nav_sub.jst"] = function(__obj) {
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
      _print(_safe('<h3>'));
    
      _print(t.gettext(this.title));
    
      _print(_safe('</h3>\n<ul class="items"></ul>'));
    
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

window.JST["apps/player/show/tpl/player.jst"] = function(__obj) {
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
      _print(_safe('<div class="player">\n\n    <div class="controls-primary">\n        <div class="controls-primary-buttons">\n            <div class="control control-prev"></div>\n            <div class="control control-play"></div>\n            <div class="control control-next"></div>\n        </div>\n    </div>\n\n    <div class="controls-secondary">\n        <div class="volume slider-bar"></div>\n        <div class="controls-secondary-buttons">\n            <div class="control control-mute"></div>\n            <div class="control control-repeat"></div>\n            <div class="control control-shuffle"></div>\n            <div class="control control-menu"></div>\n        </div>\n    </div>\n\n    <div class="now-playing">\n        <div class="playing-thumb thumb">\n            <div class="remote-toggle"></div>\n        </div>\n        <div class="playing-info">\n            <div class="playing-progress slider-bar"></div>\n            <div class="playing-time">\n                <div class="playing-time-current">0</div>\n                <div class="playing-time-duration">0:00</div>\n            </div>\n            <div class="playing-meta">\n                <div class="playing-title">'));
    
      _print(t.gettext('Nothing playing'));
    
      _print(_safe('</div>\n                <div class="playing-subtitle"></div>\n            </div>\n        </div>\n    </div>\n\n</div>'));
    
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

window.JST["apps/playlist/list/tpl/playlist_bar.jst"] = function(__obj) {
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
      _print(_safe('<div class="playlist-header">\n    <ul class="player-toggle">\n        <li class="kodi">'));
    
      _print(t.gettext('Kodi'));
    
      _print(_safe('</li>\n        <li class="local">'));
    
      _print(t.gettext('Local'));
    
      _print(_safe('</li>\n    </ul>\n    <div class="playlist-menu dropdown">\n        <i data-toggle="dropdown" class="menu-toggle"></i>\n        <ul class="dropdown-menu pull-right">\n            <li class="dropdown-header">Current Playlist</li>\n            <li><a href="#" class="clear-playlist">Clear Playlist</a></li>\n            <li><a href="#" class="refresh-playlist">Refresh Playlist</a></li>\n            <li class="dropdown-header">Kodi</li>\n            <li><a href="#" class="party-mode">Party Mode <i class="mdi-navigation-check"></i></a></li>\n            <li><a href="#" class="save-playlist">Save Kodi Playlist</a></li>\n            </li>\n        </ul>\n    </div>\n</div>\n<div class="playlists-wrapper">\n    <div class="kodi-playlists">\n        <ul class="media-toggle">\n            <li class="audio">Audio</li>\n            <li class="video">Video</li>\n        </ul>\n        <div class="kodi-playlist"></div>\n    </div>\n    <div class="local-playlists">\n        <div class="local-playlist"></div>\n    </div>\n</div>\n'));
    
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

window.JST["apps/playlist/list/tpl/playlist_item.jst"] = function(__obj) {
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
      _print(_safe('<div class="item-inner item-'));
    
      _print(this.type);
    
      _print(_safe('">\n    <div class="artwork">\n        <div class="thumb" title="'));
    
      _print(this.label);
    
      _print(_safe('" style="background-image: url(\''));
    
      _print(this.thumbnail);
    
      _print(_safe('\')">\n            <div class="play"></div>\n        </div>\n    </div>\n    <div class="meta">\n        <div class="title"><a href="#'));
    
      _print(this.url);
    
      _print(_safe('" title="'));
    
      _print(this.label);
    
      _print(_safe('">'));
    
      _print(this.label);
    
      _print(_safe('</a></div>\n        '));
    
      if (this.subtitle != null) {
        _print(_safe('\n        <div class="subtitle">'));
        _print(_safe(this.subtitle));
        _print(_safe('</div>\n        '));
      }
    
      _print(_safe('\n    </div>\n    <div class="remove"></div>\n</div>'));
    
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

window.JST["apps/search/list/tpl/search_layout.jst"] = function(__obj) {
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
      _print(_safe('<div class="search-inner">\n    <div class="entity-set entity-set-movie"></div>\n    <div class="entity-set entity-set-tvshow"></div>\n    <div class="entity-set entity-set-artist"></div>\n    <div class="entity-set entity-set-album"></div>\n    <div class="entity-set entity-set-song"></div>\n</div>'));
    
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

window.JST["apps/search/list/tpl/search_set.jst"] = function(__obj) {
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
      _print(_safe('<h2 class="set-header"></h2>\n<div class="set-results"></div>\n<div class="more"></div>'));
    
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

window.JST["apps/shell/show/tpl/homepage.jst"] = function(__obj) {
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
      _print(_safe('<div id="homepage"></div>'));
    
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
      _print(_safe('<div id="shell">\n\n    <a id="logo" href="#"></a>\n\n    <div id="nav-bar"></div>\n\n    <div id="header">\n\n        <h1 id="page-title">\n            <span class="context"></span>\n            <span class="title"></span>\n        </h1>\n\n        <div id="search-region">\n            <input id="search" title="Search">\n            <span id="do-search"></span>\n        </div>\n\n    </div>\n\n    <div id="main">\n\n        <div id="sidebar-one"></div>\n\n        <div id="content">Loading things...</div>\n\n    </div>\n\n    <div id="sidebar-two">\n        <div class="playlist-toggle-open"></div>\n        <div id="playlist-summary"></div>\n        <div id="playlist-bar"></div>\n    </div>\n\n    <div id="remote"></div>\n\n    <div id="player-wrapper">\n        <footer id="player-kodi"></footer>\n        <footer id="player-local"></footer>\n    </div>\n\n</div>\n\n<div id="fanart"></div>\n<div id="fanart-overlay"></div>\n\n<div id="snackbar-container"></div>\n\n<div class="modal fade" id="modal-window">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title"></h4>\n            </div>\n            <div class="modal-body"></div>\n            <div class="modal-footer"></div>\n        </div>\n    </div>\n</div>'));
    
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
      _print(_safe('<td class="cell-first">\n    <div class="thumb" style="background-image: url(\''));
    
      _print(this.thumbnail);
    
      _print(_safe('\')">\n    </div>\n    <div class="track">'));
    
      _print(this.track);
    
      _print(_safe('</div>\n    <div class="play"></div>\n</td>\n<td class="cell-label song-title">'));
    
      _print(this.label);
    
      _print(_safe('</td>\n<td class="cell-last">\n    <div class="duration">'));
    
      _print(this.duration);
    
      _print(_safe('</div>\n    <ul class="actions">\n        <li class="add"></li>\n        <li class="menu"></li>\n    </ul>\n</td>'));
    
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

window.JST["apps/thumbs/list/tpl/thumbs_layout.jst"] = function(__obj) {
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
      _print(_safe('<div class="thumbs-inner">\n    <div class="entity-set entity-set-movie"></div>\n    <div class="entity-set entity-set-tvshow"></div>\n    <div class="entity-set entity-set-artist"></div>\n    <div class="entity-set entity-set-album"></div>\n    <div class="entity-set entity-set-song"></div>\n</div>'));
    
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

window.JST["apps/thumbs/list/tpl/thumbs_set.jst"] = function(__obj) {
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
      _print(_safe('<h2 class="set-header"></h2>\n<div class="set-results"></div>\n<div class="more"></div>'));
    
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

window.JST["apps/tvshow/episode/tpl/content.jst"] = function(__obj) {
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
      var cast, _i, _len, _ref;
    
      _print(_safe('\n<div class="entity-progress"><div class="current-progress" style="width: '));
    
      _print(this.progress);
    
      _print(_safe('%" title="'));
    
      _print(this.progress);
    
      _print(_safe('% '));
    
      _print(t.gettext('complete'));
    
      _print(_safe('"></div></div>\n\n<div class="section-content">\n    <h2>'));
    
      _print(t.gettext('Synopsis'));
    
      _print(_safe('</h2>\n    <p>'));
    
      _print(this.plot);
    
      _print(_safe('</p>\n</div>\n\n'));
    
      if (this.cast.length > 0) {
        _print(_safe('\n    <div class="section-content">\n        <h2>'));
        _print(t.gettext('Full Cast'));
        _print(_safe('</h2>\n        <ul class="cast-full">\n            '));
        _ref = this.cast;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cast = _ref[_i];
          _print(_safe('\n                <li><a href="#tvshows?cast='));
          _print(cast.name);
          _print(_safe('" title="'));
          _print(cast.name);
          _print(_safe(' ('));
          _print(cast.role);
          _print(_safe(')">\n                    <div class="thumb">\n                        <img src="'));
          _print(cast.thumbnail);
          _print(_safe('" />\n                    </div>\n                    <div class="meta">\n                        <strong>'));
          _print(cast.name);
          _print(_safe('</strong>\n                        <span title="'));
          _print(cast.role);
          _print(_safe('">'));
          _print(cast.role);
          _print(_safe('</span>\n                    </div>\n                </a></li>\n            '));
        }
        _print(_safe('\n        </ul>\n    </div>\n'));
      }
    
      _print(_safe('\n'));
    
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

window.JST["apps/tvshow/episode/tpl/details_meta.jst"] = function(__obj) {
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
      var sub, _i, _len, _ref;
    
      _print(_safe('<div class="region-details-top">\n    <div class="region-details-title">\n        <h2><span class="title">'));
    
      _print(this.label);
    
      _print(_safe('</span> <span class="sub">S'));
    
      _print(this.season);
    
      _print(_safe(' E'));
    
      _print(this.episode);
    
      _print(_safe('</span></h2>\n    </div>\n    <div class="region-details-rating">\n        '));
    
      _print(this.rating);
    
      _print(_safe(' <i></i>\n    </div>\n</div>\n<div class="region-details-meta-below">\n\n    <div class="region-details-subtext">\n\n        <div class="runtime">\n            '));
    
      _print(helpers.global.formatTime(helpers.global.secToTime(this.runtime)));
    
      _print(_safe('\n        </div>\n\n    </div>\n\n    <ul class="people">\n        '));
    
      if (this.director.length > 0) {
        _print(_safe('\n            <li><label>Director:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('tvshows', 'director', this.director)));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n        '));
    
      if (this.writer.length > 0) {
        _print(_safe('\n            <li><label>Writer:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('tvshows', 'writer', this.writer)));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n        '));
    
      if (this.cast.length > 0) {
        _print(_safe('\n            <li><label>Cast:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('tvshows', 'cast', _.pluck(this.cast, 'name'))));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n\n    <ul class="streams">\n        <li><label>Video:</label> <span>'));
    
      _print(_.pluck(this.streamdetails.video, 'label').join(', '));
    
      _print(_safe('</span></li>\n        <li><label>Audio:</label> <span>'));
    
      _print(_.pluck(this.streamdetails.audio, 'label').join(', '));
    
      _print(_safe('</span></li>\n        '));
    
      if (this.streamdetails.subtitle.length > 0 && this.streamdetails.subtitle[0].label !== '') {
        _print(_safe('\n            <li><label>Subtitle:</label>\n                <span class="dropdown"><span data-toggle="dropdown">'));
        _print(_.first(_.pluck(this.streamdetails.subtitle, 'label')));
        _print(_safe('</span>\n                <ul class="dropdown-menu">\n                    '));
        _ref = this.streamdetails.subtitle;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          _print(_safe('\n                        <li>'));
          _print(sub.label);
          _print(_safe('</li>\n                    '));
        }
        _print(_safe('\n                </ul>\n                </span>\n            </li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n\n    <ul class="inline-links">\n        <li class="btn-flat-play play">'));
    
      _print(t.gettext('Play'));
    
      _print(_safe('</li>\n        <li class="btn-flat-add add">'));
    
      _print(t.gettext('Queue'));
    
      _print(_safe('</li>\n        <li class="btn-flat-stream stream">'));
    
      _print(t.gettext('Stream'));
    
      _print(_safe('</li>\n        <li class="btn-flat-download download">'));
    
      _print(t.gettext('Download'));
    
      _print(_safe('</li>\n    </ul>\n</div>\n'));
    
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

window.JST["apps/tvshow/season/tpl/details_meta.jst"] = function(__obj) {
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
      _print(_safe('<div class="region-details-top">\n    <div class="region-details-title">\n        <h2>\n            <span class="title">'));
    
      _print(t.gettext('Season'));
    
      _print(_safe(' '));
    
      _print(this.season);
    
      _print(_safe('</span>\n            <span class="sub"><a href="#tvshow/'));
    
      _print(this.tvshowid);
    
      _print(_safe('">'));
    
      _print(this.label);
    
      _print(_safe('</a></span>\n        </h2>\n    </div>\n    <div class="region-details-rating">\n        '));
    
      _print(this.rating);
    
      _print(_safe(' <i></i>\n    </div>\n</div>\n<div class="region-details-meta-below">\n\n    <div class="region-details-subtext">\n        '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n        <div class="genres">\n            '));
        _print(_safe(helpers.url.filterLinks('tvshows', 'genre', this.genre)));
        _print(_safe('\n        </div>\n        '));
      }
    
      _print(_safe('\n    </div>\n\n    <ul class="people">\n        '));
    
      if (this.cast.length > 0) {
        _print(_safe('\n        <li><label>Cast:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('tvshows', 'cast', _.pluck(this.cast, 'name'))));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n\n    <div class="description">'));
    
      _print(this.plot);
    
      _print(_safe('</div>\n\n</div>\n'));
    
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

window.JST["apps/tvshow/show/tpl/details_meta.jst"] = function(__obj) {
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
      _print(_safe('<div class="region-details-top">\n    <div class="region-details-title">\n        <h2><span class="title">'));
    
      _print(this.label);
    
      _print(_safe('</span> <span class="sub">'));
    
      _print(this.year);
    
      _print(_safe('</span></h2>\n    </div>\n    <div class="region-details-rating">\n        '));
    
      _print(this.rating);
    
      _print(_safe(' <i></i>\n    </div>\n</div>\n<div class="region-details-meta-below">\n\n    <div class="region-details-subtext">\n        '));
    
      if (this.genre.length > 0) {
        _print(_safe('\n        <div class="genres">\n            '));
        _print(_safe(helpers.url.filterLinks('tvshows', 'genre', this.genre)));
        _print(_safe('\n        </div>\n        '));
      }
    
      _print(_safe('\n    </div>\n\n    <ul class="people">\n        '));
    
      if (this.cast.length > 0) {
        _print(_safe('\n        <li><label>Cast:</label> <span>'));
        _print(_safe(helpers.url.filterLinks('tvshows', 'cast', _.pluck(this.cast, 'name'))));
        _print(_safe('</span></li>\n        '));
      }
    
      _print(_safe('\n    </ul>\n\n    <div class="description">'));
    
      _print(this.plot);
    
      _print(_safe('</div>\n\n</div>\n'));
    
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

window.JST["components/form/tpl/form.jst"] = function(__obj) {
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
      _print(_safe('<div class="form-inner">\n\t<div class="form-content-region"></div>\n    <footer>\n        <ul class="inline-list">\n            <li>\n                <button type="submit" data-form-button="submit" class="btn btn-primary form-save">Save</button>\n            </li>\n            <li class="response">\n\n            </li>\n        </ul>\n    </footer>\n</div>'));
    
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

window.JST["components/form/tpl/form_item.jst"] = function(__obj) {
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
      if (this.title) {
        _print(_safe('\n    <label class="control-label">'));
        _print(t.gettext(this.title));
        _print(_safe('</label>\n'));
      }
    
      _print(_safe('\n<div class="element">\n    '));
    
      if (this.type !== 'checkbox') {
        _print(_safe('\n        '));
        _print(_safe(this.element));
        _print(_safe('\n    '));
      } else {
        _print(_safe('\n        <div class="togglebutton">\n            <label>'));
        _print(_safe(this.element));
        _print(_safe('</label>\n        </div>\n    '));
      }
    
      _print(_safe('\n    '));
    
      if (this.description) {
        _print(_safe('\n        <div class="help-block description">'));
        _print(t.gettext(this.description));
        _print(_safe('</div>\n    '));
      }
    
      _print(_safe('\n</div>\n'));
    
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

window.JST["components/form/tpl/form_item_group.jst"] = function(__obj) {
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
      if (this.title) {
        _print(_safe('\n    <h3 class="group-title">'));
        _print(this.title);
        _print(_safe('</h3>\n'));
      }
    
      _print(_safe('\n<div class="form-items"></div>'));
    
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
      var key, val, _ref;
    
      _print(_safe('<div class="card-'));
    
      _print(this.type);
    
      _print(_safe('">\n    <div class="artwork">\n        <a href="#'));
    
      _print(this.url);
    
      _print(_safe('" class="thumb" title="'));
    
      _print(this.label);
    
      _print(_safe('" style="background-image: url(\''));
    
      _print(this.thumbnail);
    
      _print(_safe('\')"></a>\n        <div class="play"></div>\n    </div>\n    <div class="meta">\n        <div class="title"><a href="#'));
    
      _print(this.url);
    
      _print(_safe('" title="'));
    
      _print(this.label);
    
      _print(_safe('">'));
    
      _print(this.label);
    
      _print(_safe('</a></div>\n        '));
    
      if (this.subtitle != null) {
        _print(_safe('\n            <div class="subtitle">'));
        _print(_safe(this.subtitle));
        _print(_safe('</div>\n        '));
      }
    
      _print(_safe('\n    </div>\n    '));
    
      if (this.actions) {
        _print(_safe('\n        <ul class="actions">\n            '));
        _ref = this.actions;
        for (key in _ref) {
          val = _ref[key];
          _print(_safe('<li class="'));
          _print(key);
          _print(_safe('" title="'));
          _print(val);
          _print(_safe('"></li>'));
        }
        _print(_safe('\n        </ul>\n    '));
      }
    
      _print(_safe('\n    '));
    
      if (this.menu) {
        _print(_safe('\n        <div class="dropdown">\n            <i data-toggle="dropdown"></i>\n            <ul class="dropdown-menu">\n\n            </ul>\n        </div>\n    '));
      }
    
      _print(_safe('\n</div>'));
    
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

window.JST["views/card/tpl/card_placeholder.jst"] = function(__obj) {
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
      _print(_safe('<i></i>'));
    
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
      _print(_safe('<div class="layout-container details-header">\n\n    <div class="region-details-side"></div>\n\n    <div class="region-details-meta-wrapper"><div class="region-details-meta">\n\n        <div class="region-details-title"><span class="title"></span> <span class="sub"></span></div>\n\n        <div class="region-details-meta-below">\n            <div class="region-details-subtext"></div>\n            <div class="description"></div>\n        </div>\n\n    </div></div>\n\n    <div class="region-details-fanart"></div>\n\n</div>\n'));
    
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
      _print(_safe('<div class="layout-container with-sidebar-first">\n\n    <section class="region-first"></section>\n\n    <section class="region-content-wrapper">\n        <div class="region-content-top"></div>\n        <div class="region-content"></div>\n    </section>\n\n</div>'));
    
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
