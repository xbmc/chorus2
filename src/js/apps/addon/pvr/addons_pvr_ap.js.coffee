@Kodi.module "AddonApp.Pvr", (Pvr, App, Backbone, Marionette, $, _) ->

  API =

    isEnabled: ->
      App.request "addon:isEnabled", {type: 'xbmc.pvrclient'}

  ## Is a pvr client enabled.
  App.reqres.setHandler "addon:pvr:enabled", ->
    API.isEnabled()
