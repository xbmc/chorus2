# View for the API Browser.
#
# @param [Object] This app object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "LabApp.apiBrowser", (apiBrowser, App, Backbone, Marionette, $, _) ->

  class apiBrowser.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "api-browser--page"

  # A single api method item
  class apiBrowser.apiMethodItem extends App.Views.ItemView
    className: "api-browser--method"
    template: 'apps/lab/apiBrowser/api_method_item'
    tagName: "li"
    triggers:
      'click .api-method--item' : 'method:view'

  # List of api methods
  class apiBrowser.apiMethods extends App.Views.CollectionView
    childView: apiBrowser.apiMethodItem
    tagName: "ul"
    className: "api-browser--methods"

  # A single api page
  class apiBrowser.apiMethodPage extends App.Views.ItemView
    className: "api-browser--page"
    template: 'apps/lab/apiBrowser/api_method_page'
    tagName: "div"
    onShow: ->
      $('.api-method--params', @$el).html prettyPrint(@model.get('params'))
      $('.api-method--return', @$el).html prettyPrint(@model.get('returns'))
