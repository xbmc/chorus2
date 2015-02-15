@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  ## https://github.com/jmorrell/backbone-filtered-collection
  class Entities.Filtered extends FilteredCollection

    ## Alows filtering against multiple values of the same key.
    filterByMultiple: (key, values = []) ->
      @filterBy key, (model) ->
        helpers.global.inArray model.get(key), values

    ## Alows filtering against multiple values of the same key
    ## wher the data is an array
    filterByMultipleArray: (key, values = []) ->
      @filterBy key, (model) ->
        match = false
        for v in model.get(key)
          if helpers.global.inArray v, values
            match = true
        match

    ## Like filterbymultiplearray but allows for key to be an object
    ## picking out the key from that object.
    filterByMultipleObject: (key, property, values = []) ->
      @filterBy key, (model) ->
        match = false
        items = _.pluck model.get(key), property
        for v in items
          if helpers.global.inArray v, values
            match = true
        match

    filterByUnwatchedShows: ->
      @filterBy 'unwatchedShows', (model) ->
        model.get('unwatched') > 0

    filterByString: (key, query) ->
      @filterBy 'search', (model) ->
        if query.length < 3 ## 2 charachter min
          false
        else
          value = model.get(key).toLowerCase()
          (value.indexOf(query.toLowerCase()) > -1)
