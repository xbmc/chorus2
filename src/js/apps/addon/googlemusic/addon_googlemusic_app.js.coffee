@Kodi.module "AddonApp.GoogleMusic", (GoogleMusic, App, Backbone, Marionette, $, _) ->

  API =

    addonId: 'plugin.audio.googlemusic.exp'

    searchAddon:
      id: @addonId
      url: 'plugin://plugin.audio.googlemusic.exp/?path=search_result&type=track&query=[QUERY]'
      title: 'GoogleMusic'
      media: 'music'


  ## Provide search settings
  App.reqres.setHandler "addon:search:settings:" + API.addonId, ->
    API.searchAddon