@Kodi.module "AddonApp", (AddonApp, App, Backbone, Marionette, $, _) ->

  API =

    addonController: ->
      App.request "command:kodi:controller", 'auto', 'AddOn'

    getEnabledAddons: (callback) ->
      @addonController().getEnabledAddons callback


  ## Store enabled addons.
  App.on "before:start", ->
    API.getEnabledAddons (resp) ->
      config.set "static", "addOnsEnabled", resp
      config.set "static", "addOnsLoaded", true