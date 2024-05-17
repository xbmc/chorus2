// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CategoryApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "category-list";
    }
  });
  Cls.initClass();

  Cls = (List.Item = class Item extends App.Views.CardView {
    static initClass() {
      this.prototype.template = 'apps/category/list/item';
      this.prototype.tagName = "li";
      this.prototype.className = "card category";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.CategoryList = class CategoryList extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.Item;
        this.prototype.tagName = "ul";
        this.prototype.className = "card-grid--square";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
