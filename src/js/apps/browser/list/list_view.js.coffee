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

  class List.Item extends App.Views.ItemView
    template: 'apps/browser/list/file'
    tagName: 'li'
    initialize: ->
    # Parse title text
      @model.set {label: @formatText(@model.get('label'))}

  class List.Folder extends List.Item
    className: 'folder'
    triggers:
      'click .title' : 'folder:open'
      'click .play' : 'folder:play'

  class List.EmptyFiles extends App.Views.EmptyViewPage
    tagName: 'li'
    initialize: ->
      @model.set({id: 'empty', content: t.gettext('no media in this folder')})

  class List.File extends List.Item
    className: 'file'
    triggers:
      'click .play' : 'file:play'
      "dblclick .title" : "file:play"
      'click .queue' : 'file:queue'
    events:
      "click .dropdown > i": "menuPopulate"
    initialize: ->
      menu = {'queue': 'Add to Kodi playlist'}
      this.model.set({menu: menu})


  class List.FolderList extends App.Views.CollectionView
    tagName: 'ul'
    childView: List.Folder

  class List.FileList extends App.Views.CollectionView
    tagName: 'ul'
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

