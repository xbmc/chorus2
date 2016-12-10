@Kodi.module "FilterApp", (FilterApp, App, Backbone, Marionette, $, _) ->

  API =

    ###
      Settings/fields
    ###

    sortFields: [
      {
        alias: 'Title'
        type: 'string'
        defaultSort: true
        defaultOrder: 'asc'
        key: 'title'
      }
      {
        alias: 'Title'
        type: 'string'
        defaultSort: true
        defaultOrder: 'asc'
        key: 'label'
      }
      {
        alias: 'Year'
        type: 'number'
        key: 'year'
        defaultOrder: 'desc'
      }
      {
        alias: 'Date added'
        type: 'string'
        key: 'dateadded'
        defaultOrder: 'desc'
      }
      {
        alias: 'Rating'
        type: 'float'
        key: 'rating'
        defaultOrder: 'desc'
      }
      {
        alias: 'Artist'
        type: 'string'
        key: 'artist'
        defaultOrder: 'asc'
      }
    ]

    ## See applyFilter() for how filterCallback are handled.
    filterFields: [
      {
        alias: 'Year'
        type: 'number'
        key: 'year'
        sortOrder: 'desc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Genre'
        type: 'array'
        key: 'genre'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Mood'
        type: 'array'
        key: 'mood'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Style'
        type: 'array'
        key: 'style'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Unwatched'
        type: "boolean"
        key: 'unwatched'
        sortOrder: 'asc',
        filterCallback: 'unwatched'
      }
      {
        alias: 'Thumbs Up'
        type: "boolean"
        key: 'thumbsUp'
        sortOrder: 'asc',
        filterCallback: 'thumbsup'
      }
      {
        alias: 'Writer'
        type: 'array'
        key: 'writer'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Director'
        type: 'array'
        key: 'director'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Actor'
        type: 'object'
        property: 'name'
        key: 'cast'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Set'
        type: 'string'
        property: 'set'
        key: 'set'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Rated'
        type: 'string'
        property: 'mpaa'
        key: 'mpaa'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
      {
        alias: 'Studio'
        type: 'array'
        property: 'studio'
        key: 'studio'
        sortOrder: 'asc',
        filterCallback: 'multiple'
      }
    ] 

    ## Wrapper for returning the available fields for sort/filter
    ## Available fields are defined in the entity controller and passed
    ## to the filter view where they are stored in cache.
    getFilterFields: (type) ->
      key = type + 'Fields'
      fields = API[key]
      ## Get available and only return fields available to this entity
      availableFilters = API.getAvailable()
      available = availableFilters[type]
      ret = []
      for field in fields
        if helpers.global.inArray field.key, available
          ret.push field
      ret


    ###
      Storage
    ###

    ## Store filters namespace
    storeFiltersNamespace: 'filter:store:'

    getStoreNameSpace: (type) ->
      API.storeFiltersNamespace + type

    ## Memory store the current filters
    setStoreFilters: (filters = {}, type = 'filters') ->
      store = {}
      store[helpers.url.path()] = filters
      helpers.cache.set(API.getStoreNameSpace(type), store)
      App.vent.trigger('filter:changed', filters);

    ## Get the current filters for this page
    getStoreFilters: (type = 'filters') ->
      store = helpers.cache.get(API.getStoreNameSpace(type), {})
      path = helpers.url.path()
      filters = if store[path] then store[path] else {}
      ret = {}
      if not _.isEmpty filters
        for key, val of filters when val.length > 0
          ret[key] = val
      ret

    ## Update a given key with new values
    updateStoreFiltersKey: (key, values = []) ->
      filters = API.getStoreFilters()
      filters[key] = values
      API.setStoreFilters filters
      filters

    ## Get a specific key values
    getStoreFiltersKey: (key) ->
      filters = API.getStoreFilters()
      filter = if filters[key] then filters[key] else []
      filter

    ## Set current sort.
    setStoreSort: (method, order = 'asc') ->
      sort = {method: method, order: order}
      API.setStoreFilters(sort, 'sort')

    ## Get current sort.
    getStoreSort: ->
      sort = API.getStoreFilters('sort')
      if not sort.method
        defaults = _.findWhere(API.getFilterFields('sort'), {defaultSort: true});
        sort = {method: defaults.key, order: defaults.defaultOrder}
      sort

    ## Set available filters
    setAvailable: (available) ->
      API.setStoreFilters(available, 'available')

    ## Get available filters
    getAvailable: ->
      API.getStoreFilters('available')


    ###
      Parsing
    ###

    ## Swap the order.
    toggleOrder: (order) ->
      order = if order is 'asc' then 'desc' else 'asc'
      order

    ## Parse the defaults with context of the current page
    parseSortable: (items) ->
      ## Set the current state
      params = API.getStoreSort false, 'asc'
      ## loop over the items and set the active and toggle order if active
      for i, item of items
        items[i].active = false
        items[i].order = item.defaultOrder
        if params.method and item.key is params.method
          items[i].active = true
          items[i].order = @toggleOrder params.order
        else if item.defaultSort and params.method is false
          items[i].active = true
      items

    ## Parse the active state int the current filters
    parseFilterable: (items) ->
      active = API.getFilterActive()
      for i, val of items
        activeItem = _.findWhere(active, {key: val.key});
        items[i].active = activeItem != undefined
      items

    ## Extract the available options for a given filter from the attached collection.
    getFilterOptions: (key, collection) ->
      values = App.request 'filter:store:key:get', key
      ## Filter settings for this key.
      s = API.getFilterSettings(key)
      items = []
      ## Get the properties requested
      collectionItems = collection.pluck(key)
      ## Deal with more complex nested propeties (e.g. cast)
      if s.filterCallback is 'multiple' and s.type is 'object'
        ## Limit to first 5 for each otherwise it kills the browser.
        limited = []
        for item in collectionItems
          for i, data of item
            if i < 5
              limited.push data[s.property]
        collectionItems = limited
      ## Reduce the list to an array of unique items.
      _.map _.uniq(_.flatten(collectionItems)), (val) ->
        items.push {key: key, value: val, active: helpers.global.inArray(val,values)}
      items


    ###
      Apply filters
    ###

    ## Apply filters to a collection.
    applyFilters: (collection) ->
      sort = API.getStoreSort()
      collection.sortCollection sort.method, sort.order
      filteredCollection = new App.Entities.Filtered collection
      for key, values of API.getStoreFilters() when values.length > 0
        filteredCollection = API.applyFilter filteredCollection, key, values
      filteredCollection

    ## Apply a single filter key
    ## See entities/_base/filtered.js for custom filter methods
    applyFilter: (collection, key, vals) ->
      ## Get the filter settings available for this key and switch on the callback.
      s = API.getFilterSettings(key)
      switch s.filterCallback
        ## If multiple values allowed
        when 'multiple'
          if s.type is 'array'
            collection.filterByMultipleArray(key, vals) ## data is an array
          else if s.type is 'object'
            collection.filterByMultipleObject(key, s.property, vals) ## data is an array of objects
          else
            collection.filterByMultiple(key, vals) ## data is not array
        when 'unwatched'
          collection.filterByUnwatched()
        when 'thumbsup'
          collection.filterByThumbsUp()
        else
          collection
      collection

    ## Get settings for a given filter
    getFilterSettings: (key, availableOnly = true) ->
      filters = if availableOnly is true then API.getFilterFields('filter') else API.filterFields
      _.findWhere(filters, {key: key})

    ## Get the active filters.
    getFilterActive: ->
      items = []
      for key, values of API.getStoreFilters() when values.length > 0
        items.push {key: key, values: values}
      items



  ###
    Handlers.
  ###

  ## Views and collections.

  ## Return the filters view
  App.reqres.setHandler 'filter:show', (collection) ->
    API.setAvailable collection.availableFilters
    filters = new FilterApp.Show.Controller
      refCollection: collection
    view = filters.getFilterView()
    view

  ## Return the filter options collection
  App.reqres.setHandler 'filter:options', (key, collection) ->
    ## Get the options collection based on values in the collection.
    options = API.getFilterOptions key, collection
    optionsCollection = App.request 'filter:filters:options:entities', options
    ## Set the order of the options collection.
    filterSettings = API.getFilterSettings(key)
    optionsCollection.sortCollection('value', filterSettings.sortOrder)
    ## Return collection
    optionsCollection

  ## Get an active filter collection.
  App.reqres.setHandler 'filter:active',  ->
    App.request 'filter:active:entities', API.getFilterActive()

  ## Apply filters to a collection.
  App.reqres.setHandler 'filter:apply:entities', (collection)  ->
    API.setAvailable collection.availableFilters
    newCollection = API.applyFilters collection
    App.vent.trigger 'filter:filtering:stop'
    newCollection

  ## Get a sortable collection
  App.reqres.setHandler 'filter:sortable:entities', ->
    App.request 'filter:sort:entities', API.parseSortable(API.getFilterFields('sort'))

  ## Get a filter collection
  App.reqres.setHandler 'filter:filterable:entities', ->
    App.request 'filter:filters:entities', API.parseFilterable(API.getFilterFields('filter'))

  ## Set a filter using a url param eg ?director=name
  App.reqres.setHandler 'filter:init', (availableFilters) ->
    params = helpers.url.params()
    if not _.isEmpty params
      ## Clear existing filters first
      API.setStoreFilters {}
      for key in availableFilters.filter
        ## is one of the params an available filter
        if params[key]
          values = API.getStoreFiltersKey key
          filterSettings = API.getFilterSettings key, false
          ## If the filter doesn't exist, add and save.
          if not helpers.global.inArray params[key], values
            if filterSettings.type is 'number'
              values.push parseInt params[key]
            else
              values.push decodeURIComponent(params[key])
            API.updateStoreFiltersKey key, values

  ## Storage.

  ## Store a filter set
  App.reqres.setHandler 'filter:store:set', (filters) ->
    API.setStoreFilters filters
    filters

  ## Get a Stored a filter set
  App.reqres.setHandler 'filter:store:get', ->
    API.getStoreFilters()

  ## Get a Stored a filter set for a given key
  App.reqres.setHandler 'filter:store:key:get', (key) ->
    API.getStoreFiltersKey key

  ## Update a key in a stored filter set.
  App.reqres.setHandler 'filter:store:key:update', (key, values = []) ->
    API.updateStoreFiltersKey key, values

  ## Toggle a value in a key and return the updated values
  ## This feels long winded, maybe one day refactor/compress.
  App.reqres.setHandler 'filter:store:key:toggle', (key, value) ->
    values = API.getStoreFiltersKey key
    ret = []
    ## Remove.
    if _.indexOf(values, value) > -1
      newValues = []
      for i in values when i isnt value
        newValues.push i
      ret = newValues
    else
      ## Add.
      values.push value
      ret = values
    API.updateStoreFiltersKey key, ret
    ret

  ## Store a sort
  App.reqres.setHandler 'filter:sort:store:set', (method, order = 'asc') ->
    API.setStoreSort method, order

  ## Get a sort, fallback to default
  App.reqres.setHandler 'filter:sort:store:get', ->
    API.getStoreSort()