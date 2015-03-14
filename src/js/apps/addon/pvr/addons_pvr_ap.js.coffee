@Kodi.module "AddonApp.Pvr", (Pvr, App, Backbone, Marionette, $, _) ->

  API =

    pvrEnabled: ->
      enabled = false
      if config.get("static", "addOnsLoaded", false)
        addons = config.get("static", "addOnsEnabled", [])
        pvrClients = _.findWhere addons, {type: 'xbmc.pvrclient'}
        enabled = if pvrClients? then true else false
      enabled


  ## Is a pvr client enabled.
  App.reqres.setHandler "addon:pvr:enabled", ->
    API.pvrEnabled()
    