@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class List.Controller extends App.Controllers.Base

    maxItemsCombinedSearch: 21

    searchFieldMap:
      artist: 'artist'
      album: 'album'
      song: 'title'
      movie: 'title'
      tvshow: 'title'

    initialize: ->
      @layout = @getLayout()
      @processed = [];
      media = @getOption('media')
      if media is 'all'
        @entities = ['song', 'album', 'artist', 'tvshow', 'movie']
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
      limit = {start: 0}
      if @getOption('media') is 'all'
        limit.end = @maxItemsCombinedSearch
      opts =
        limits: limit
        filter: {'operator': 'contains', 'field': @searchFieldMap[entity], 'value': query}
        success: (loaded) =>
          # If result
          if loaded.length > 0
            # See if we need more
            more = false
            if loaded.length is @maxItemsCombinedSearch
              more = true
              loaded.first(20)
            # Get the result view
            view = App.request "#{entity}:list:view", loaded, true
            # Wrap it in a set view container and add a title
            setView = new List.ListSet
              entity: entity
              more: more
              query: query
            App.listenTo setView, "show", =>
              setView.regionResult.show view
            ## Add to layout
            @layout["#{entity}Set"].show setView
          @updateProgress entity
      App.request "#{entity}:entities", opts


    ## Update the progress of the search
    updateProgress: (done) =>
      if done?
        @processed.push done
      @getLoader()
      if @processed.length is @entities.length
        @layout.loadingSet.$el.empty()
