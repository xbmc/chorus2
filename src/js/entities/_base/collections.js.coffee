@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.Collection extends Backbone.Collection

    ## Return the raw entities stored against this collection
    ## as an array of json objects (not models)
    ## TODO: Remove this and use toJSON() instead
    getRawCollection: ->
      objs = [];
      if @models.length > 0
        for model in @models
          objs.push model.attributes
      objs

    ## Set our custom cache keys.
    getCacheKey: (options) ->
      key = this.constructor.name
      key

    ## Automatically sort a collection based on the params
    ## passed from the controller.
    autoSort: (params) ->
      if params.sort
        order = if params.order then params.order else 'asc'
        @sortCollection params.sort, order

    ## Change sort comparator.
    sortCollection: (property, order = 'asc') ->
      if property is 'random'
        @comparator = false
        @reset @shuffle(), {silent:true}
      else
        @comparator = (model) =>
          @ignoreArticleParse model.get(property)
        if order is 'desc'
          @comparator = @reverseSortBy @comparator
        @sort()
      return

    ## Reverse descending sort
    ## http://stackoverflow.com/a/12220415
    reverseSortBy: (sortByFunction) ->
      (left, right) ->
        l = sortByFunction(left)
        r = sortByFunction(right)
        if l == undefined
          return -1
        if r == undefined
          return 1
        if l < r then 1 else if l > r then -1 else 0

    ## Ignore article in list sorting.
    ignoreArticleParse: (string) ->
      articles = ["'", '"', 'the ', 'a ']
      if typeof string is 'string' and config.get('static', 'ignoreArticle', true)
        string = string.toLowerCase()
        parsed = false
        for s in articles
          if parsed
            continue
          if helpers.global.stringStartsWith s, string
            string = helpers.global.stringStripStartsWith s, string
            parsed = true
      string
