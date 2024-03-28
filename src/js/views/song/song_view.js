/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", (Views, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Views.SongViewPlaceholder = class SongViewPlaceholder extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = "views/song/song_placeholder";
      this.prototype.tagName = 'tr';
    }
    attributes() {
      return {
        class: 'song ph'
      };
    }
    onRender() {
      return this.$el.data('model', this.model);
    }
  });
  Cls.initClass();
  return Cls;
})());
