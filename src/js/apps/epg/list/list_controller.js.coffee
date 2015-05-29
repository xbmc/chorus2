@Kodi.module "EPGApp.List", (List, App, Backbone, Marionette, $, _) ->


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      collection = App.request "broadcast:entities", options.channelid

      ## When fetched.
      App.execute "when:entity:fetched", collection, =>

        ## Get and setup the layout
        @layout = @getLayoutView collection
        @listenTo @layout, "show", =>
          @getSubNav()
          @renderProgrammes collection

        ## Render the layout
        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.Layout
        collection: collection

    renderProgrammes: (collection) ->
      view = new List.EPGList
        collection: collection
      ###@listenTo view, 'childview:channel:play', (parent, child) ->
        player = App.request "command:kodi:controller", 'auto', 'Player'
        player.playEntity 'channelid', child.model.get('id'), {},  =>
          ## update state?###
      @layout.regionContent.show view

    getSubNav: ->
      subNavId = if @getOption('type') is 'tv' then 21 else 1
      subNav = App.request "navMain:children:show", subNavId, 'Sections'
      @layout.regionSidebarFirst.show subNav
      