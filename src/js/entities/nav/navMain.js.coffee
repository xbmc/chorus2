@Kodi.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
	
	class Entities.NavMain extends Entities.Model
		defaults:
      id: 0
      title: 'Untitled'
      path: '#'
      icon: ''
      classes: ''
      parent: 0
      children: []
		
	class Entities.NavMainCollection extends Entities.Collection
		model: Entities.NavMain
	
	API =

		getDefaultStructure: (items, model) ->

      nav = []

      ## Music.
      nav.push {id: 1, title: "Music", path: '#music', icon: 'mdi-av-my-library-music', classes: 'nav-music', parent: 0}
      nav.push {id: 2, title: "Artists", path: '#music/artists', icon: '', classes: '', parent: 1}
      nav.push {id: 2, title: "Albums", path: '#music/albums', icon: '', classes: '', parent: 1}
      nav.push {id: 3, title: "Recently Added", path: '#music/added', icon: '', classes: '', parent: 1}
      nav.push {id: 4, title: "Recently Played", path: '#music/played', icon: '', classes: '', parent: 1}
      nav.push {id: 5, title: "Genres", path: '#music/genres', icon: '', classes: '', parent: 1}
      nav.push {id: 6, title: "Years", path: '#music/years', icon: '', classes: '', parent: 1}

      ## Movies.
      nav.push {id: 11, title: "Movies", path: '#movies', icon: 'mdi-av-movie', classes: 'nav-movies', parent: 0}
      nav.push {id: 12, title: "Recently Added", path: '#movies/added', icon: '', classes: '', parent: 11}
      nav.push {id: 13, title: "All", path: '#movies/all', icon: '', classes: '', parent: 11}
      nav.push {id: 14, title: "Genres", path: '#movies/genres', icon: '', classes: '', parent: 11}
      nav.push {id: 15, title: "Years", path: '#movies/years', icon: '', classes: '', parent: 11}

      ## TV.
      nav.push {id: 21, title: "TV Shows", path: '#tv', icon: 'mdi-hardware-tv', classes: 'nav-tv', parent: 0}
      nav.push {id: 22, title: "Recently Added", path: '#tv/added', icon: '', classes: '', parent: 21}
      nav.push {id: 23, title: "All", path: '#tv/all', icon: '', classes: '', parent: 21}
      nav.push {id: 24, title: "Genres", path: '#tv/genres', icon: '', classes: '', parent: 21}
      nav.push {id: 25, title: "Years", path: '#tv/years', icon: '', classes: '', parent: 21}

      ## Browser.
      nav.push {id: 31, title: "Browser", path: '#browser', icon: 'mdi-action-view-list', classes: 'nav-browser', parent: 0}
      nav.push {id: 32, title: "Files", path: '#browser/files', icon: '', classes: '', parent: 31}
      nav.push {id: 33, title: "AddOns", path: '#browser/addons', icon: '', classes: '', parent: 31}

      ## Thumbs up.
      nav.push {id: 41, title: "Thumbs Up", path: '#thumbsup', icon: 'mdi-action-thumb-up', classes: 'nav-thumbs-up', parent: 0}

      navParsed = @sortStructure nav

      navCollection = new Entities.NavMainCollection navParsed
      navCollection

    ## Sort the structure into a heirachy.
    sortStructure: (structure) ->
      children = {}

      ## Parse the children from via the parent.
      for model in structure when model.path? and model.parent isnt 0
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
	App.reqres.setHandler "navMain:entities", (items = [], model) ->
		API.getDefaultStructure items, model