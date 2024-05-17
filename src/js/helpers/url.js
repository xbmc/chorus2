// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Handle urls.
*/
helpers.url = {};

//# Map generic entities to their urls.
helpers.url.map = {
  artist: 'music/artist/:id',
  album: 'music/album/:id',
  song: 'music/song/:id',
  movie: 'movie/:id',
  tvshow: 'tvshow/:id',
  season: 'tvshow/:id',
  episode: 'tvshow/:tvshowid/:season/:id',
  channeltv: 'pvr/tv/:id',
  channelradio: 'pvr/radio/:id',
  file: 'browser/file/:id',
  playlist: 'playlist/:id',
  musicvideo: 'music/video/:id'
};

//# Get base endpoint
helpers.url.baseKodiUrl = function(query = 'Kodi') {
  const path = (config.getLocal('jsonRpcEndpoint')) + "?" + query;
  if (config.getLocal('reverseProxy')) {
    return path;
  } else {
    return "/" + path;
  }
};

//# Get a url for a given model type.
helpers.url.get = function(type, id = '', replacements = {}) {
  //# Get the path from the map
  let path = '';
  if (helpers.url.map[type] != null) {
    path = helpers.url.map[type];
  }
  //# Replace the tokens in the path
  replacements[':id'] = id;
  for (var token in replacements) {
    id = replacements[token];
    path = path.replace(token, id);
  }
  return path;
};

//# From an array of people, make a set of links to their filter page.
helpers.url.filterLinks = function(entities, key, items, limit = 5) {
  const baseUrl = '#' + entities + '?' + key + '=';
  const links = [];
  for (var i in items) {
    var item = items[i];
    if (i < limit) {
      links.push('<a href="' + baseUrl + encodeURIComponent(item) + '">' + item + '</a>');
    }
  }
  return links.join(', ');
};


//# For a mixed style entity (playlist, now playing), tweak the url
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

//# Get url args (removing any queries)
helpers.url.arg = function(arg = 'none') {
  const {
    hash
  } = location;
  const hashParts = hash.split('?');
  const args = hashParts[0].substring(1).split('/');
  if (arg === 'none') {
    return args;
  } else if (args[arg] != null) {
    return args[arg];
  } else {
    return '';
  }
};


//# Get Url params
//# Will automatically parse current url or the params provided e.g. 'foo=bar&duck=sauce'
helpers.url.params = function(params = 'auto') {
  let query;
  if (params === 'auto') {
    const p = document.location.href;
    if (p.indexOf('?') === -1) {
      return {};
    } else {
      let path;
      [path, query] = p.split('?');
    }
  }
  if (query == null) { query = params; }
  return _.object(_.compact(_.map(query.split('&'), function(item) { if (item) { return item.split('='); } })));
};


//# Get a query params string ready for appending to a url
helpers.url.buildParams = function(params) {
  const q = [];
  for (var key in params) {
    var val = params[key];
    q.push(key + '=' + encodeURIComponent(val));
  }
  return '?' + q.join('&');
};


//# Alter the params by suppling options to add or remove
//# Add is an object with key: val pairs, Remove is an array of keys to remove.
//# Returns a full url path (no # symbol)
helpers.url.alterParams = function(add = {}, remove = []) {
  const curParams = helpers.url.params();
  if (remove.length > 0) {
    for (var k of remove) {
      delete curParams[k];
    }
  }
  const params = _.extend(curParams, add);
  return helpers.url.path() + helpers.url.buildParams(params);
};


//# Get the current path.
helpers.url.path = function() {
  const p = document.location.hash;
  const [path, query] = p.split('?');
  return path.substring(1);
};


//# Create a Imdb Link, abstraction as imdbid might also be used for tmdb id?
helpers.url.imdbUrl = function(imdbNumber, text) {
  const url = `http://www.imdb.com/title/${imdbNumber}/`;
  return `<a href='${url}' class='imdblink' target='_blank'>${t.gettext(text)}</a>`;
};


//# Parse trailer url
helpers.url.parseTrailerUrl = function(trailer) {
  const ret = {source: '', id: '', img: '', url: ''};
  const urlParts = helpers.url.params(trailer);
  if (trailer.indexOf('youtube') > -1) {
    ret.source = 'youtube';
    ret.id = urlParts.videoid;
    ret.img = `http://img.youtube.com/vi/${ret.id}/0.jpg`;
    ret.url = `https://www.youtube.com/watch?v=${ret.id}`;
  }
  return ret;
};

//# Is current protocol https
helpers.url.isSecureProtocol = function() {
  const secure = (typeof document !== 'undefined' && document !== null) && (document.location.protocol === "https:") ? true : false;
  return secure;
};
