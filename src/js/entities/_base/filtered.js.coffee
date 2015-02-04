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

    filterByUnwatchedShows: ->
      @filterBy 'unwatchedShows', (model) ->
        model.get('unwatched') > 0
