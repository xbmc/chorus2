@Kodi.module "LoadingApp", (LoadingApp, App, Backbone, Marionette, $, _) ->

  App.commands.setHandler "loading:show:view", (region, msgText = 'Just a sec...') ->
    view = new LoadingApp.Show.Page
      text: msgText
    region.show view

  App.commands.setHandler "loading:show:page", ->
    App.execute "loading:show:view", App.regionContent