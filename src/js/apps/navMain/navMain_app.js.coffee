@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  API =

    getNav: ->
      navStructure = App.request 'navMain:entities'
      new NavMain.List
        collection: navStructure

    getNavChildren: (path, title = 'default') ->
      navStructure = App.request 'navMain:entities', path
      if title isnt 'default'
        navStructure.set({title: tr(title)})
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

  App.reqres.setHandler "navMain:children:show", (path, title = 'default') ->
    API.getNavChildren path, title

  App.reqres.setHandler "navMain:collection:show", (collection, title = '') ->
    API.getNavCollection collection, title

  App.vent.on "navMain:refresh", ->
    nav = API.getNav()
    App.regionNav.show nav
