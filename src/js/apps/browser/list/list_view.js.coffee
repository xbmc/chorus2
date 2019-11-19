@Kodi.module "BrowserApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.ListLayout extends App.Views.LayoutWithSidebarFirstView
    className: "browser-page"


  ###
    Sources
  ###

  class List.Source extends App.Views.ItemView
    template: 'apps/browser/list/source'
    tagName: 'li'
    triggers:
      'click .source' : 'source:open'
    attributes: ->
      {
        class: 'type-' + @model.get('sourcetype')
      }

  ## Our composite view allows adding another view via the 'childViewContainer' el
  ## which is in the template
  class List.Sources extends App.Views.CompositeView
    template: 'apps/browser/list/source_set'
    childView: List.Source
    tagName: "div"
    childViewContainer: 'ul.sources'
    className: "source-set"
    initialize: ->
      ## We need to tell the child view where to get its collection
      @collection = @model.get('sources')

  class List.SourcesSet extends App.Views.CollectionView
    childView: List.Sources
    tagName: "div"
    className: "sources-sets"


  ###
    Folder
  ###

  class List.FolderLayout extends App.Views.LayoutView
    template: 'apps/browser/list/folder_layout'
    className: "folder-page-wrapper"
    regions:
      regionPath: '.path'
      regionFolders: '.folders'
      regionFiles: '.files'
      regionBack: '.back'
    triggers:
      'click .play' : 'browser:play'
      'click .queue' : 'browser:queue'
    events:
      'click .sorts li' : 'sortList'
    sortList: (e) ->
      $('.sorts li', @$el).removeClass 'active'
      @trigger 'browser:sort', $(e.target).data('sort'), $(e.target)
    onRender: ->
      $('.sorts li', @$el).addClass 'order-' + @options.sortSettings.order
      $('.sorts li[data-sort=' + @options.sortSettings.method + ']', @$el).addClass 'active'


  class List.Item extends App.Views.ItemView
    template: 'apps/browser/list/file'
    tagName: 'li'
    initialize: ->
    # Parse title text
      @model.set {labelHtml: @formatText(@model.get('label'))}
      
    onBeforeRender: ->
      if !@model.get('labelHtml')
        @model.set {labelHtml: @model.escape('label')}

  class List.Folder extends List.Item
    className: 'folder'
    triggers:
      'click .title' : 'folder:open'
      'dblclick .title' : 'file:play'
      'click .play' : 'folder:play'
      'click .queue' : 'folder:queue'
    events:
      "click .dropdown > i": "populateModelMenu"
    initialize: ->
      menu = {queue: tr('Queue in Kodi')}
      @model.set({menu: menu})

  class List.EmptyFiles extends App.Views.EmptyViewPage
    tagName: 'li'
    initialize: ->
      @model.set({id: 'empty', content: t.gettext('no media in this folder')})

  class List.File extends List.Item
    className: 'file'
    triggers:
      'click .play' : 'file:play'
      'dblclick .title' : 'file:play'
      'click .queue' : 'file:queue'
      'click .download' : 'file:download'
    events:
      "click .dropdown > i": "populateModelMenu"
    initialize: ->
      menu = {queue: tr('Queue in Kodi')}
      if @model.get('filetype') is 'file' and @model.get('file').lastIndexOf('plugin://', 0) isnt 0
        menu.download = tr('Download')
      @model.set({menu: menu})


  class List.FolderList extends App.Views.CollectionView
    tagName: 'ul'
    className: 'browser-folder-list'
    childView: List.Folder

  class List.FileList extends App.Views.CollectionView
    tagName: 'ul'
    className: 'browser-file-list'
    childView: List.File
    emptyView: List.EmptyFiles

  ###
    Path
  ###

  class List.Path extends App.Views.ItemView
    template: 'apps/browser/list/path'
    tagName: 'li'
    triggers:
      'click .title' : 'folder:open'

  class List.PathList extends App.Views.CollectionView
    tagName: 'ul'
    childView: List.Path

  class List.Back extends App.Views.ItemView
    template: 'apps/browser/list/back_button'
    tagName: 'div'
    className: 'back-button'
    triggers:
      'click .title' : 'folder:open'
      'click i' : 'folder:open'

