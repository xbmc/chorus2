/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", (Views, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Views.CompositeView = class CompositeView extends Backbone.Marionette.CompositeView {
    static initClass() {
      this.prototype.itemViewEventPrefix = "childview";
    }
  });
  Cls.initClass();
  return Cls;
})());
