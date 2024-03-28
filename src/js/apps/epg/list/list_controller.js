/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("EPGApp.List", function(List, App, Backbone, Marionette, $, _) {

  const API = {

    bindTriggers(view) {
      App.listenTo(view, 'childview:broadcast:play', (parent, child) => App.execute('broadcast:action', 'play', child));
      App.listenTo(view, 'childview:broadcast:record', (parent, child) => App.execute('broadcast:action', 'record', child));
      return App.listenTo(view, 'childview:broadcast:timer', (parent, child) => App.execute('broadcast:action', 'timer', child));
    },

    bindChannelTriggers(view) {
      App.listenTo(view, 'broadcast:play', child => App.execute('broadcast:action', 'play', child));
      App.listenTo(view, 'broadcast:record', child => App.execute('broadcast:action', 'record', child));
      return App.listenTo(view, 'broadcast:timer', child => App.execute('broadcast:action', 'timer', child));
    }
  };

  //# Main controller
  return List.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {
      const model = App.request('channel:entity', options.channelid);
      return App.execute("when:entity:fetched", model, () => {
        const collection = App.request("broadcast:entities", options.channelid);

        //# When fetched.
        return App.execute("when:entity:fetched", collection, () => {

          //# Get and setup the layout
          this.layout = this.getLayoutView(collection);
          this.listenTo(this.layout, "show", () => {
            this.getSubNav(model);
            this.getChannelActions(model);
            return this.renderProgrammes(collection);
          });

          //# Render the layout
          return App.regionContent.show(this.layout);
        });
      });
    }

    getLayoutView(collection) {
      return new List.Layout({
        collection});
    }

    renderProgrammes(collection) {
      const view = new List.EPGList({
        collection});
      API.bindTriggers(view);
      return this.layout.regionContent.show(view);
    }

    getSubNav(model) {
      const subNav = App.request("navMain:children:show", 'pvr/tv', 'PVR');
      return this.layout.regionSidebarFirst.show(subNav);
    }

    getChannelActions(model) {
      const view = new List.ChannelActions({
        model});
      API.bindChannelTriggers(view);
      return this.layout.appendSidebarView('channel-actions', view);
    }
  };
});
