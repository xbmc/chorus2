@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      @layout = @getLayout()
      media = @getOption('media')
      if media is 'all'
        entities = ['song', 'artist', 'album', 'tvshow', 'movie']
      else
        entities = [media]
      @listenTo @layout, "show", =>
        ## Do a search for each entity
        for entity in entities
          @getResult entity
      App.regionContent.show @layout

    getLayout: ->
      new List.ListLayout()

    getResult: (entity) ->
      query = @getOption('query')
      limit = if @getOption('media') is 'all' then 'limit' else 'all'
      App.execute "#{entity}:search:entities", query, limit, (loaded) =>
        ## If result
        if loaded.length > 0
          ## Get the result view
          view = App.request "#{entity}:list:view", loaded, true
          ## Wrap it in a set view container and add a title
          setView = new List.ListSet
            entity: entity
            more: (if loaded.more then true else false)
            query: query
          App.listenTo setView, "show", =>
            setView.regionResult.show view
          ## Add to layout
          @layout["#{entity}Set"].show setView
