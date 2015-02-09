@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
  class Entities.NavMain extends Entities.Model
    defaults:
      id: 0
      title: 'Untitled'
      path: ''
      icon: ''
      classes: ''
      parent: 0
      children: []
		
  class Entities.NavMainCollection extends Entities.Collection
    model: Entities.NavMain
	
  API =

    getItems: ->
      nav = []
      ## Music.
      nav.push {id: 1, title: "Music", path: 'music/artists', icon: 'mdi-av-my-library-music', classes: 'nav-music', parent: 0}
      nav.push {id: 2, title: "Artists", path: 'music/artists', icon: '', classes: '', parent: 1}
      nav.push {id: 3, title: "Albums", path: 'music/albums', icon: '', classes: '', parent: 1}
      nav.push {id: 4, title: "Recently Added", path: 'music/added', icon: '', classes: '', parent: 1}
      nav.push {id: 5, title: "Recently Played", path: 'music/played', icon: '', classes: '', parent: 1}

      ## Movies.
      nav.push {id: 11, title: "Movies", path: 'movies', icon: 'mdi-av-movie', classes: 'nav-movies', parent: 0}
      nav.push {id: 12, title: "Recently Added", path: 'movies/added', icon: '', classes: '', parent: 11}
      nav.push {id: 13, title: "All", path: 'movies', icon: '', classes: '', parent: 11}

      ## TV.
      nav.push {id: 21, title: "TV Shows", path: 'tvshows', icon: 'mdi-hardware-tv', classes: 'nav-tv', parent: 0}
      nav.push {id: 22, title: "Recently Added", path: 'tvshows/added', icon: '', classes: '', parent: 21}
      nav.push {id: 23, title: "All", path: 'tvshows', icon: '', classes: '', parent: 21}

      ## Browser.
      nav.push {id: 31, title: "Browser", path: 'browser', icon: 'mdi-action-view-list', classes: 'nav-browser', parent: 0}
      nav.push {id: 32, title: "Files", path: 'browser/files', icon: '', classes: '', parent: 31}
      nav.push {id: 33, title: "AddOns", path: 'browser/addons', icon: '', classes: '', parent: 31}

      ## Thumbs up.
      nav.push {id: 41, title: "Thumbs Up", path: 'thumbsup', icon: 'mdi-action-thumb-up', classes: 'nav-thumbs-up', parent: 0}
      nav.push {id: 42, title: "Playlists", path: 'playlists', icon: 'mdi-action-assignment', classes: 'playlists', parent: 0}

      ## Settings.
      nav.push {id: 51, title: "Settings", path: 'settings/web', icon: 'mdi-action-settings', classes: 'nav-browser', parent: 0}
      nav.push {id: 52, title: "Web Settings", path: 'settings/web', icon: '', classes: '', parent: 51}
      nav.push {id: 53, title: "Kodi Settings", path: 'settings/kodi', icon: '', classes: '', parent: 51}

      nav

    getDefaultStructure: ->
      navParsed = @sortStructure @getItems()
      navCollection = new Entities.NavMainCollection navParsed
      navCollection

    getChildStructure: (parentId) ->
      nav = @getItems()
      parent = _.findWhere nav, {id: parentId}
      childItems = _.where(nav, {parent: parentId})
      parent.items = new Entities.NavMainCollection childItems
      new Entities.NavMain parent

    ## Sort the structure into a heirachy.
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