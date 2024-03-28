/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PVR.RecordingList", function(List, App, Backbone, Marionette, $, _) {

  //# Main controller
  return List.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {
      const collection = App.request("recording:entities", options.group);

      //# When fetched.
      return App.execute("when:entity:fetched", collection, () => {
        collection.sortCollection('starttime', 'desc');

        //# Get and setup the layout
        this.layout = this.getLayoutView(collection);
        this.listenTo(this.layout, "show", () => {
          this.renderChannels(collection);
          return this.getSubNav();
        });

        //# Render the layout
        return App.regionContent.show(this.layout);
      });
    }

    getLayoutView(collection) {
      return new List.Layout({
        collection});
    }

    renderChannels(collection) {
      const view = new List.RecordingList({
        collection});
      this.listenTo(view, 'childview:recording:play', function(parent, child) {
        if (child.model.get('player') === 'video') {
          return App.execute("input:resume", child.model, 'file');
        } else {
          const playlist = App.request("command:kodi:controller", child.model.get('player'), 'PlayList');
          return playlist.play('file', child.model.get('file'));
        }
      });
      return this.layout.regionContent.show(view);
    }

    getSubNav() {
      const subNav = App.request("navMain:children:show", 'pvr/tv', 'PVR');
      return this.layout.regionSidebarFirst.show(subNav);
    }
  };
});
