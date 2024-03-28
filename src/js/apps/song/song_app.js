@Kodi.module "SongApp", (SongApp, App, Backbone, Marionette, $, _) ->


  App.commands.setHandler 'song:edit', (model) ->
    loadedModel = App.request "song:entity", model.get('songid')
    App.execute "when:entity:fetched", loadedModel, =>
      new SongApp.Edit.Controller
        model: loadedModel

