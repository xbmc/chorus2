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

    ## When something has changed. rerender the actives and notify other watchers.
    triggerChange: (clearOptions = true) ->
      @getFilters(clearOptions)
      @getActive()
      @layoutFilters.trigger 'filter:changed'


    ## Populate the sections with structure from mainNav.
    getSections: ->
      collection = @getOption('refCollection')
      ## For some annoying reason region manager is not finding the damn region
      ## in the layout when clearly it exists!! Too much time wasted on this so
      ## just using jQuery instead
      $layout = @layoutFilters.$el
      if collection.sectionId
        ## We have a mainNav parentId, retrieve the view based on that.
        nav = App.request "navMain:children:show", collection.sectionId
        n = nav.render()
        $layout.find('.nav-items').html( n.$el )
        ## below line doesnt work :(
        ## @layoutFilters.regionNavItems.show nav
      else
        ## Remove the title from the nav section
        $layout.find('.nav-section').empty()
        ## below line doesnt work :(
        ## @layoutFilters.regionNavSection.empty()