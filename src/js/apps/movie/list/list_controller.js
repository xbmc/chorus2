/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MovieApp.List", function(List, App, Backbone, Marionette, $, _) {

  var API = {

    getMoviesView(collection, set = false) {
      const viewName = set ? 'MoviesSet' : 'Movies';
      const view = new (List[viewName])({
        collection});
      API.bindTriggers(view);
      return view;
    },

    bindTriggers(view) {
      App.listenTo(view, 'childview:movie:play', (parent, viewItem) => App.execute('movie:action', 'play', viewItem));
      App.listenTo(view, 'childview:movie:add', (parent, viewItem) => App.execute('movie:action', 'add', viewItem));
      App.listenTo(view, 'childview:movie:localplay', (parent, viewItem) => App.execute('movie:action', 'localplay', viewItem));
      App.listenTo(view, 'childview:movie:download', (parent, viewItem) => App.execute('movie:action', 'download', viewItem));
      App.listenTo(view, 'childview:movie:watched', (parent, viewItem) => App.execute('movie:action:watched', parent, viewItem));
      return App.listenTo(view, 'childview:movie:edit', (parent, viewItem) => App.execute('movie:action', 'edit', viewItem));
    }
  };

  //# Main controller
  List.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      const collection = App.request("movie:entities");

      return App.execute("when:entity:fetched", collection, () => {

        //# Set available filters
        collection.availableFilters = this.getAvailableFilters();

        //# Top level menu path for filters
        collection.sectionId = 'movies/recent';

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
        sort: ['title', 'year', 'dateadded', 'rating', 'random'],
        filter: ['year', 'genre', 'writer', 'director', 'cast', 'set', 'unwatched', 'watched', 'inprogress', 'mpaa', 'studio', 'thumbsUp', 'tag']
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
      const view = API.getMoviesView(filteredCollection);
      return this.layout.regionContent.show(view);
    }
  };

  //# handler for other modules to get a list view.
  return App.reqres.setHandler("movie:list:view", collection => API.getMoviesView(collection, true));
});
