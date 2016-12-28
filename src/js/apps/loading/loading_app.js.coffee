@Kodi.module "LoadingApp", (LoadingApp, App, Backbone, Marionette, $, _) ->

  API =

    getLoaderView: (msgText = 'Just a sec...', inline = false) ->
      new LoadingApp.Show.Page
        text: msgText
        # Inline is used when the loader is not full page
        inline: inline

  App.commands.setHandler "loading:show:view", (region, msgText) ->
    view = API.getLoaderView msgText
    region.show view

  ## Replace whole page with loader.
  App.commands.setHandler "loading:show:page", ->
    App.execute "loading:show:view", App.regionContent

  ## Get a loader view
  App.reqres.setHandler "loading:get:view", (msgText, inline = true) ->
    API.getLoaderView msgText, inline