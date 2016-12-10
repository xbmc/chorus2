@Kodi.module "LoadingApp", (LoadingApp, App, Backbone, Marionette, $, _) ->

  API =

    getLoaderView: (msgText = 'Just a sec...') ->
      new LoadingApp.Show.Page
        text: msgText

  App.commands.setHandler "loading:show:view", (region, msgText) ->
    view = API.getLoaderView msgText
    region.show view

  ## Replace whole page with loader.
  App.commands.setHandler "loading:show:page", ->
    App.execute "loading:show:view", App.regionContent