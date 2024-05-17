// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
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
this.Kodi.module("HelpApp.Overview", function(Overview, App, Backbone, Marionette, $, _) {

  let Cls = (Overview.Page = class Page extends App.Views.CompositeView {
    static initClass() {
      this.prototype.className = "help--overview";
      this.prototype.template = 'apps/help/overview/overview';
      this.prototype.tagName = "div";
    }
    onRender() {
      // Set the data/header.
      return $('.help--overview--header', this.$el).html(this.options.data);
    }
  });
  Cls.initClass();


  return (function() {
    Cls = (Overview.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
      static initClass() {
        this.prototype.className = "help--page help--overview page-wrapper";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
