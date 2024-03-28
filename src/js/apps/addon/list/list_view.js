/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "addon-list";
    }
  });
  Cls.initClass();

  Cls = (List.Teaser = class Teaser extends App.Views.CardView {
    static initClass() {
      this.prototype.tagName = "li";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Addons = class Addons extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.Teaser;
        this.prototype.emptyView = App.Views.EmptyViewResults;
        this.prototype.tagName = "ul";
        this.prototype.sort = 'name';
        this.prototype.className = "card-grid--square";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
