// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PVR.ChannelList", function(List, App, Backbone, Marionette, $, _) {


  //# Main controller
  return List.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {
      const collection = App.request("channel:entities", options.group);

      //# When fetched.
      return App.execute("when:entity:fetched", collection, () => {

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
      const view = new List.ChannelList({
        collection});
      this.listenTo(view, 'childview:channel:play', function(parent, child) {
        const player = App.request("command:kodi:controller", 'auto', 'Player');
        return player.playEntity('channelid', child.model.get('id'), {},  () => {});
      });
          //# update state?
      this.listenTo(view, 'childview:channel:record', function(parent, child) {
        const pvr = App.request("command:kodi:controller", 'auto', 'PVR');
        return pvr.setRecord(child.model.get('id'), {}, () => App.execute("notification:show", tr("Channel recording toggled")));
      });
      return this.layout.regionContent.show(view);
    }

    getSubNav() {
      const subNav = App.request("navMain:children:show", 'pvr/tv', 'PVR');
      return this.layout.regionSidebarFirst.show(subNav);
    }
  };
});
