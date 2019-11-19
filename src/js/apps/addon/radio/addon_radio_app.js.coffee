@Kodi.module "AddonApp.Radio", (Radio, App, Backbone, Marionette, $, _) ->

  API =

    addonId: 'plugin.audio.radio_de'

    searchAddon:
      id: @addonId
      url: 'plugin://plugin.audio.radio_de/stations/search/[QUERY]'
      title: 'Radio'
      media: 'music'


  ## Provide search settings
  App.reqres.setHandler "addon:search:settings:" + API.addonId, ->
    API.searchAddon