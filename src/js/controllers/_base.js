// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Controllers", (Controllers, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Controllers.Base = class Base extends Backbone.Marionette.Controller {
    static initClass() {

      this.prototype.params = {};
    }

    constructor(options = {}) {
      super(options);
      this.region = options.region || App.request("default:region");
      this.params = helpers.url.params();
      this._instance_id = _.uniqueId("controller");
      App.execute("register:instance", this, this._instance_id);
    }

    close(...args) {
      delete this.region;
      delete this.options;
      super.close(args);
      return App.execute("unregister:instance", this, this._instance_id);
    }

    show(view) {
      this.listenTo(view, "close", this.close);
      return this.region.show(view);
    }
  });
  Cls.initClass();
  return Cls;
})());
