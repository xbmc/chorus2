// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("FilterApp", function(FilterApp, App, Backbone, Marionette, $, _) {

  var API = {

    /*
      Settings/fields
    */

    sortFields: [
      {
        alias: 'title',
        type: 'string',
        defaultSort: true,
        defaultOrder: 'asc',
        key: 'title'
      },
      {
        alias: 'title',
        type: 'string',
        defaultSort: true,
        defaultOrder: 'asc',
        key: 'label'
      },
      {
        alias: 'year',
        type: 'number',
        key: 'year',
        defaultOrder: 'desc'
      },
      {
        alias: 'date added',
        type: 'string',
        key: 'dateadded',
        defaultOrder: 'desc'
      },
      {
        alias: 'rating',
        type: 'float',
        key: 'rating',
        defaultOrder: 'desc'
      },
      {
        alias: 'artist',
        type: 'string',
        key: 'artist',
        defaultOrder: 'asc'
      },
      {
        alias: 'random',
        type: 'other',
        key: 'random',
        defaultOrder: 'asc'
      },
      {
        alias: 'album',
        type: 'string',
        key: 'album',
        defaultOrder: 'asc'
      }
    ],

    //# See applyFilter() for how filterCallback are handled.
    filterFields: [
      {
        alias: 'year',
        type: 'number',
        key: 'year',
        sortOrder: 'desc',
        filterCallback: 'multiple'
      },
      {
        alias: 'genre',
        type: 'array',
        key: 'genre',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'mood',
        type: 'array',
        key: 'mood',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'style',
        type: 'array',
        key: 'style',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'unwatched',
        type: "boolean",
        key: 'unwatched',
        sortOrder: 'asc',
        filterCallback: 'unwatched'
      },
      {
        alias: 'watched',
        type: "boolean",
        key: 'watched',
        sortOrder: 'asc',
        filterCallback: 'watched'
      },
      {
        alias: 'in progress',
        type: "boolean",
        key: 'inprogress',
        sortOrder: 'asc',
        filterCallback: 'inprogress'
      },
      {
        alias: 'writer',
        type: 'array',
        key: 'writer',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'director',
        type: 'array',
        key: 'director',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'tag',
        type: 'array',
        key: 'tag',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'actor',
        type: 'object',
        property: 'name',
        key: 'cast',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'set',
        type: 'string',
        property: 'set',
        key: 'set',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'rated',
        type: 'string',
        property: 'mpaa',
        key: 'mpaa',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'studio',
        type: 'array',
        property: 'studio',
        key: 'studio',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'label',
        type: 'string',
        property: 'albumlabel',
        key: 'albumlabel',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'Thumbs up',
        type: "boolean",
        key: 'thumbsUp',
        sortOrder: 'asc',
        filterCallback: 'thumbsup'
      },
      {
        alias: 'album',
        type: 'string',
        key: 'album',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      },
      {
        alias: 'artist',
        type: 'array',
        key: 'artist',
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
    ],

    //# Wrapper for returning the available fields for sort/filter
    //# Available fields are defined in the entity controller and passed
    //# to the filter view where they are stored in cache.
    getFilterFields(type) {
      const key = type + 'Fields';
      const fields = API[key];
      //# Get available and only return fields available to this entity
      const availableFilters = API.getAvailable();
      const available = availableFilters[type];
      const ret = [];
      for (var field of fields) {
        if (helpers.global.inArray(field.key, available)) {
          ret.push(field);
        }
      }
      return ret;
    },


    /*
      Storage
    */

    //# Store filters namespace
    storeFiltersNamespace: 'filter:store:',

    getStoreNameSpace(type) {
      return API.storeFiltersNamespace + type;
    },

    //# Memory store the current filters
    setStoreFilters(filters = {}, type = 'filters') {
      const store = {};
      store[helpers.url.path()] = filters;
      helpers.cache.set(API.getStoreNameSpace(type), store);
      return App.vent.trigger('filter:changed', filters);
    },

    //# Get the current filters for this page
    getStoreFilters(type = 'filters') {
      const store = helpers.cache.get(API.getStoreNameSpace(type), {});
      const path = helpers.url.path();
      const filters = store[path] ? store[path] : {};
      const ret = {};
      if (!_.isEmpty(filters)) {
        for (var key in filters) {
          var val = filters[key];
          if (val.length > 0) {
            ret[key] = val;
          }
        }
      }
      return ret;
    },

    //# Update a given key with new values
    updateStoreFiltersKey(key, values = []) {
      const filters = API.getStoreFilters();
      filters[key] = values;
      API.setStoreFilters(filters);
      return filters;
    },

    //# Get a specific key values
    getStoreFiltersKey(key) {
      const filters = API.getStoreFilters();
      const filter = filters[key] ? filters[key] : [];
      return filter;
    },

    //# Set current sort.
    setStoreSort(method, order = 'asc') {
      const sort = {method, order};
      return API.setStoreFilters(sort, 'sort');
    },

    //# Get current sort.
    getStoreSort() {
      let sort = API.getStoreFilters('sort');
      if (!sort.method) {
        const defaults = _.findWhere(API.getFilterFields('sort'), {defaultSort: true});
        sort = {method: defaults.key, order: defaults.defaultOrder};
      }
      return sort;
    },

    //# Set available filters
    setAvailable(available) {
      return API.setStoreFilters(available, 'available');
    },

    //# Get available filters
    getAvailable() {
      return API.getStoreFilters('available');
    },


    /*
      Parsing
    */

    //# Swap the order.
    toggleOrder(order) {
      order = order === 'asc' ? 'desc' : 'asc';
      return order;
    },

    //# Parse the defaults with context of the current page
    parseSortable(items) {
      //# Set the current state
      const params = API.getStoreSort(false, 'asc');
      //# loop over the items and set the active and toggle order if active
      for (var i in items) {
        var item = items[i];
        items[i].active = false;
        items[i].order = item.defaultOrder;
        if (params.method && (item.key === params.method)) {
          items[i].active = true;
          items[i].order = this.toggleOrder(params.order);
        } else if (item.defaultSort && (params.method === false)) {
          items[i].active = true;
        }
      }
      return items;
    },

    //# Parse the active state int the current filters
    parseFilterable(items) {
      const active = API.getFilterActive();
      for (var i in items) {
        var val = items[i];
        var activeItem = _.findWhere(active, {key: val.key});
        items[i].active = activeItem !== undefined;
      }
      return items;
    },

    //# Extract the available options for a given filter from the attached collection.
    getFilterOptions(key, collection) {
      const values = App.request('filter:store:key:get', key);
      //# Filter settings for this key.
      const s = API.getFilterSettings(key);
      const items = [];
      //# Get the properties requested
      let collectionItems = collection.pluck(key);
      //# Deal with more complex nested properties (e.g. cast)
      if ((s.filterCallback === 'multiple') && (s.type === 'object')) {
        //# Limit to first 5 for each otherwise it kills the browser.
        const limited = [];
        for (var item of collectionItems) {
          for (var i in item) {
            var data = item[i];
            if (i < 5) {
              limited.push(data[s.property]);
            }
          }
        }
        collectionItems = limited;
      }
      //# Reduce the list to an array of unique items.
      _.map(_.uniq(_.flatten(collectionItems)), val => items.push({key, value: val, active: helpers.global.inArray(val,values)}));
      return items;
    },


    /*
      Apply filters
    */

    //# Apply filters to a collection.
    applyFilters(collection) {
      const sort = API.getStoreSort();
      collection.sortCollection(sort.method, sort.order);
      let filteredCollection = new App.Entities.Filtered(collection);
      const object = API.getStoreFilters();
      for (var key in object) {
        var values = object[key];
        if (values.length > 0) {
          filteredCollection = API.applyFilter(filteredCollection, key, values);
        }
      }
      return filteredCollection;
    },

    //# Apply a single filter key
    //# See entities/_base/filtered.js for custom filter methods
    applyFilter(collection, key, vals) {
      //# Get the filter settings available for this key and switch on the callback.
      const s = API.getFilterSettings(key);
      switch (s.filterCallback) {
        //# If multiple values allowed
        case 'multiple':
          if (s.type === 'array') {
            collection.filterByMultipleArray(key, vals); //# data is an array
          } else if (s.type === 'object') {
            collection.filterByMultipleObject(key, s.property, vals); //# data is an array of objects
          } else {
            collection.filterByMultiple(key, vals); //# data is not array
          }
          break;
        case 'unwatched':
          collection.filterByUnwatched();
          break;
        case 'watched':
          collection.filterByWatched();
          break;
        case 'inprogress':
          collection.filterByInProgress();
          break;
        case 'thumbsup':
          collection.filterByThumbsUp();
          break;
        default:
          collection;
      }
      return collection;
    },

    //# Get settings for a given filter
    getFilterSettings(key, availableOnly = true) {
      const filters = availableOnly === true ? API.getFilterFields('filter') : API.filterFields;
      return _.findWhere(filters, {key});
    },

    //# Get the active filters.
    getFilterActive() {
      const items = [];
      const object = API.getStoreFilters();
      for (var key in object) {
        var values = object[key];
        if (values.length > 0) {
          items.push({key, values});
        }
      }
      return items;
    }
  };



  /*
    Handlers.
  */

  //# Views and collections.

  //# Return the filters view
  App.reqres.setHandler('filter:show', function(collection) {
    API.setAvailable(collection.availableFilters);
    const filters = new FilterApp.Show.Controller({
      refCollection: collection});
    const view = filters.getFilterView();
    return view;
  });

  //# Return the filter options collection
  App.reqres.setHandler('filter:options', function(key, collection) {
    //# Get the options collection based on values in the collection.
    const options = API.getFilterOptions(key, collection);
    const optionsCollection = App.request('filter:filters:options:entities', options);
    //# Set the order of the options collection.
    const filterSettings = API.getFilterSettings(key);
    optionsCollection.sortCollection('value', filterSettings.sortOrder);
    //# Return collection
    return optionsCollection;
  });

  //# Get an active filter collection.
  App.reqres.setHandler('filter:active',  () => App.request('filter:active:entities', API.getFilterActive()));

  //# Apply filters to a collection.
  App.reqres.setHandler('filter:apply:entities', function(collection)  {
    API.setAvailable(collection.availableFilters);
    const newCollection = API.applyFilters(collection);
    App.vent.trigger('filter:filtering:stop');
    return newCollection;
  });

  //# Get a sortable collection
  App.reqres.setHandler('filter:sortable:entities', () => App.request('filter:sort:entities', API.parseSortable(API.getFilterFields('sort'))));

  //# Get a filter collection
  App.reqres.setHandler('filter:filterable:entities', () => App.request('filter:filters:entities', API.parseFilterable(API.getFilterFields('filter'))));

  //# Set a filter using a url param eg ?director=name
  App.reqres.setHandler('filter:init', function(availableFilters) {
    const params = helpers.url.params();
    if (!_.isEmpty(params)) {
      // Clear existing filters first
      API.setStoreFilters({});
      // Set sort, no validation here, wrong param might break something
      if (params.sort) {
        const order = params.order ? params.order : 'asc';
        API.setStoreSort(params.sort, order);
      }
      // Set Filter
      return (() => {
        const result = [];
        for (var key of availableFilters.filter) {
        // is one of the params an available filter
          if (params[key]) {
            var values = API.getStoreFiltersKey(key);
            var filterSettings = API.getFilterSettings(key, false);
            // If the filter doesn't exist, add and save.
            if (!helpers.global.inArray(params[key], values)) {
              if (filterSettings.type === 'number') {
                values.push(parseInt(params[key]));
              } else {
                values.push(decodeURIComponent(params[key]));
              }
              result.push(API.updateStoreFiltersKey(key, values));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  });

  //# Storage.

  //# Store a filter set
  App.reqres.setHandler('filter:store:set', function(filters) {
    API.setStoreFilters(filters);
    return filters;
  });

  //# Get a Stored a filter set
  App.reqres.setHandler('filter:store:get', () => API.getStoreFilters());

  //# Get a Stored a filter set for a given key
  App.reqres.setHandler('filter:store:key:get', key => API.getStoreFiltersKey(key));

  //# Update a key in a stored filter set.
  App.reqres.setHandler('filter:store:key:update', (key, values = []) => API.updateStoreFiltersKey(key, values));

  //# Toggle a value in a key and return the updated values
  //# This feels long winded, maybe one day refactor/compress.
  App.reqres.setHandler('filter:store:key:toggle', function(key, value) {
    const values = API.getStoreFiltersKey(key);
    let ret = [];
    //# Remove.
    if (_.indexOf(values, value) > -1) {
      const newValues = [];
      for (var i of values) {
        if (i !== value) {
          newValues.push(i);
        }
      }
      ret = newValues;
    } else {
      //# Add.
      values.push(value);
      ret = values;
    }
    API.updateStoreFiltersKey(key, ret);
    return ret;
  });

  //# Store a sort
  App.reqres.setHandler('filter:sort:store:set', (method, order = 'asc') => API.setStoreSort(method, order));

  //# Get a sort, fallback to default
  return App.reqres.setHandler('filter:sort:store:get', () => API.getStoreSort());
});
