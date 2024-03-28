/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// View for the API Browser.
//
// @param [Object] This app object
// @param [Object] The full application object
// @param [Object] Backbone
// @param [Object] Marionette
// @param [Object] jQuery
// @param [Object] lodash (underscore)
//
this.Kodi.module("HelpApp.Show", (Show, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Show.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "help--page page-wrapper";
    }
    onRender() {
      // Set the data.
      return $(this.regionContent.el, this.$el).html(this.options.data);
    }
  });
  Cls.initClass();
  return Cls;
})());
