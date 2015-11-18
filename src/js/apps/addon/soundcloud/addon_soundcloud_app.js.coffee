@Kodi.module "AddonApp.SoundCloud", (Soundcloud, App, Backbone, Marionette, $, _) ->

  API =

    isEnabled: ->
      App.request "addon:isEnabled", {addonid: 'plugin.audio.soundcloud'}

  ## Is a pvr client enabled.
  App.reqres.setHandler "addon:soundcloud:enabled", ->
    API.isEnabled()
