// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("LoadingApp.Show", (Show, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Show.Page = class Page extends Backbone.Marionette.ItemView {
    static initClass() {
      this.prototype.template = "apps/loading/show/loading_page";
    }
    onRender() {
      return this.$el.find('h2').html(this.options.textHtml);
    }
    attributes() {
      if (this.options.inline) {
        return {
          class: 'loader-inline'
        };
      }
    }
  });
  Cls.initClass();
  return Cls;
})());
