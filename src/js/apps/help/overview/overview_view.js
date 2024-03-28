# View for the API Browser.
#
# @param [Object] This app object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "HelpApp.Overview", (Overview, App, Backbone, Marionette, $, _) ->

  class Overview.Page extends App.Views.CompositeView
    className: "help--overview"
    template: 'apps/help/overview/overview'
    tagName: "div"
    onRender: ->
      # Set the data/header.
      $('.help--overview--header', @$el).html @options.data


  class Overview.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "help--page help--overview page-wrapper"
