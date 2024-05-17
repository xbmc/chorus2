// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", (Views, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Views.CollectionView = class CollectionView extends Backbone.Marionette.CollectionView {
    static initClass() {
      this.prototype.itemViewEventPrefix = "childview";
    }
    onShow() {
      return $("img.lazy").lazyload({
        threshold : 200
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
