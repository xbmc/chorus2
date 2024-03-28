/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
(function(Backbone) {
  let methods;
  const _sync = Backbone.sync;

  Backbone.sync = function(method, entity, options = {}) {
    _.defaults(options, {
    beforeSend: _.bind(methods.beforeSend,  entity),
    complete:   _.bind(methods.complete,    entity)
  }
    );

    const sync = _sync(method, entity, options);

    if (!entity._fetch && (method === "read")) {
      return entity._fetch = sync;
    }
  };

  return methods = {
    beforeSend() {
      return this.trigger("sync:start", this);
    },

    complete() {
      return this.trigger("sync:stop", this);
    }
  };
})(Backbone);
