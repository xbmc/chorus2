/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp.M3u", (M3u, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (M3u.List = class List extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/playlist/m3u/list';
      this.prototype.tagName = "pre";
      this.prototype.className = "m3u-export";
    }
    onRender() {
      const content = this.$el.text();
      // TODO: Don't get filename from the dom!
      const filename = $('.local-playlist-header h2').html() + ".m3u";
      return helpers.global.saveFileText(content, filename);
    }
  });
  Cls.initClass();
  return Cls;
})());

