/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SearchApp.Show", (Show, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Show.Landing = class Landing extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/search/show/landing';
    }
  });
  Cls.initClass();
  return Cls;
})());
