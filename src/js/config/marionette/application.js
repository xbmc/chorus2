/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function(Backbone) {

  return _.extend(Backbone.Marionette.Application.prototype, {

    navigate(route, options = {}) {
      // route = "#" + route if route.charAt(0) is "/"
      return Backbone.history.navigate(route, options);
    },

    getCurrentRoute() {
      const frag = Backbone.history.fragment;
      if (_.isEmpty(frag)) { return null; } else { return frag; }
    },

    startHistory() {
      if (Backbone.history) {
        return Backbone.history.start();
      }
    },

    register(instance, id) {
      if (this._registry == null) { this._registry = {}; }
      return this._registry[id] = instance;
    },

    unregister(instance, id) {
      return delete this._registry[id];
    },

    resetRegistry() {
      const oldCount = this.getRegistrySize();
      for (var key in this._registry) {
        var controller = this._registry[key];
        controller.region.close();
      }
      const msg = `There were ${oldCount} controllers in the registry, there are now ${this.getRegistrySize()}`;
      if (this.getRegistrySize() > 0) { return console.warn(msg, this._registry); } else { return console.log(msg); }
    },

    getRegistrySize() {
      return _.size(this._registry);
    }
  }
  );
})(Backbone);
