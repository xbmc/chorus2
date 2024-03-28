# View for the API Browser.
#
# @param [Object] This app object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "HelpApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "help--page page-wrapper"
    onRender: ->
      # Set the data.
      $(@regionContent.el, @$el).html @options.data
