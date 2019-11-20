@Kodi.module "HelpApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  # Main controller
  class Show.Controller extends App.Controllers.Base

    initialize: (options) ->

      # Load the page
      App.request "help:page", options.id, (data) =>

        @layout = @getLayoutView data
        @listenTo @layout, "show", =>
          @getSideBar()

        # Render layout
        App.regionContent.show @layout

        # If a page view is overridden set that to the content.
        if options.pageView
          @layout.regionContent.show options.pageView

    getSideBar: ->
      subNav = App.request "help:subnav"
      @layout.regionSidebarFirst.show subNav

    getLayoutView: (data) ->
      new Show.Layout
        data: data
        pageView: @options.pageView
