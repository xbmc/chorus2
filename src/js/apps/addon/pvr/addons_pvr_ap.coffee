@Kodi.module "AddonApp.Pvr", (Pvr, App, Backbone, Marionette, $, _) ->

  API =

    isEnabled: ->
      App.request "addon:isEnabled", {type: 'kodi.pvrclient'}

  ## Is a pvr client enabled (used for menu visibility).
  App.reqres.setHandler "addon:pvr:enabled", ->
    API.isEnabled()
