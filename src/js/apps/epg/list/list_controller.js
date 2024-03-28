@Kodi.module "EPGApp.List", (List, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'childview:broadcast:play', (parent, child) ->
        App.execute 'broadcast:action', 'play', child
      App.listenTo view, 'childview:broadcast:record', (parent, child) ->
        App.execute 'broadcast:action', 'record', child
      App.listenTo view, 'childview:broadcast:timer', (parent, child) ->
        App.execute 'broadcast:action', 'timer', child

    bindChannelTriggers: (view) ->
      App.listenTo view, 'broadcast:play', (child) ->
        App.execute 'broadcast:action', 'play', child
      App.listenTo view, 'broadcast:record', (child) ->
        App.execute 'broadcast:action', 'record', child
      App.listenTo view, 'broadcast:timer', (child) ->
        App.execute 'broadcast:action', 'timer', child

  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      model = App.request 'channel:entity', options.channelid
      App.execute "when:entity:fetched", model, =>
        collection = App.request "broadcast:entities", options.channelid

        ## When fetched.
        App.execute "when:entity:fetched", collection, =>

          ## Get and setup the layout
          @layout = @getLayoutView collection
          @listenTo @layout, "show", =>
            @getSubNav model
            @getChannelActions model
            @renderProgrammes collection

          ## Render the layout
          App.regionContent.show @layout

    getLayoutView: (collection) ->
      new List.Layout
        collection: collection

    renderProgrammes: (collection) ->
      view = new List.EPGList
        collection: collection
      API.bindTriggers view
      @layout.regionContent.show view

    getSubNav: (model) ->
      subNav = App.request "navMain:children:show", 'pvr/tv', 'PVR'
      @layout.regionSidebarFirst.show subNav

    getChannelActions: (model) ->
      view = new List.ChannelActions
        model: model
      API.bindChannelTriggers view
      @layout.appendSidebarView 'channel-actions', view
