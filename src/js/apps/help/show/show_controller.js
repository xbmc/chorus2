// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("HelpApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  // Main controller
  return Show.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {

      // Load the page
      return App.request("help:page", options.id, data => {

        this.layout = this.getLayoutView(data);
        this.listenTo(this.layout, "show", () => {
          return this.getSideBar();
        });

        // Render layout
        App.regionContent.show(this.layout);

        // If a page view is overridden set that to the content.
        if (options.pageView) {
          return this.layout.regionContent.show(options.pageView);
        }
      });
    }

    getSideBar() {
      const subNav = App.request("help:subnav");
      return this.layout.regionSidebarFirst.show(subNav);
    }

    getLayoutView(data) {
      return new Show.Layout({
        data,
        pageView: this.options.pageView
      });
    }
  };
});
