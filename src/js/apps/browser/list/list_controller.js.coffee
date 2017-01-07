@Kodi.module "BrowserApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    bindFileTriggers: (view) ->
      App.listenTo view, 'childview:file:play', (set, item) =>
        playlist = App.request "command:kodi:controller", item.model.get('player'), 'PlayList'
        playlist.play 'file', item.model.get('file')
      App.listenTo view, 'childview:file:queue', (set, item) =>
        playlist = App.request "command:kodi:controller", item.model.get('player'), 'PlayList'
        playlist.add 'file', item.model.get('file')
      App.listenTo view, 'childview:file:download', (set, item) =>
        App.request("command:kodi:controller", 'auto', 'Files').downloadFile item.model.get('file')

    bindFolderTriggers: (view) ->
      App.listenTo view, 'childview:folder:play', (set, item) =>
        App.request("command:kodi:controller", item.model.get('player'), 'PlayList').play 'directory', item.model.get('file')
      App.listenTo view, 'childview:folder:queue', (set, item) =>
        App.request("command:kodi:controller", item.model.get('player'), 'PlayList').add 'directory', item.model.get('file')

    getFileListView: (collection) ->
      fileView = new List.FileList
        collection: collection
      API.bindFileTriggers(fileView)
      fileView


  class List.Controller extends App.Controllers.Base

    sourceCollection: {}
    backButtonModel: {}

    initialize: (options = {}) ->
      @layout = @getLayout()
      @listenTo @layout, "show", =>
        @getSources(options)
        @getFolderLayout()
      App.regionContent.show @layout

    getLayout: ->
      new List.ListLayout()

    getFolderLayout: ->
      options = {sortSettings: @getSort()}
      @folderLayout = new List.FolderLayout options
      @listenTo @folderLayout, 'browser:sort', (sort, $el) =>
        @setSort sort, $el
      @listenTo @folderLayout, 'browser:play', (view) =>
        if @model
          App.request("command:kodi:controller", @model.get('player'), 'PlayList').play 'directory', @model.get('file')
      @listenTo @folderLayout, 'browser:queue', (view) =>
        if @model
          App.request("command:kodi:controller", @model.get('player'), 'PlayList').add 'directory', @model.get('file')
      @layout.regionContent.show @folderLayout

    setSort: (sort, $el) ->
      sortSettings = @getSort()
      if sortSettings.method is sort
        sortSettings.order = if sortSettings.order is 'ascending' then 'descending' else 'ascending'
      if $el
        $el.removeClassStartsWith('order-').addClass('order-' + sortSettings.order).addClass 'active'
      sortSettings.method = sort
      if sortSettings.method
        config.set 'app', 'browserSort', sortSettings
      if @model
        @getFolder @model

    getSort: ->
      config.get('app', 'browserSort', {method: 'none', order: 'ascending'})


    ## Get the source lists
    getSources: (options) ->
      sources = App.request "file:source:entities", 'video'
      App.execute "when:entity:fetched", sources, =>
        ## Store the sources collection for later
        @sourceCollection = sources
        ## Parse into sets
        sets = App.request "file:source:media:entities", sources
        setView = new List.SourcesSet({collection: sets})
        @layout.regionSidebarFirst.show setView
        @listenTo setView, 'childview:childview:source:open', (set, item) =>
          @getFolder(item.model)
        @loadFromUrl(options)

    loadFromUrl: (options) ->
      if options.media and options.id
        model = App.request "file:url:entity", options.media, options.id
        @getFolder model

    getFolder: (model) ->
      @model = model
      ## Do a virtual navigate and load up the folder view
      App.navigate model.get('url')
      ## Get the collection
      sortSettings = @getSort()
      collection = App.request "file:entities", {file: model.get('file'), media: model.get('media'), sort: sortSettings}
      pathCollection = App.request "file:path:entities", model.get('file'), @sourceCollection
      @getPathList pathCollection
      App.execute "when:entity:fetched", collection, =>
        ## parse and render
        collections = App.request "file:parsed:entities", collection
        @getFolderList(collections.directory)
        @getFileList(collections.file)

    getFolderListView: (collection) ->
      folderView = new List.FolderList
        collection: collection
      @listenTo folderView, 'childview:folder:open', (set, item) =>
        @getFolder item.model
      API.bindFolderTriggers folderView
      folderView

    getFolderList: (collection) ->
      @folderLayout.regionFolders.show @getFolderListView(collection)
      @getBackButton()

    getFileListView: (collection) ->
      API.getFileListView collection

    getFileList: (collection) ->
      @folderLayout.regionFiles.show @getFileListView(collection)

    getPathList: (collection) ->
      pathView = new List.PathList
        collection: collection
      @folderLayout.regionPath.show pathView
      @setBackModel collection
      @listenTo pathView, 'childview:folder:open', (set, item) =>
        @getFolder item.model

    setBackModel: (pathCollection) ->
      # Back button should be the second last model
      if pathCollection.length >= 2
        @backButtonModel = pathCollection.models[pathCollection.length - 2]
      else
        @backButtonModel = {}

    getBackButton: ->
      if @backButtonModel.attributes
        backView = new List.Back
          model: @backButtonModel
        @folderLayout.regionBack.show backView
        @listenTo backView, 'folder:open', (model) =>
          @getFolder model.model
      else
        @folderLayout.regionBack.empty()

    # Get view with a collection of files only
    getFileViewByPath: (path, media, callback) ->
      collection = App.request "file:entities", {file: path, media: media}
      App.execute "when:entity:fetched", collection, =>
        view = @getFileListView collection
        if callback
          callback view


  # Get view with a collection of files only
  App.reqres.setHandler "browser:files:view", (collection) ->
    API.getFileListView collection
