/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MusicVideoApp.List", function(List, App, Backbone, Marionette, $, _) {

  var API = {

    bindTriggers(view) {
      App.listenTo(view, 'childview:musicvideo:play', (parent, viewItem) => App.execute('musicvideo:action', 'play', viewItem));
      App.listenTo(view, 'childview:musicvideo:add', (parent, viewItem) => App.execute('musicvideo:action', 'add', viewItem));
      App.listenTo(view, 'childview:musicvideo:localplay', (parent, viewItem) => App.execute('musicvideo:action', 'localplay', viewItem));
      App.listenTo(view, 'childview:musicvideo:download', (parent, viewItem) => App.execute('musicvideo:action', 'download', viewItem));
      App.listenTo(view, 'childview:musicvideo:edit', (parent, viewItem) => App.execute('musicvideo:edit', viewItem.model));
      return view;
    },

    getVideoList(collection) {
      const view = new List.Videos({
        collection});
      API.bindTriggers(view);
      return view;
    }
  };


  //# Main controller
  List.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      const collection = App.request("musicvideo:entities");
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
        sort: ['label', 'year', 'artist', 'album'],
        filter: ['studio', 'director', 'artist', 'album', 'year']
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
      const view = API.getVideoList(filteredCollection);
      return this.layout.regionContent.show(view);
    }
  };


  //# handler for other modules to get a list view.
  return App.reqres.setHandler("musicvideo:list:view", collection => API.getVideoList(collection));
});
