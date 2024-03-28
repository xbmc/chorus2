// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  return (Views.LayoutView = class LayoutView extends Backbone.Marionette.LayoutView {

    //# Workaround for dropdowns not closing on click
    onShow() {
      return App.execute("ui:dropdown:bind:close", this.$el);
    }
  });
});
