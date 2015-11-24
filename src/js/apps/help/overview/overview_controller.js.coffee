@Kodi.module "HelpApp.Overview", (Overview, App, Backbone, Marionette, $, _) ->

  class Overview.Controller extends App.Controllers.Base

    initialize: (options) ->

      # Load the page
      App.request "help:page", 'help-overview', (data) =>

        @layout = @getLayoutView data
        @listenTo @layout, "show", =>
          @getSideBar()
          @getPage data

        # Render layout
        App.regionContent.show @layout


    getPage: (data) ->
      view = new Overview.Page
        data: data
      @layout.regionContent.show view

    getSideBar: ->
      subNav = App.request "help:subnav"
      @layout.regionSidebarFirst.show subNav

    getLayoutView: ->
      new Overview.Layout()