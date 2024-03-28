@Kodi.module "AddonApp.List", (List, App, Backbone, Marionette, $, _) ->


  ## Main controller
  class List.Controller extends App.Controllers.Base

    ## Setup
    initialize: (options) ->
      @type = options.type
      App.request "addon:entities", @type, (collection) =>
        collection.sortCollection 'name'
        @layout = @getLayoutView collection
        @listenTo @layout, "show", =>
          @renderList collection
          @renderSidebar()
        App.regionContent.show @layout

    ## Render items
    renderList: (collection) ->
      view = new List.Addons
        collection: collection
      @layout.regionContent.show view

    ## Get the base layout
    getLayoutView: (collection) ->
      new List.ListLayout
        collection: collection

    ## Add side nav
    renderSidebar: ->
      settingsNavView = App.request "navMain:children:show", 'addons/all', 'Add-ons'
      @layout.regionSidebarFirst.show settingsNavView

