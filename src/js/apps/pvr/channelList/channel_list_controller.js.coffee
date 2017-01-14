@Kodi.module "PVR.ChannelList", (List, App, Backbone, Marionette, $, _) ->


  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      collection = App.request "channel:entities", options.group

      ## When fetched.
      App.execute "when:entity:fetched", collection, =>

        ## Get and setup the layout
        @layout = @getLayoutView collection
        @listenTo @layout, "show", =>
          @renderChannels collection
          @getSubNav()

        ## Render the layout
        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.Layout
        collection: collection

    renderChannels: (collection) ->
      view = new List.ChannelList
        collection: collection
      @listenTo view, 'childview:channel:play', (parent, child) ->
        player = App.request "command:kodi:controller", 'auto', 'Player'
        player.playEntity 'channelid', child.model.get('id'), {},  =>
          ## update state?
      @listenTo view, 'childview:channel:record', (parent, child) ->
        pvr = App.request "command:kodi:controller", 'auto', 'PVR'
        pvr.setRecord child.model.get('id'), {}, ->
          App.execute "notification:show", tr("Channel recording toggled")
      @layout.regionContent.show view

    getSubNav: ->
      subNav = App.request "navMain:children:show", 'pvr/tv', 'PVR'
      @layout.regionSidebarFirst.show subNav