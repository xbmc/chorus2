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
    className: "api-browser--page page-wrapper"

  # A single api method item
  class apiBrowser.apiMethodItem extends App.Views.ItemView
    className: "api-browser--method"
    template: 'apps/lab/apiBrowser/api_method_item'
    tagName: "li"
    triggers:
      'click .api-method--item' : 'lab:apibrowser:method:view'

  # List of api methods
  class apiBrowser.apiMethods extends App.Views.CompositeView
    template: 'apps/lab/apiBrowser/api_method_list'
    childView: apiBrowser.apiMethodItem
    childViewContainer: 'ul.items'
    tagName: "div"
    className: "api-browser--methods"
    onRender: ->
      $('#api-search', @$el).filterList {
        items: '.api-browser--methods .api-browser--method'
        textSelector: '.method'
      }

  # A single api page
  class apiBrowser.apiMethodPage extends App.Views.ItemView
    className: "api-browser--page"
    template: 'apps/lab/apiBrowser/api_method_page'
    tagName: "div"
    triggers:
      'click #send-command' : 'lab:apibrowser:execute'
    regions:
      'apiResult' : '#api-result'
    onShow: ->
      $('.api-method--params', @$el).html prettyPrint(@model.get('params'))
      if @model.get('type') is 'method'
        $('.api-method--return', @$el).html prettyPrint(@model.get('returns'))

  # Api browser landing (home)
  class apiBrowser.apiBrowserLanding extends App.Views.ItemView
    className: "api-browser--landing"
    template: 'apps/lab/apiBrowser/api_browser_landing'
    tagName: "div"
