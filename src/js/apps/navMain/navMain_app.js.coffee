@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  API =
    getNav: ->
      navStructure = App.request 'navMain:entities';
      new NavMain.List
        collection: navStructure

  @onStart = (options) ->
    App.reqres.setHandler "navMain:view", (items = [], model) ->
      API.getNav()
