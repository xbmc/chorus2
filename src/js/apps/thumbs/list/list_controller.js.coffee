@Kodi.module "ThumbsApp.List", (List, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class List.Controller extends App.Controllers.Base

    entityTitles:
      musicvideo: 'music video'

    initialize: ->
      @layout = @getLayout()
      entities = ['song', 'artist', 'album', 'tvshow', 'movie', 'episode', 'musicvideo']

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
      loaded = App.request "thumbsup:get:entities", entity
      ## If result
      if loaded.length > 0
        ## Get the result view
        view = App.request "#{entity}:list:view", loaded, true
        ## Wrap it in a set view container and add a title
        setView = new List.ListSet
          entity: @getTitle(entity)
        App.listenTo setView, "show", =>
          setView.regionResult.show view
        ## Add to layout
        @layout["#{entity}Set"].show setView

    ## Get title for an entity
    getTitle: (entity) ->
      title = if @entityTitles[entity] then @entityTitles[entity] else entity
      title
