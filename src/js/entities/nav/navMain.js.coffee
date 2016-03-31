@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    localKey: 'mainNav'

    getItems: ->
      navCollection = @getLocalCollection()
      items = navCollection.getRawCollection()
      if items.length is 0
        items = @getDefaultItems()
      items

    getDefaultItems: ->
      nav = []
      ## Music.
      nav.push {id: 1, title: "Music", path: 'music', icon: 'mdi-av-my-library-music', classes: 'nav-music', parent: 0}
      nav.push {id: 2, title: "Recent", path: 'music', icon: '', classes: '', parent: 1}
      nav.push {id: 3, title: "Artists", path: 'music/artists', icon: '', classes: '', parent: 1}
      nav.push {id: 4, title: "Albums", path: 'music/albums', icon: '', classes: '', parent: 1}
      nav.push {id: 5, title: "Digital radio", path: 'music/radio', icon: '', classes: 'pvr-link', parent: 1, visibility: "addon:pvr:enabled"}

      ## Movies.
      nav.push {id: 11, title: "Movies", path: 'movies/recent', icon: 'mdi-av-movie', classes: 'nav-movies', parent: 0}
      nav.push {id: 12, title: "Recent movies", path: 'movies/recent', icon: '', classes: '', parent: 11}
      nav.push {id: 13, title: "All movies", path: 'movies', icon: '', classes: '', parent: 11}

      ## TV.
      nav.push {id: 21, title: "TV shows", path: 'tvshows/recent', icon: 'mdi-hardware-tv', classes: 'nav-tv', parent: 0}
      nav.push {id: 22, title: "Recent episodes", path: 'tvshows/recent', icon: '', classes: '', parent: 21}
      nav.push {id: 23, title: "All TV shows", path: 'tvshows', icon: '', classes: '', parent: 21}
      nav.push {id: 24, title: "TV", path: 'tvshows/live', icon: '', classes: 'pvr-link', parent: 21, visibility: "addon:pvr:enabled"}

      ## Browser.
      nav.push {id: 31, title: "Browser", path: 'browser', icon: 'mdi-action-view-list', classes: 'nav-browser', parent: 0}

      ## Thumbs up.
      nav.push {id: 41, title: "Thumbs up", path: 'thumbsup', icon: 'mdi-action-thumb-up', classes: 'nav-thumbs-up', parent: 0}
      nav.push {id: 42, title: "Playlists", path: 'playlists', icon: 'mdi-action-assignment', classes: 'playlists', parent: 0}

      ## Settings.
      nav.push {id: 51, title: "Settings", path: 'settings/web', icon: 'mdi-action-settings', classes: 'nav-settings', parent: 0}
      nav.push {id: 52, title: "Web interface", path: 'settings/web', icon: '', classes: '', parent: 51}
      nav.push {id: 53, title: "Add-ons", path: 'settings/addons', icon: '', classes: '', parent: 51}
      nav.push {id: 54, title: "Main Nav", path: 'settings/nav', icon: '', classes: '', parent: 51}

      ## Help
      nav.push {id: 61, title: "Help", path: 'help', icon: 'mdi-action-help', classes: 'nav-help', parent: 0}

      @checkVisibility nav

    ## Nav items can have a visibility property, if this is set, the request handler
    ## is called for that value which should return true or false depending if that
    ## item is visible.  e.g. pvr links check if pvr is enabled.
    checkVisibility: (items) ->
      newItems = []
      for item in items
        if item.visibility?
          if App.request item.visibility
            newItems.push item
        else
          newItems.push item
      newItems

    ## Get a collection from local storage.
    getLocalCollection: ->
      collection = new Entities.LocalNavMainCollection([], {key: @localKey})
      collection.fetch()
      collection

    ## Get a full standard structure
    getStructure: ->
      navParsed = @sortStructure @getItems()
      navCollection = new Entities.NavMainCollection navParsed
      navCollection

    ## Get only child items from a given parent
    getChildStructure: (parentId) ->
      nav = @getDefaultItems()
      parent = _.findWhere nav, {id: parentId}
      childItems = _.where(nav, {parent: parentId})
      parent.items = new Entities.NavMainCollection childItems
      new Entities.NavMain parent

    ## Sort the structure into a hierarchy.
    sortStructure: (structure) ->
      children = {}
      ## Parse the children from via the parent.
      for model in structure when model.path? and model.parent isnt 0
        ## Translate the titles while we are here
        model.title = t.gettext( model.title )
        ## Parse into children
        children[model.parent] ?= []
        children[model.parent].push model
      ## Add the parsed children to the parents.
      newParents = []
      for i, model of structure when model.path?
        if model.parent is 0
          model.children = children[model.id]
          newParents.push model
      newParents

    # Returns the ID for the given path (no hash)
    getIdfromPath: (path) ->
      model = _.findWhere @getDefaultItems(), {path: path}
      if model? then model.id else 1

    # Save current form to local storage collection
    saveLocal: (items) ->
      collection = @clearLocal()
      for i, item of items
        collection.create item
      collection

    ## remove all items from a list
    clearLocal: ->
      collection = @getLocalCollection()
      while model = collection.first()
        model.destroy()
      collection


  ## NavMain model
  class Entities.NavMain extends App.Entities.Model
    defaults:
      id: 0
      title: 'Untitled'
      path: ''
      description: ''
      icon: ''
      classes: ''
      parent: 0
      children: []

  ## NavMain collection
  class Entities.NavMainCollection extends App.Entities.Collection
    model: Entities.NavMain

  ## NavMain local storage collection
  class Entities.LocalNavMainCollection extends App.Entities.Collection
    model: Entities.NavMain
    localStorage: new Backbone.LocalStorage API.localKey


  ## Handler to return the collection, parent is path to parent.
  App.reqres.setHandler "navMain:entities", (parent = 'all') ->
    if parent is 'all'
      API.getStructure()
    else
      parentId = API.getIdfromPath(parent)
      API.getChildStructure parentId

  ## Turn an array of link objects into a collection.
  App.reqres.setHandler "navMain:array:entities", (items) ->
    # Auto populate ids from paths
    for i, item of items
      items[i].id = item.path
    new Entities.NavMainCollection items

  ## Update mainNav local storage entities
  App.reqres.setHandler "navMain:update:entities", (items) ->
    API.saveLocal items

  ## Update mainNav local storage entities
  App.reqres.setHandler "navMain:update:defaults", (items) ->
    API.clearLocal()