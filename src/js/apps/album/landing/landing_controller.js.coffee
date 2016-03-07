@Kodi.module "AlbumApp.Landing", (Landing, App, Backbone, Marionette, $, _) ->

  ## Main controller
  class Landing.Controller extends App.Controllers.Base

    subNavId: 'music'

    initialize: ->

      @layout = @getLayoutView()

      ## Render subviews on show
      @listenTo @layout, "show", =>
        @getPageView()
        @getSubNav()

      App.regionContent.show @layout

    getLayoutView: ->
      new Landing.Layout()

    getSubNav: ->
      subNav = App.request "navMain:children:show", @subNavId, 'Sections'
      @layout.regionSidebarFirst.show subNav

    getPageView: ->
      @page = new Landing.Page()
      @listenTo @page, "show", =>
        @renderRecentlyAdded()
        @renderRecentlyPlayed()
      @layout.regionContent.show @page

    renderRecentlyAdded: ->
      collection = App.request "album:recentlyadded:entities"
      App.execute "when:entity:fetched", collection, =>
        view = App.request "album:list:view", collection
        @page.regionRecentlyAdded.show view

    renderRecentlyPlayed: ->
      collection = App.request "album:recentlyplayed:entities"
      App.execute "when:entity:fetched", collection, =>
        view = App.request "album:list:view", collection
        @page.regionRecentlyPlayed.show view
