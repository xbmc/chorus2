@Kodi.module "CategoryApp.List", (List, App, Backbone, Marionette, $, _) ->


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      collection = App.request @getOption('entityKey'), @getOption('media')
      App.execute "when:entity:fetched", collection, =>

        @layout = @getLayoutView collection
        @listenTo @layout, "show", =>
          @renderList collection
          @getSubNav()

        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.Layout
        collection: collection

    renderList: (collection) ->
      view = new List.CategoryList
        collection: collection
      @layout.regionContent.show view

    getSubNav: ->
      subNav = App.request "navMain:children:show", @getOption('subNavParent'), 'Sections'
      @layout.regionSidebarFirst.show subNav