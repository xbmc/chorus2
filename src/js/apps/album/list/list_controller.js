// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AlbumApp.List", function(List, App, Backbone, Marionette, $, _) {

  var API = {

    bindTriggers(view) {
      App.listenTo(view, 'childview:album:play', (list, item) => App.execute('album:action', 'play', item));
      App.listenTo(view, 'childview:album:add', (list, item) => App.execute('album:action', 'add', item));
      App.listenTo(view, 'childview:album:localadd', (list, item) => App.execute('album:action', 'localadd', item));
      App.listenTo(view, 'childview:album:localplay', (list, item) => App.execute('album:action', 'localplay', item));
      return App.listenTo(view, 'childview:album:edit', (parent, item) => App.execute('album:edit', item.model));
    },

    getAlbumsList(collection) {
      const view = new List.Albums({
        collection});
      API.bindTriggers(view);
      return view;
    }
  };


  //# Main controller
  List.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      const collection = App.request("album:entities");
      return App.execute("when:entity:fetched", collection, () => {

        //# Set available filters
        collection.availableFilters = this.getAvailableFilters();

        //# Top level menu path for filters
        collection.sectionId = 'music';

        //# If present set initial filter via url
        App.request('filter:init', this.getAvailableFilters());

        this.layout = this.getLayoutView(collection);

        //# Render subviews on show
        this.listenTo(this.layout, "show", () => {
          this.renderList(collection);
          return this.getFiltersView(collection);
        });
        return App.regionContent.show(this.layout);
      });
    }

    getLayoutView(collection) {
      return new List.ListLayout({
        collection});
    }

    //# Available sort and filter options
    //# See filter_app.js for available options
    getAvailableFilters() {
      return {
        sort: ['label', 'year', 'rating', 'artist', 'dateadded', 'random'],
        filter: ['year', 'genre', 'style', 'albumlabel', 'thumbsUp']
      };
    }

    //# Apply filter view and provide a handler for applying changes
    getFiltersView(collection) {
      const filters = App.request('filter:show', collection);
      this.layout.regionSidebarFirst.show(filters);
      //# Listen to when the filters change and re-render.
      return this.listenTo(filters, "filter:changed", () => {
        return this.renderList(collection);
      });
    }

    //# Get the list view with filters applied.
    renderList(collection) {
      App.execute("loading:show:view", this.layout.regionContent);
      const filteredCollection = App.request('filter:apply:entities', collection);
      const view = API.getAlbumsList(filteredCollection);
      return this.layout.regionContent.show(view);
    }
  };


  //# handler for other modules to get a list view.
  return App.reqres.setHandler("album:list:view", collection => API.getAlbumsList(collection));
});
