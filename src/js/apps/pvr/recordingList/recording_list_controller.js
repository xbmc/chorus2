@Kodi.module "PVR.RecordingList", (List, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class List.Controller extends App.Controllers.Base

    initialize: (options) ->
      collection = App.request "recording:entities", options.group

      ## When fetched.
      App.execute "when:entity:fetched", collection, =>
        collection.sortCollection('starttime', 'desc')

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
      view = new List.RecordingList
        collection: collection
      @listenTo view, 'childview:recording:play', (parent, child) ->
        if child.model.get('player') is 'video'
          App.execute "input:resume", child.model, 'file'
        else
          playlist = App.request "command:kodi:controller", child.model.get('player'), 'PlayList'
          playlist.play 'file', child.model.get('file')
      @layout.regionContent.show view

    getSubNav: ->
      subNav = App.request "navMain:children:show", 'pvr/tv', 'PVR'
      @layout.regionSidebarFirst.show subNav
