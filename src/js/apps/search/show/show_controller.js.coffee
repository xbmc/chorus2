@Kodi.module "SearchApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Controller extends App.Controllers.Base

    ## The search landing page.
    initialize: (options) ->
      @landing = @getLanding()

      # Focus search input.
      @listenTo @landing, "show", =>
        $('#search').focus()

      # Show landing.
      App.regionContent.show @landing


    ## Get the base layout.
    getLanding: () ->
      new Show.Landing()
