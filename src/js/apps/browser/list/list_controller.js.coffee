@Kodi.module "BrowserApp.List", (List, App, Backbone, Marionette, $, _) ->

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
      @folderLayout = new List.FolderLayout()
      @layout.regionContent.show @folderLayout

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
      ## Do a virtual navigate and load up the folder view
      App.navigate model.get('url')
      ## Get the collection
      collection = App.request "file:entities", {file: model.get('file'), media: model.get('media')}
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
      @listenTo folderView, 'childview:folder:play', (set, item) =>
        playlist = App.request "command:kodi:controller", item.model.get('player'), 'PlayList'
        playlist.play 'directory', item.model.get('file')
      folderView

    getFolderList: (collection) ->
      @folderLayout.regionFolders.show @getFolderListView(collection)
      @getBackButton()

    getFileListView: (collection) ->
      fileView = new List.FileList
        collection: collection
      @listenTo fileView, 'childview:file:play', (set, item) =>
        playlist = App.request "command:kodi:controller", item.model.get('player'), 'PlayList'
        playlist.play 'file', item.model.get('file')
      fileView

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
  App.reqres.setHandler "browser:files:view", (path, media, callback) ->
    browserController = new List.Controller()
    browserController.getFileViewByPath path, media, callback
