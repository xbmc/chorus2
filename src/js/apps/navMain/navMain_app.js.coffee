@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  API =

    getNav: ->
      navStructure = App.request 'navMain:entities'
      new NavMain.List
        collection: navStructure

    getNavChildren: (parentId) ->
      navStructure = App.request 'navMain:entities', parentId
      new NavMain.ItemList
        collection: navStructure

  @onStart = (options) ->
    App.vent.on "shell:ready", (options) =>
      nav = API.getNav()
      App.regionNav.show nav

  App.reqres.setHandler "navMain:children:show", (parentId) ->
    API.getNavChildren(parentId)