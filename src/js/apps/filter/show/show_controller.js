// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("FilterApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  return Show.Controller = class Controller extends App.Controllers.Base {

    getFilterView() {
      const collection = this.getOption('refCollection');
      this.layoutFilters = this.getLayoutView(collection);

      //# Render subviews.
      this.listenTo(this.layoutFilters, "show", () => {
        this.getSort();
        this.getFilters();
        this.getActive();
        return this.getSections();
      });

      //# Change panes.
      this.listenTo(this.layoutFilters, 'filter:layout:close:filters', () => {
        return this.stateChange('normal');
      });
      this.listenTo(this.layoutFilters, 'filter:layout:close:options', () => {
        return this.stateChange('filters');
      });
      this.listenTo(this.layoutFilters, 'filter:layout:open:filters', () => {
        return this.stateChange('filters');
      });
      this.listenTo(this.layoutFilters, 'filter:layout:open:options', () => {
        return this.stateChange('options');
      });

      //# Return layout view.
      return this.layoutFilters;
    }


    //# Get the base layout
    getLayoutView(collection) {
      return new Show.FilterLayout({
        collection});
    }


    getSort() {
      const sortCollection = App.request('filter:sortable:entities');
      const sortView = new Show.SortList({
        collection: sortCollection});
      this.layoutFilters.regionSort.show(sortView);
      //# Listen to click.
      return App.listenTo(sortView, "childview:filter:sortable:select", (parentview, childview) => {
        App.request('filter:sort:store:set', childview.model.get('key'), childview.model.get('order'));
        this.layoutFilters.trigger('filter:changed');
        return this.getSort();
      });
    }


    getFilters(clearOptions = true) {
      const filterCollection = App.request('filter:filterable:entities');
      const filtersView = new Show.FilterList({
        collection: filterCollection});
      //# On filterable click.
      App.listenTo(filtersView, "childview:filter:filterable:select", (parentview, childview) => {
        const key = childview.model.get('key');
        if (childview.model.get('type') === 'boolean') {  //# No options
          App.request('filter:store:key:toggle', key, childview.model.get('alias'));
          return this.triggerChange();
        } else {
          this.getFilterOptions(key);
          return this.stateChange('options');
        }
      });
      //# Render the filters.
      this.layoutFilters.regionFiltersList.show(filtersView);
      //# Empty the options ready for a change.
      if (clearOptions) {
        return this.layoutFilters.regionFiltersOptions.empty();
      }
    }


    getActive() {
      const activeCollection = App.request('filter:active');
      const optionsView = new Show.ActiveList({
        collection: activeCollection});
      this.layoutFilters.regionFiltersActive.show(optionsView);
      //# Get a new filtered collection and the current keys.
      App.listenTo(optionsView, "childview:filter:option:remove", (parentview, childview) => {
        const key = childview.model.get('key');
        App.request('filter:store:key:update', key, []);
        return this.triggerChange();
      });
      //# Bind to new and open filter pane
      App.listenTo(optionsView, "childview:filter:add", (parentview, childview) => {
        return this.stateChange('filters');
      });
      //# Add/remove filter bar
      return this.getFilterBar();
    }

    getFilterOptions(key) {
      //# Create the options list view and add to dom
      const optionsCollection = App.request('filter:options', key, this.getOption('refCollection'));
      const optionsView = new Show.OptionList({
        collection: optionsCollection});
      this.layoutFilters.regionFiltersOptions.show(optionsView);
      //# Get a new filtered collection and the current keys.
      App.listenTo(optionsView, "childview:filter:option:select", (parentview, childview) => {
        const value = childview.model.get('value');
        childview.view.$el.find('.option').toggleClass('active');
        App.request('filter:store:key:toggle', key, value);
        return this.triggerChange(false);
      }); //# dont clear options.
      //# Deselect all
      return App.listenTo(optionsView, 'filter:option:deselectall', parentview => {
        parentview.view.$el.find('.option').removeClass('active');
        App.request('filter:store:key:update', key, []);
        return this.triggerChange(false);
      }); //# dont clear options.
    }

    //# When something has changed. rerender the actives and notify other watchers.
    triggerChange(clearOptions = true) {
      App.vent.trigger('filter:filtering:start');
      this.getFilters(clearOptions);
      this.getActive();
      App.navigate(helpers.url.path());
      return this.layoutFilters.trigger('filter:changed');
    }


    //# Deal with the filters bar showing all active filters
    getFilterBar() {
      const currentFilters = App.request('filter:store:get');
      const list = _.flatten(_.values(currentFilters));
      const $wrapper = $('.layout-container');
      const $list = $('.region-content-top', $wrapper);
      if (list.length > 0) {
        const bar = new Show.FilterBar({filters: list});
        $list.html(bar.render().$el);
        $wrapper.addClass('filters-active');
        return App.listenTo(bar, 'filter:remove:all', () => {
          App.request('filter:store:set', {});
          this.triggerChange();
          return this.stateChange('normal');
        });
      } else {
        return $wrapper.removeClass('filters-active');
      }
    }


    //# state changes (slide the filter panes in and out)
    stateChange(state = 'normal') {
      const $wrapper = this.layoutFilters.$el.find('.filters-container');
      switch (state) {
        case 'filters':
          return $wrapper.removeClass('show-options').addClass('show-filters');
        case 'options':
          return $wrapper.addClass('show-options').removeClass('show-filters');
        default:
          return $wrapper.removeClass('show-options').removeClass('show-filters');
      }
    }


    //# Populate the sections with structure from mainNav.
    getSections() {
      const collection = this.getOption('refCollection');
      if (collection.sectionId) {
        const nav = App.request("navMain:children:show", collection.sectionId, 'Sections');
        return this.layoutFilters.regionNavSection.show(nav);
      }
    }
  };
});
