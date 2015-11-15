@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
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
		
  class Entities.NavMainCollection extends App.Entities.Collection
    model: Entities.NavMain
	
  API =

    getItems: ->
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
      nav.push {id: 51, title: "Settings", path: 'settings/web', icon: 'mdi-action-settings', classes: 'nav-browser', parent: 0}
      nav.push {id: 52, title: "Web settings", path: 'settings/web', icon: '', classes: '', parent: 51}
      nav.push {id: 53, title: "Kodi settings", path: 'settings/kodi', icon: '', classes: '', parent: 51}

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

    ## Get a full standard structure
    getDefaultStructure: ->
      navParsed = @sortStructure @getItems()
      navCollection = new Entities.NavMainCollection navParsed
      navCollection

    ## Get only child items from a given parent
    getChildStructure: (parentId) ->
      nav = @getItems()
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

  ## Handler to return the collection
  App.reqres.setHandler "navMain:entities", (parentId = 'all') ->
    if parentId is 'all'
      API.getDefaultStructure()
    else
      API.getChildStructure parentId

  ## Turn an array of link objects into a collection.
  App.reqres.setHandler "navMain:array:entities", (items) ->
    new Entities.NavMainCollection items