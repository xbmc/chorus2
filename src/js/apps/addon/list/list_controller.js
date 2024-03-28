/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AddonApp.List", function(List, App, Backbone, Marionette, $, _) {


  //# Main controller
  return List.Controller = class Controller extends App.Controllers.Base {

    //# Setup
    initialize(options) {
      this.type = options.type;
      return App.request("addon:entities", this.type, collection => {
        collection.sortCollection('name');
        this.layout = this.getLayoutView(collection);
        this.listenTo(this.layout, "show", () => {
          this.renderList(collection);
          return this.renderSidebar();
        });
        return App.regionContent.show(this.layout);
      });
    }

    //# Render items
    renderList(collection) {
      const view = new List.Addons({
        collection});
      return this.layout.regionContent.show(view);
    }

    //# Get the base layout
    getLayoutView(collection) {
      return new List.ListLayout({
        collection});
    }

    //# Add side nav
    renderSidebar() {
      const settingsNavView = App.request("navMain:children:show", 'addons/all', 'Add-ons');
      return this.layout.regionSidebarFirst.show(settingsNavView);
    }
  };
});

