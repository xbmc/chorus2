@Kodi.module "SearchApp.List", (List, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class List.Controller extends App.Controllers.Base

    maxItemsCombinedSearch: 21

    allEntities: ['movie', 'tvshow', 'artist', 'album', 'song', 'musicvideo']

    searchFieldMap:
      artist: 'artist'
      album: 'album'
      song: 'title'
      movie: 'title'
      tvshow: 'title'
      musicvideo: 'title'

    entityTitles:
      musicvideo: 'music video'

    initialize: ->
      @pageLayout = @getPageLayout()
      @layout = @getLayout()
      @processed = [];
      @processedItems = 0;
      @addonSearches = App.request "addon:search:enabled"
      media = @getOption('media')
      if media is 'all'
        @entities = @allEntities
      else
        @entities = [media]
      @listenTo @layout, "show", =>
        ## Add the loader
        @getLoader()
        ## Do a search for each entity
        for entity in @entities
          if helpers.global.inArray(entity, @allEntities)
            @getResultMedia entity
          else
            @getResultAddon entity
      @listenTo @pageLayout, "show", =>
        @pageLayout.regionContent.show @layout
        @pageLayout.regionSidebarFirst.show @getSidebar()
      App.regionContent.show @pageLayout

    getPageLayout: ->
      new List.PageLayout()

    getLayout: ->
      new List.ListLayout()

    ## Get and build the sidebar links
    getSidebar: ->
      medias = [{id: 'all', title: 'all media'}]
      for media in @allEntities
        medias.push
          id: media
          title: @getTitle(media) + 's'
      opts =
        links: {media: medias, addon: @addonSearches}
        query: @getOption('query')
      new List.Sidebar opts

    ## Get the loader which indicates remaining sets to search
    getLoader: =>
      # Get items left to process
      toProcess = _.difference(@entities, @processed)
      # Replace addon ids with title
      for i, name of toProcess
        addon = _.findWhere @addonSearches, {id: name}
        toProcess[parseInt(i)] = if addon then addon.title else name + 's'
      # Build the loading search text
      searchNames = helpers.global.arrayToSentence(toProcess, false)
      query = helpers.global.arrayToSentence([@getOption('query')], false)
      text = t.gettext('Searching for') + ' ' + query + ' ' + t.gettext('in') + ' ' + searchNames
      App.execute "loading:show:view", @layout.loadingSet, text;

    ## Get local library results
    getResultMedia: (entity) ->
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
            @processedItems = @processedItems + loaded.length
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
              title: @getTitle(entity) + 's'
            App.listenTo setView, "show", =>
              setView.regionResult.show view
            ## Add to layout
            @layout["#{entity}Set"].show setView
          @updateProgress entity
      App.request "#{entity}:entities", opts

    ## Get addon results
    getResultAddon: (addonId) ->
      addonSearch = _.findWhere @addonSearches, {id: addonId}
      opts =
        file: addonSearch.url.replace('[QUERY]', @getOption('query'))
        media: addonSearch.media
        addonId: addonSearch.id
        success: (fullCollection) =>
          i = 0
          typeCollection = App.request "file:parsed:entities", fullCollection
          for type in ['file', 'directory']
            collection = typeCollection[type]
            # If result
            if collection.length > 0
              i++
              @processedItems = @processedItems + collection.length
              filesView = App.request "browser:" + type + ":view", collection
              setView = new List.ListSet
                entity: addonSearch.title
                title: if i is 1 then addonSearch.title else ''
                more: false
                query: @getOption('query')
              App.listenTo setView, "show", =>
                setView.regionResult.show filesView
              @layout.appendAddonView addonId + type, setView
          @updateProgress addonId
      App.request "file:entities", opts

    ## Get title for an entity
    getTitle: (entity) ->
      title = if @entityTitles[entity] then @entityTitles[entity] else entity
      title

    ## Update the progress of the search
    updateProgress: (done) =>
      if done?
        @processed.push done
      @getLoader()
      if @processed.length is @entities.length
        @layout.loadingSet.$el.empty()
        if @processedItems is 0
          @pageLayout.regionContent.$el.html '<h2 class="search-no-result">' + tr('No results found') + '</h2>'
