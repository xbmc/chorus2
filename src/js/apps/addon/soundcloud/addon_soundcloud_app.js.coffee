@Kodi.module "AddonApp.SoundCloud", (Soundcloud, App, Backbone, Marionette, $, _) ->

  API =

    addonId: 'plugin.audio.soundcloud'

    searchAddon:
      id: @addonId
      url: 'plugin://plugin.audio.soundcloud/search/query/?q=[QUERY]'
      title: 'SoundCloud'
      media: 'music'


    isEnabled: ->
      App.request "addon:isEnabled", {addonid: @addonId}



  ## Is a pvr client enabled.
  App.reqres.setHandler "addon:soundcloud:enabled", ->
    API.isEnabled()

