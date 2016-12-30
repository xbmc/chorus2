@Kodi.module "LoadingApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Page extends Backbone.Marionette.ItemView
    template: "apps/loading/show/loading_page"
    onRender: ->
      @$el.find('h2').html @options.text
    attributes: ->
      if @options.inline
        {
          class: 'loader-inline'
        }
