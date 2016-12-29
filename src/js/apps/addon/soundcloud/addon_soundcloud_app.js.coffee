@Kodi.module "AddonApp.SoundCloud", (Soundcloud, App, Backbone, Marionette, $, _) ->

  API =

    addonId: 'plugin.audio.soundcloud'

    searchAddon:
      id: @addonId
      url: 'plugin://plugin.audio.soundcloud/search/query/?q=[QUERY]'
      title: 'SoundCloud'
      media: 'music'

  ## Provide search settings
  App.reqres.setHandler "addon:search:settings:" + API.addonId, ->
    API.searchAddon