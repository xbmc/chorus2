@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

  API =

    localKey: 'mainNav'

    getItems: ->
      navCollection = @getLocalCollection()
      items = navCollection.getRawCollection()
      if items.length is 0
        items = @getDefaultItems()
      items

    getDefaultItems: (onlyVisible = true)->
      nav = []

      ## Music.
      nav.push {id: 1, title: tr("Music"), path: 'music', icon: 'mdi-av-my-library-music', classes: 'nav-music', parent: 0}
      nav.push {id: 2, title: tr("Music"), path: 'music', icon: '', classes: '', parent: 1}
      nav.push {id: 6, title: tr("Genres"), path: 'music/genres', icon: '', classes: '', parent: 1}
      nav.push {id: 7, title: tr("Top music"), path: 'music/top', icon: '', classes: '', parent: 1}
      nav.push {id: 3, title: tr("Artists"), path: 'music/artists', icon: '', classes: '', parent: 1}
      nav.push {id: 4, title: tr("Albums"), path: 'music/albums', icon: '', classes: '', parent: 1}
      nav.push {id: 8, title: tr("Videos"), path: 'music/videos', icon: '', classes: '', parent: 1}

      ## Movies.
      nav.push {id: 11, title: tr("Movies"), path: 'movies/recent', icon: 'mdi-av-movie', classes: 'nav-movies', parent: 0}
      nav.push {id: 12, title: tr("Movies"), path: 'movies/recent', icon: '', classes: '', parent: 11}
      nav.push {id: 13, title: tr("All movies"), path: 'movies', icon: '', classes: '', parent: 11}

      ## TV.
      nav.push {id: 21, title: tr("TV shows"), path: 'tvshows/recent', icon: 'mdi-hardware-tv', classes: 'nav-tv', parent: 0}
      nav.push {id: 22, title: tr("TV shows"), path: 'tvshows/recent', icon: '', classes: '', parent: 21}
      nav.push {id: 23, title: tr("All TV shows"), path: 'tvshows', icon: '', classes: '', parent: 21}

      ## Browser.
      nav.push {id: 31, title: tr("Browser"), path: 'browser', icon: 'mdi-action-view-list', classes: 'nav-browser', parent: 0}

      ## PVR
      nav.push {id: 81, title: tr("PVR"), path: 'pvr/tv', icon: 'mdi-action-settings-input-antenna', classes: 'pvr-link', parent: 0, visibility: "addon:pvr:enabled"}
      nav.push {id: 82, title: tr("TV Channels"), path: 'pvr/tv', icon: '', classes: '', parent: 81}
      nav.push {id: 83, title: tr("Radio Stations"), path: 'pvr/radio', icon: '', classes: '', parent: 81}
      nav.push {id: 84, title: tr("Recordings"), path: 'pvr/recordings', icon: '', classes: '', parent: 81}

      ## Addons
      nav.push {id: 71, title: tr("Add-ons"), path: 'addons/all', icon: 'mdi-action-extension', classes: 'nav-addons', parent: 0}
      nav.push {id: 72, title: tr("all"), path: 'addons/all', icon: '', classes: '', parent: 71}
      nav.push {id: 73, title: tr("video"), path: 'addons/video', icon: '', classes: '', parent: 71}
      nav.push {id: 74, title: tr("audio"), path: 'addons/audio', icon: '', classes: '', parent: 71}
      # Placeholder for pictures (75)
      nav.push {id: 76, title: tr("executable"), path: 'addons/executable', icon: '', classes: '', parent: 71}
      nav.push {id: 77, title: tr("settings"), path: 'settings/addons', icon: '', classes: '', parent: 71}

      ## Thumbs up.
      nav.push {id: 41, title: tr("Thumbs up"), path: 'thumbsup', icon: 'mdi-action-thumb-up', classes: 'nav-thumbs-up', parent: 0}

      ## Playlists.
      nav.push {id: 42, title: tr("Playlists"), path: 'playlists', icon: 'mdi-action-assignment', classes: 'playlists', parent: 0}

      ## Settings.
      nav.push {id: 51, title: tr("Settings"), path: 'settings/web', icon: 'mdi-action-settings', classes: 'nav-settings', parent: 0}
      nav.push {id: 52, title: tr("Web interface"), path: 'settings/web', icon: '', classes: '', parent: 51}
      nav.push {id: 54, title: tr("Main Menu"), path: 'settings/nav', icon: '', classes: '', parent: 51}
      nav.push {id: 53, title: tr("Add-ons"), path: 'settings/addons', icon: '', classes: '', parent: 51}
      nav.push {id: 55, title: tr("Search"), path: 'settings/search', icon: '', classes: '', parent: 51}


      ## Help
      nav.push {id: 61, title: tr("Help"), path: 'help', icon: 'mdi-action-help', classes: 'nav-help', parent: 0}

      ## Return only visible or all
      if onlyVisible
        @checkVisibility nav
      else
        nav

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
      nav = @getDefaultItems(false)
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
