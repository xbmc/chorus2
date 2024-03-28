/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  return Entities.Model = class Model extends Backbone.Model {

    //# Set our custom cache keys.
    constructor(...args) {
      super(...args);
      this.saveSuccess = this.saveSuccess.bind(this);
      this.saveError = this.saveError.bind(this);
    }

    getCacheKey(options) {
      const key = this.constructor.name;
      return key;
    }

    destroy(options = {}) {
      _.defaults(options,
        {wait: true});

      this.set({_destroy: true});
      return super.destroy(options);
    }

    isDestroyed() {
      return this.get("_destroy");
    }

    save(data, options = {}) {
      const isNew = this.isNew();

      _.defaults(options, {
        wait: true,
        success:  _.bind(this.saveSuccess, this, isNew, options.collection),
        error:    _.bind(this.saveError, this)
      }
      );

      this.unset("_errors");
      return super.save(data, options);
    }

    saveSuccess(isNew, collection) {
      if (isNew) { //# model is being created
        if (collection) { collection.add(this); }
        if (collection) { collection.trigger("model:created", this); }
        return this.trigger("created", this);
      } else { //# model is being updated
        if (collection == null) { ({
          collection
        } = this); } //# if model has collection property defined, use that if no collection option exists
        if (collection) { collection.trigger("model:updated", this); }
        return this.trigger("updated", this);
      }
    }

    saveError(model, xhr, options) {
      //# set errors directly on the model unless status returned was 500 or 404
      if ((xhr.status !== 500) && (xhr.status !== 404)) { return this.set({_errors: __guard__($.parseJSON(xhr.responseText), x => x.errors)}); }
    }
  };
});


function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}