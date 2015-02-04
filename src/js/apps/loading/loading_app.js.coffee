@Kodi.module "LoadingApp", (LoadingApp, App, Backbone, Marionette, $, _) ->

  App.commands.setHandler "loading:show:page", ->
    page = new LoadingApp.Show.Page()
    App.regionContent.show page

  App.commands.setHandler "loading:show:view", (region) ->
    view = new LoadingApp.Show.Page()
    region.show view