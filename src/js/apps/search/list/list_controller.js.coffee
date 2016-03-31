@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: ->
      @layout = @getLayout()
      @processed = [];
      media = @getOption('media')
      if media is 'all'
        @entities = ['song', 'artist', 'album', 'tvshow', 'movie']
      else
        @entities = [media]
      @listenTo @layout, "show", =>
        ## Add the loader
        @getLoader()
        ## Do a search for each entity
        for entity in @entities
          @getResult entity
      App.regionContent.show @layout

    getLayout: ->
      new List.ListLayout()

    getLoader: =>
      searchNames = helpers.global.arrayToSentence(_.difference(@entities, @processed))
      query = helpers.global.arrayToSentence([@getOption('query')], false)
      text = t.gettext('Searching for') + ' ' + query + ' ' + t.gettext('in') + ' ' + searchNames
      App.execute "loading:show:view", @layout.loadingSet, text;

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
        @updateProgress entity

    ## Update the progress of the search
    updateProgress: (done) =>
      if done?
        @processed.push done
      @getLoader()
      if @processed.length is @entities.length
        @layout.loadingSet.$el.empty()
