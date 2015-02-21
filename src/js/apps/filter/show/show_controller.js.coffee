@Kodi.module "FilterApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    getFilterView: ->
      collection = @getOption('refCollection')
      @layoutFilters = @getLayoutView collection

      ## Render subviews.
      @listenTo @layoutFilters, "show", =>
        @getSort()
        @getFilters()
        @getActive()
        @getSections()

      ## Change panes.
      @listenTo @layoutFilters, 'filter:layout:close:filters', =>
        @stateChange('normal')
      @listenTo @layoutFilters, 'filter:layout:close:options', =>
        @stateChange('filters')
      @listenTo @layoutFilters, 'filter:layout:open:filters', =>
        @stateChange('filters')
      @listenTo @layoutFilters, 'filter:layout:open:options', =>
        @stateChange('options')

      ## Return layout view.
      @layoutFilters


    ## Get the base layout
    getLayoutView: (collection) ->
      new Show.FilterLayout
        collection: collection


    getSort: ->
      sortCollection = App.request 'filter:sortable:entities'
      sortView = new Show.SortList
        collection: sortCollection
      @layoutFilters.regionSort.show sortView
      ## Listen to click.
      App.listenTo sortView, "childview:filter:sortable:select", (parentview, childview) =>
        App.request 'filter:sort:store:set', childview.model.get('key'), childview.model.get('order')
        @layoutFilters.trigger 'filter:changed'
        @getSort()


    getFilters: (clearOptions = true) ->
      filterCollection = App.request 'filter:filterable:entities'
      filtersView = new Show.FilterList
        collection: filterCollection
      ## On filterable click.
      App.listenTo filtersView, "childview:filter:filterable:select", (parentview, childview) =>
        key = childview.model.get('key')
        if childview.model.get('type') is 'boolean'  ## No options
          App.request 'filter:store:key:toggle', key, childview.model.get('alias')
          @triggerChange()
        else
          @getFilterOptions key
          @stateChange('options')
      ## Render the filters.
      @layoutFilters.regionFiltersList.show filtersView
      ## Empty the options ready for a change.
      if clearOptions
        @layoutFilters.regionFiltersOptions.empty()


    getActive: ->
      activeCollection = App.request 'filter:active'
      optionsView = new Show.ActiveList
        collection: activeCollection
      @layoutFilters.regionFiltersActive.show optionsView
      ## Get a new filtered collection and the current keys.
      App.listenTo optionsView, "childview:filter:option:remove", (parentview, childview) =>
        key = childview.model.get('key')
        App.request 'filter:store:key:update', key, []
        @triggerChange()
      ## Bind to new and open filter pane
      App.listenTo optionsView, "childview:filter:add", (parentview, childview) =>
        @stateChange('filters')
      ## Add/remove filter bar
      @getFilterBar()

    getFilterOptions: (key) ->
      ## Create the options list view and add to dom
      optionsCollection = App.request 'filter:options', key, @getOption('refCollection')
      optionsView = new Show.OptionList
        collection: optionsCollection
      @layoutFilters.regionFiltersOptions.show optionsView
      ## Get a new filtered collection and the current keys.
      App.listenTo optionsView, "childview:filter:option:select", (parentview, childview) =>
        value = childview.model.get('value')
        childview.view.$el.find('.option').toggleClass('active')
        App.request 'filter:store:key:toggle', key, value
        @triggerChange(false) ## dont clear options.
      ## Deselect all
      App.listenTo optionsView, 'filter:option:deselectall', (parentview) =>
        parentview.view.$el.find('.option').removeClass('active')
        App.request 'filter:store:key:update', key, []
        @triggerChange(false) ## dont clear options.

    ## When something has changed. rerender the actives and notify other watchers.
    triggerChange: (clearOptions = true) ->
      @getFilters(clearOptions)
      @getActive()
      App.navigate helpers.url.path()
      @layoutFilters.trigger 'filter:changed'


    ## Deal with the filters bar showing all active filters
    getFilterBar: ->
      currentFilters = App.request 'filter:store:get'
      list = _.flatten _.values(currentFilters)
      $wrapper = $('.layout-container')
      $list = $('.region-content-top', $wrapper)
      if list.length > 0
        bar = new Show.FilterBar({filters: list})
        $list.html bar.render().$el
        $wrapper.addClass('filters-active')
        App.listenTo bar, 'filter:remove:all', =>
          App.request 'filter:store:set', {}
          @triggerChange()
          @stateChange('normal')
      else
        $wrapper.removeClass('filters-active')


    ## state changes (slide the filter panes in and out)
    stateChange: (state = 'normal') ->
      $wrapper = @layoutFilters.$el.find('.filters-container')
      switch state
        when 'filters'
          $wrapper.removeClass('show-options').addClass('show-filters')
        when 'options'
          $wrapper.addClass('show-options').removeClass('show-filters')
        else
          $wrapper.removeClass('show-options').removeClass('show-filters')


    ## Populate the sections with structure from mainNav.
    getSections: ->
      collection = @getOption('refCollection')
      if collection.sectionId
        nav = App.request "navMain:children:show", collection.sectionId, 'Sections'
        @layoutFilters.regionNavSection.show nav
