(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('backbone'));
  }
  else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  }
  else {
    var globalAlias = 'FilteredCollection';
    var namespace = globalAlias.split('.');
    var parent = root;
    for ( var i = 0; i < namespace.length-1; i++ ) {
      if ( parent[namespace[i]] === undefined ) parent[namespace[i]] = {};
      parent = parent[namespace[i]];
    }
    parent[namespace[namespace.length-1]] = factory(root['_'], root['Backbone']);
  }
}(this, function(_, Backbone) {
  function _requireDep(name) {
    return {'underscore': _, 'backbone': Backbone}[name];
  }

  var _bundleExports = (function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            var _ = _requireDep('underscore');
            var Backbone = _requireDep('backbone');
            var proxyCollection = _require(1);
            var createFilter = _require(2);
            function invalidateCache() {
                this._filterResultCache = {};
            }
            function invalidateCacheForFilter(filterName) {
                for (var cid in this._filterResultCache) {
                    if (this._filterResultCache.hasOwnProperty(cid)) {
                        delete this._filterResultCache[cid][filterName];
                    }
                }
            }
            function addFilter(filterName, filterObj) {
                if (this._filters[filterName]) {
                    invalidateCacheForFilter.call(this, filterName);
                }
                this._filters[filterName] = filterObj;
                this.trigger('filtered:add', filterName);
            }
            function removeFilter(filterName) {
                delete this._filters[filterName];
                invalidateCacheForFilter.call(this, filterName);
                this.trigger('filtered:remove', filterName);
            }
            function execFilterOnModel(model) {
                if (!this._filterResultCache[model.cid]) {
                    this._filterResultCache[model.cid] = {};
                }
                var cache = this._filterResultCache[model.cid];
                for (var filterName in this._filters) {
                    if (this._filters.hasOwnProperty(filterName)) {
                        if (!cache.hasOwnProperty(filterName)) {
                            cache[filterName] = this._filters[filterName].fn(model);
                        }
                        if (!cache[filterName]) {
                            return false;
                        }
                    }
                }
                return true;
            }
            function execFilter() {
                var filtered = [];
                if (this._superset) {
                    filtered = this._superset.filter(_.bind(execFilterOnModel, this));
                }
                this._collection.reset(filtered);
                this.length = this._collection.length;
            }
            function onAddChange(model) {
                this._filterResultCache[model.cid] = {};
                if (execFilterOnModel.call(this, model)) {
                    if (!this._collection.get(model.cid)) {
                        var index = this.superset().indexOf(model);
                        var filteredIndex = null;
                        for (var i = index - 1; i >= 0; i -= 1) {
                            if (this.contains(this.superset().at(i))) {
                                filteredIndex = this.indexOf(this.superset().at(i)) + 1;
                                break;
                            }
                        }
                        filteredIndex = filteredIndex || 0;
                        this._collection.add(model, { at: filteredIndex });
                    }
                } else {
                    if (this._collection.get(model.cid)) {
                        this._collection.remove(model);
                    }
                }
                this.length = this._collection.length;
            }
            function onModelAttributeChange(model) {
                this._filterResultCache[model.cid] = {};
                if (!execFilterOnModel.call(this, model)) {
                    if (this._collection.get(model.cid)) {
                        this._collection.remove(model);
                    }
                }
            }
            function onAll(eventName, model, value) {
                if (eventName.slice(0, 7) === 'change:') {
                    onModelAttributeChange.call(this, arguments[1]);
                }
            }
            function onModelRemove(model) {
                if (this.contains(model)) {
                    this._collection.remove(model);
                }
                this.length = this._collection.length;
            }
            function Filtered(superset) {
                this._superset = superset;
                this._collection = new Backbone.Collection(superset.toArray());
                proxyCollection(this._collection, this);
                this.resetFilters();
                this.listenTo(this._superset, 'reset sort', execFilter);
                this.listenTo(this._superset, 'add change', onAddChange);
                this.listenTo(this._superset, 'remove', onModelRemove);
                this.listenTo(this._superset, 'all', onAll);
            }
            var methods = {
                    defaultFilterName: '__default',
                    filterBy: function (filterName, filter) {
                        if (!filter) {
                            filter = filterName;
                            filterName = this.defaultFilterName;
                        }
                        addFilter.call(this, filterName, createFilter(filter));
                        execFilter.call(this);
                        return this;
                    },
                    removeFilter: function (filterName) {
                        if (!filterName) {
                            filterName = this.defaultFilterName;
                        }
                        removeFilter.call(this, filterName);
                        execFilter.call(this);
                        return this;
                    },
                    resetFilters: function () {
                        this._filters = {};
                        invalidateCache.call(this);
                        this.trigger('filtered:reset');
                        execFilter.call(this);
                        return this;
                    },
                    superset: function () {
                        return this._superset;
                    },
                    refilter: function (arg) {
                        if (typeof arg === 'object' && arg.cid) {
                            onAddChange.call(this, arg);
                        } else {
                            invalidateCache.call(this);
                            execFilter.call(this);
                        }
                        return this;
                    },
                    getFilters: function () {
                        return _.keys(this._filters);
                    },
                    hasFilter: function (name) {
                        return _.contains(this.getFilters(), name);
                    },
                    destroy: function () {
                        this.stopListening();
                        this._collection.reset([]);
                        this._superset = this._collection;
                        this.length = 0;
                        this.trigger('filtered:destroy');
                    }
                };
            _.extend(Filtered.prototype, methods, Backbone.Events);
            module.exports = Filtered;
        },
        function (module, exports) {
            var _ = _requireDep('underscore');
            var Backbone = _requireDep('backbone');
            var blacklistedMethods = [
                    '_onModelEvent',
                    '_prepareModel',
                    '_removeReference',
                    '_reset',
                    'add',
                    'initialize',
                    'sync',
                    'remove',
                    'reset',
                    'set',
                    'push',
                    'pop',
                    'unshift',
                    'shift',
                    'sort',
                    'parse',
                    'fetch',
                    'create',
                    'model',
                    'off',
                    'on',
                    'listenTo',
                    'listenToOnce',
                    'bind',
                    'trigger',
                    'once',
                    'stopListening'
                ];
            var eventWhiteList = [
                    'add',
                    'remove',
                    'reset',
                    'sort',
                    'destroy',
                    'sync',
                    'request',
                    'error'
                ];
            function proxyCollection(from, target) {
                function updateLength() {
                    target.length = from.length;
                }
                function pipeEvents(eventName) {
                    var args = _.toArray(arguments);
                    var isChangeEvent = eventName === 'change' || eventName.slice(0, 7) === 'change:';
                    if (eventName === 'reset') {
                        target.models = from.models;
                    }
                    if (_.contains(eventWhiteList, eventName)) {
                        if (_.contains([
                                'add',
                                'remove',
                                'destroy'
                            ], eventName)) {
                            args[2] = target;
                        } else if (_.contains([
                                'reset',
                                'sort'
                            ], eventName)) {
                            args[1] = target;
                        }
                        target.trigger.apply(this, args);
                    } else if (isChangeEvent) {
                        if (target.contains(args[1])) {
                            target.trigger.apply(this, args);
                        }
                    }
                }
                var methods = {};
                _.each(_.functions(Backbone.Collection.prototype), function (method) {
                    if (!_.contains(blacklistedMethods, method)) {
                        methods[method] = function () {
                            return from[method].apply(from, arguments);
                        };
                    }
                });
                _.extend(target, Backbone.Events, methods);
                target.listenTo(from, 'all', updateLength);
                target.listenTo(from, 'all', pipeEvents);
                target.models = from.models;
                updateLength();
                return target;
            }
            module.exports = proxyCollection;
        },
        function (module, exports) {
            var _ = _requireDep('underscore');
            function convertKeyValueToFunction(key, value) {
                return function (model) {
                    return model.get(key) === value;
                };
            }
            function convertKeyFunctionToFunction(key, fn) {
                return function (model) {
                    return fn(model.get(key));
                };
            }
            function createFilterObject(filterFunction, keys) {
                if (!_.isArray(keys)) {
                    keys = null;
                }
                return {
                    fn: filterFunction,
                    keys: keys
                };
            }
            function createFilterFromObject(filterObj) {
                var keys = _.keys(filterObj);
                var filterFunctions = _.map(keys, function (key) {
                        var val = filterObj[key];
                        if (_.isFunction(val)) {
                            return convertKeyFunctionToFunction(key, val);
                        }
                        return convertKeyValueToFunction(key, val);
                    });
                var filterFunction = function (model) {
                    for (var i = 0; i < filterFunctions.length; i++) {
                        if (!filterFunctions[i](model)) {
                            return false;
                        }
                    }
                    return true;
                };
                return createFilterObject(filterFunction, keys);
            }
            function createFilter(filter, keys) {
                if (_.isFunction(filter)) {
                    return createFilterObject(filter, keys);
                }
                if (_.isObject(filter)) {
                    return createFilterFromObject(filter);
                }
            }
            module.exports = createFilter;
        }
    ];
    return  _require(0);
}());

  return _bundleExports;
}));