// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Entity Helpers
*/
helpers.entities = {};

// Create a UniqueID (uid) from a model object (raw)
// Numerical id is the preference, fallback to file
helpers.entities.createUid = function(model, type) {
  type = type ? type : model.type;
  const {
    id
  } = model;
  let uid = 'none';
  if ((typeof id === 'number') || (type === 'season')) {
    uid = id;
  } else {
    const {
      file
    } = model;
    if (file) {
      const hash = helpers.global.hashEncode(file);
      uid = 'path-' + hash.substring(0, 26);
    }
  }
  // Return pre-pending th type
  return type + '-' + uid;
};


//# Get fields for an entity given the set and type.
helpers.entities.getFields = function(set, type = 'small') {
  if (!_.isObject(set) || !set[type]) {
    [];
  }
  const fields = set.minimal;
  if (type === 'full') {
    return fields.concat(set.small).concat(set.full);
  } else if (type === 'small') {
    return fields.concat(set.small);
  } else {
    return fields;
  }
};

//# Build a subtitle based on the content.
helpers.entities.getSubtitle = function(model) {
  let subtitle = '';
  switch (model.type) {
    case 'song':
      if (model.artist) {
        subtitle = model.artist.join(',');
      }
      break;
    default:
      subtitle = '';
  }
  return subtitle;
};

//# Basic link to entity
helpers.entities.playingLink = model => `<a href='#${model.url}'>${_.escape(model.label)}</a>`;

//# Is watched
helpers.entities.isWatched = function(model) {
  let watched = false;
  if ((model != null) && model.get('playcount')) {
    watched = model.get('playcount') > 0 ? true : false;
  }
  return watched;
};

// Set progress on an entity.
helpers.entities.setProgress = function($el, progress) {
  progress = progress + '%';
  return $el.find('.current-progress').css('width', progress).attr('title', progress + ' ' + t.gettext('complete'));
};

//# Get default options
helpers.entities.buildOptions = function(options) {
  const defaultOptions = {useNamedParameters: true};
  // Only cache if we are not using filters.
  if (!options.filter) {
    defaultOptions.cache = true;
    defaultOptions.expires = config.get('static', 'collectionCacheExpiry');
  }
  return _.extend(defaultOptions, options);
};

//# Returns the Chorus search menu items for local and addon search.
helpers.entities.getAddonSearchMenuItems = function(query) {
  const addonSearches = Kodi.request("addon:search:enabled");
  let ret = '<li data-type="all" data-query="' + query + '">' + tr('Local media') + '</li>';
  if (addonSearches.length > 0) {
    ret += '<li class="divider"></li>';
    for (var addonSearch of addonSearches) {
      ret += '<li data-type="' + addonSearch.id + '" data-query="' + query + '">' +  tr(addonSearch.title)+ '</li>';
    }
  }
  return ret;
};

//# Wrapper for refreshing an entity. As a refresh removes the ID we need to wrap a bunch of extra logic around it.
//# ie: Show a confirm box, a few seconds after confirm, search for entity with the same title and redirect to the id
//# if we are on the same page AND deal with cache and thumbs up which both use IDs
//# This is NOT robust and overly complex! but should work 95% of the time.
helpers.entities.refreshEntity = function(model, controller, method, params = {}) {
  const title = model.get('label');
  const type = model.get('type');
  const originalPath = model.get('url');
  const refreshTimeout = type === 'tvshow' ? 10000 : 3000;
  const baseUrl = model.get('url').split('/').slice(0,-1).join('/');
  const thumbs = Kodi.request("thumbsup:check", model);
  params.ignorenfo = config.getLocal('refreshIgnoreNFO', true);
  // Show confirm box
  return Kodi.execute("ui:modal:confirm", tr('Are you sure?'), _.escape(t.sprintf(tr('Confirm refresh'), title)), function() {
    // Clear model from cache and remove thumbs up
    Backbone.fetchCache.clearItem(model);
    if (thumbs) {
      Kodi.request("thumbsup:toggle:entity", model);
    }
    // Do the refresh using the provided controller/method.
    return controller[method](model.get('id'), params, function(resp) {
      Kodi.execute("notification:show", tr("Refreshed media. Additional updates may still be occurring in the background"));
      // After a few seconds, search by title to try and get a new id, then refresh. Fallback to search page
      return setTimeout(function() {
        // Episodes redirect to season as might not have a lookup title
        if (title) {
          const opts = {
            limits: {start: 0, end: 1},
            filter: {'operator': 'is', 'field': 'title', 'value': title},
            sort: {method: 'none', order: 'descending'},
            success(collection) {
              if (collection.length) {
                const newModel = collection.first();
                if (thumbs) {
                  Kodi.request("thumbsup:toggle:entity", newModel);
                }
                if (originalPath === helpers.url.path()) {
                  return Kodi.navigate(baseUrl + "/" + newModel.get('id'), {trigger: true});
                }
              } else {
                Kodi.execute("notification:show", tr("Refreshed media not found, redirecting to search"));
                return Kodi.navigate("search/" + type + "/" + title, {trigger: true});
              }
            }
          };
          return Kodi.request(type + ":entities", opts);
        }
      }
      , refreshTimeout);
    });
  });
};
