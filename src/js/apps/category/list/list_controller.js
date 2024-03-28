/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CategoryApp.List", function(List, App, Backbone, Marionette, $, _) {


  //# Main controller
  return List.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {
      const collection = App.request(this.getOption('entityKey'), this.getOption('media'));
      return App.execute("when:entity:fetched", collection, () => {

        this.layout = this.getLayoutView(collection);
        this.listenTo(this.layout, "show", () => {
          this.renderList(collection);
          return this.getSubNav();
        });

        return App.regionContent.show(this.layout);
      });
    }

    getLayoutView(collection) {
      return new List.Layout({
        collection});
    }

    renderList(collection) {
      const view = new List.CategoryList({
        collection});
      return this.layout.regionContent.show(view);
    }

    getSubNav() {
      const subNav = App.request("navMain:children:show", this.getOption('subNavParent'), 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    }
  };
});
