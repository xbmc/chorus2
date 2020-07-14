@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  ## https://github.com/jmorrell/backbone-filtered-collection
  class Entities.Filtered extends FilteredCollection

    ## Allows filtering against multiple values of the same key.
    filterByMultiple: (key, values = []) ->
      @filterBy key, (model) ->
        helpers.global.inArray model.get(key), values

    ## Allows filtering against multiple values of the same key
    ## where the data is an array
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

    filterByUnwatched: ->
      @filterBy 'unwatched', (model) ->
        unwatched = 1
        if model.get('type') is 'tvshow'
          unwatched = model.get('episode') - model.get('watchedepisodes')
        else if model.get('type') is 'movie' or model.get('type') is 'episode'
          unwatched = if model.get('playcount') > 0 then 0 else 1
        unwatched > 0

    filterByWatched: ->
      @filterBy 'watched', (model) ->
        watched = 1
        if model.get('type') is 'tvshow'
          watched = model.get('watchedepisodes')
        else if model.get('type') is 'movie' or model.get('type') is 'episode'
          watched = if model.get('playcount') > 0 then 1 else 0
        watched > 0

    filterByThumbsUp: (key) ->
      @filterBy key, (model) ->
        App.request "thumbsup:check", model

    filterByInProgress: (key) ->
      @filterBy key, (model) ->
        inprogress = if model.get('progress') > 0 and model.get('progress') < 100 then true else false
        inprogress

    filterByString: (key, query) ->
      @filterBy 'search', (model) ->
        if query.length < 3 ## 2 character min
          false
        else
          value = model.get(key).toLowerCase()
          (value.indexOf(query.toLowerCase()) > -1)
