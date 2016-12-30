@Kodi.module "AddonApp.MixCloud", (MixCloud, App, Backbone, Marionette, $, _) ->

  API =

    addonId: 'plugin.audio.mixcloud'

    searchAddon:
      id: @addonId
      url: 'plugin://plugin.audio.mixcloud/?mode=30&key=cloudcast&offset=0&query=[QUERY]'
      title: 'MixCloud'
      media: 'music'

  ## Provide search settings
  App.reqres.setHandler "addon:search:settings:" + API.addonId, ->
    API.searchAddon