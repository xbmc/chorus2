@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.EmptyViewPage extends App.Views.ItemView
    template: "views/empty/empty_page"
    regions:
      regionEmptyContent:  ".empty--page"

  class Views.EmptyViewResults extends App.Views.ItemView
    template: "views/empty/empty_results"
    regions:
      regionEmptyContent:  ".empty-result"
    onRender: ->
      if @options and @options.emptyKey
        $('.empty-key', @$el).text tr(@options.emptyKey)
      if @options and @options.emptyBackUrl
        $('.back-link', @$el).html @themeLink(tr('Go back'), @options.emptyBackUrl)
