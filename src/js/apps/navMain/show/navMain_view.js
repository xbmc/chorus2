/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("NavMain", function(NavMain, App, Backbone, Marionette, $, _) {

  let Cls = (NavMain.List = class List extends Backbone.Marionette.ItemView {
    static initClass() {
      this.prototype.template = "apps/navMain/show/navMain";
    }
  });
  Cls.initClass();

  Cls = (NavMain.Item = class Item extends Backbone.Marionette.ItemView {
    static initClass() {
      this.prototype.template = "apps/navMain/show/nav_item";
      this.prototype.tagName = "li";
    }
    initialize() {
      const classes = [];
      if (this.model.get('path') === helpers.url.path()) {
        classes.push('active');
      }
      const tag = this.themeLink(this.model.get('title'), this.model.get('path'), {'className': classes.join(' ')});
      return this.model.set({link: tag});
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (NavMain.ItemList = class ItemList extends App.Views.CompositeView {
      static initClass() {
        this.prototype.template = 'apps/navMain/show/nav_sub';
        this.prototype.childView = NavMain.Item;
        this.prototype.tagName = "div";
        this.prototype.childViewContainer = 'ul.items';
        this.prototype.className = "nav-sub";
      }
      initialize() {
        return this.collection = this.model.get('items');
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
