/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("localPlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {

  return List.Controller = class Controller extends App.Controllers.Base {

    initialize(options) {
      const {
        id
      } = options;
      const playlists = App.request("localplaylist:entities");
      this.layout = this.getLayoutView(playlists);

      this.listenTo(this.layout, "show", () => {
        this.getListsView(playlists);
        return this.getItems(id);
      });

      return App.regionContent.show(this.layout);
    }

    //# Get the layout
    getLayoutView(collection) {
      return new List.ListLayout({
        collection});
    }

    //# Get the sidebar list
    getListsView(playlists) {
      this.sideLayout = new List.SideLayout();
      const view = new List.Lists({
        collection: playlists});
      App.listenTo(this.sideLayout, "show", () => {
        if (playlists.length > 0) {
          return this.sideLayout.regionLists.show(view);
        }
      });
      App.listenTo(this.sideLayout, 'lists:new', () => App.execute("localplaylist:newlist"));
      return this.layout.regionSidebarFirst.show(this.sideLayout);
    }

    //# Get items then render
    getItems(id) {
      const playlist = App.request("localplaylist:entity", id);
      const collection = App.request("localplaylist:item:entities", id);
      this.itemLayout = new List.Layout({
        list: playlist});
      App.listenTo(this.itemLayout, "show", () => {
        if (collection.length > 0) {
          const media = playlist.get('media');
          const view = App.request(`${media}:list:view`, collection, true);
          this.itemLayout.regionListItems.show(view);
          this.bindRemove(id, view);
          return this.initSortable(id, view);
        }
      });
      this.bindLayout(id);
      return this.layout.regionContent.show(this.itemLayout);
    }

    //# Binds to layout
    bindLayout(id) {
      const collection = App.request("localplaylist:item:entities", id);
      App.listenTo(this.itemLayout, 'list:clear', function() {
        App.execute("localplaylist:clear:entities", id);
        return App.execute("localplaylist:reload", id);
      });
      App.listenTo(this.itemLayout, 'list:delete', function() {
        App.execute("localplaylist:clear:entities", id);
        App.execute("localplaylist:remove:entity", id);
        return App.navigate("playlists", {trigger: true});
    });
      App.listenTo(this.itemLayout, 'list:rename', () => App.execute("localplaylist:rename", id));
      App.listenTo(this.itemLayout, 'list:play', function() {
        const kodiPlaylist = App.request("command:kodi:controller", 'audio', 'PlayList');
        return kodiPlaylist.playCollection(collection);
      });
      App.listenTo(this.itemLayout, 'list:localplay', function() {
        const localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
        return localPlaylist.playCollection(collection);
      });
      return App.listenTo(this.itemLayout, 'list:export', () => App.execute("playlist:export", collection));
    }

    //# Binds to items
    bindRemove(id, view) {
      return App.listenTo(view, 'childview:song:remove', (parent, viewItem) => {
        // Update the order, exclude removed item
        return this.updateOrder(id, view.$el, [parent.$el.data('id')]);
    });
    }

    //# Bind sortable
    initSortable(id, view) {
      const self = this;
      return $('tbody', view.$el).sortable({
        onEnd: e => {
          return self.updateOrder(id, this.el);
        }
      });
    }

    //# Rebuild the order of items after sort or item removal, excluded items
    //# will get removed from the collection
    updateOrder(playlistId, $ctx, exclude = []) {
      const order = [];
      let pos = 0;
      $('tr', $ctx).each(function(i, d) {
        const id = $(d).data('id');
        if (helpers.global.inArray(id, exclude)) {
          return $(d).remove();
        } else {
          order.push(id);
          $(d).data('id', pos);
          return pos++;
        }
      });
      return App.request("localplaylist:item:updateorder", playlistId, order);
    }
  };
});
