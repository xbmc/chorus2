// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {

  var API = {

    bindTriggers(view) {
      App.listenTo(view, 'childview:artist:play', (list, item) => App.execute('artist:action', 'play', item));
      App.listenTo(view, 'childview:artist:add', (list, item) => App.execute('artist:action', 'add', item));
      App.listenTo(view, 'childview:artist:localadd', (list, item) => App.execute('artist:action', 'localadd', item));
      App.listenTo(view, 'childview:artist:localplay', (list, item) => App.execute('artist:action', 'localplay', item));
      return App.listenTo(view, 'childview:artist:edit', (parent, item) => App.execute('artist:edit', item.model));
    },

    getArtistList(collection) {
      const view = new List.Artists({
        collection});
      API.bindTriggers(view);
      return view;
    }
  };


  //# Main controller
  List.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      const collection = App.request("artist:entities");
      return App.execute("when:entity:fetched", collection, () => {

        //# Set available filters
        collection.availableFilters = this.getAvailableFilters();

        //# Top level menu path for filters
        collection.sectionId = 'music';

        //# If present set initial filter via url
        App.request('filter:init', this.getAvailableFilters());

        this.layout = this.getLayoutView(collection);

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
        sort: ['label', 'random'],
        filter: ['mood', 'genre', 'style', 'thumbsUp']
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
      const view = API.getArtistList(filteredCollection);
      return this.layout.regionContent.show(view);
    }
  };


  //# handler for other modules to get a list view.
  return App.reqres.setHandler("artist:list:view", collection => API.getArtistList(collection));
});
