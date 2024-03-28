/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.List", function(List, App, Backbone, Marionette, $, _) {

  var API = {

    getTVShowsList(tvshows, set = false) {
      const viewName = set ? 'TVShowsSet' : 'TVShows';
      const view = new (List[viewName])({
        collection: tvshows});
      API.bindTriggers(view);
      return view;
    },

    bindTriggers(view) {
      App.listenTo(view, 'childview:tvshow:play', (parent, viewItem) => App.execute('tvshow:action', 'play', viewItem));
      App.listenTo(view, 'childview:tvshow:add', (parent, viewItem) => App.execute('tvshow:action', 'add', viewItem));
      App.listenTo(view, 'childview:tvshow:watched', (parent, viewItem) => App.execute('tvshow:action:watched', parent, viewItem));
      return App.listenTo(view, 'childview:tvshow:edit', (parent, viewItem) => App.execute('tvshow:edit', viewItem.model));
    }
  };

  //# Main controller
  List.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      const collection = App.request("tvshow:entities");

      //# Set available filters
      collection.availableFilters = this.getAvailableFilters();

      //# Top level menu path for filters
      collection.sectionId = 'tvshows/recent';

      //# If present set initial filter via url
      App.request('filter:init', this.getAvailableFilters());

      //# When fetched.
      return App.execute("when:entity:fetched", collection, () => {


        //# Get and setup the layout
        this.layout = this.getLayoutView(collection);
        this.listenTo(this.layout, "show", () => {
          this.getFiltersView(collection);
          return this.renderList(collection);
        });

        //# Render the layout
        return App.regionContent.show(this.layout);
      });
    }

    getLayoutView(tvshows) {
      return new List.ListLayout({
        collection: tvshows});
    }


    //# Available sort and filter options
    //# See filter_app.js for available options
    getAvailableFilters() {
      return {
        sort: ['title', 'year', 'dateadded', 'rating', 'random'],
        filter: ['year', 'genre', 'unwatched', 'inprogress', 'cast', 'mpaa', 'studio', 'thumbsUp', 'tag']
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
      const view = API.getTVShowsList(filteredCollection);
      return this.layout.regionContent.show(view);
    }
  };


  //# handler for other modules to get a list view.
  return App.reqres.setHandler("tvshow:list:view", collection => API.getTVShowsList(collection, true));
});
