@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  API =

    getNav: ->
      navStructure = App.request 'navMain:entities'
      new NavMain.List
        collection: navStructure

    getNavChildren: (parentId, title = 'default') ->
      navStructure = App.request 'navMain:entities', parentId
      if title isnt 'default'
        navStructure.set({title: title})
      new NavMain.ItemList
        model: navStructure

    getNavCollection: (collection, title) ->
      navStructure = new App.Entities.NavMain
        title: title
        items: collection
      new NavMain.ItemList
        model: navStructure

  @onStart = (options) ->
    App.vent.on "shell:ready", (options) =>
      nav = API.getNav()
      App.regionNav.show nav

  App.reqres.setHandler "navMain:children:show", (parentId, title = 'default') ->
    API.getNavChildren parentId, title

  App.reqres.setHandler "navMain:collection:show", (collection, title = '') ->
    API.getNavCollection collection, title