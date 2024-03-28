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
this.Kodi.module("LabApp.apiBrowser", function(apiBrowser, App, Backbone, Marionette, $, _) {

  let Cls = (apiBrowser.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "api-browser--page page-wrapper";
    }
  });
  Cls.initClass();

  // A single api method item
  Cls = (apiBrowser.apiMethodItem = class apiMethodItem extends App.Views.ItemView {
    static initClass() {
      this.prototype.className = "api-browser--method";
      this.prototype.template = 'apps/lab/apiBrowser/api_method_item';
      this.prototype.tagName = "li";
      this.prototype.triggers =
        {'click .api-method--item' : 'lab:apibrowser:method:view'};
    }
  });
  Cls.initClass();

  // List of api methods
  Cls = (apiBrowser.apiMethods = class apiMethods extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'apps/lab/apiBrowser/api_method_list';
      this.prototype.childView = apiBrowser.apiMethodItem;
      this.prototype.childViewContainer = 'ul.items';
      this.prototype.tagName = "div";
      this.prototype.className = "api-browser--methods";
    }
    onRender() {
      return $('#api-search', this.$el).filterList({
        items: '.api-browser--methods .api-browser--method',
        textSelector: '.method'
      });
    }
  });
  Cls.initClass();

  // A single api page
  Cls = (apiBrowser.apiMethodPage = class apiMethodPage extends App.Views.ItemView {
    static initClass() {
      this.prototype.className = "api-browser--page";
      this.prototype.template = 'apps/lab/apiBrowser/api_method_page';
      this.prototype.tagName = "div";
      this.prototype.triggers =
        {'click #send-command' : 'lab:apibrowser:execute'};
      this.prototype.regions =
        {'apiResult' : '#api-result'};
    }
    onShow() {
      $('.api-method--params', this.$el).html(prettyPrint(this.model.get('params')));
      if (this.model.get('type') === 'method') {
        return $('.api-method--return', this.$el).html(prettyPrint(this.model.get('returns')));
      }
    }
  });
  Cls.initClass();

  // Api browser landing (home)
  return (function() {
    Cls = (apiBrowser.apiBrowserLanding = class apiBrowserLanding extends App.Views.ItemView {
      static initClass() {
        this.prototype.className = "api-browser--landing";
        this.prototype.template = 'apps/lab/apiBrowser/api_browser_landing';
        this.prototype.tagName = "div";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
