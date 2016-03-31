@Kodi.module "AddonApp", (AddonApp, App, Backbone, Marionette, $, _) ->

  API =

    # Get the addon controller
    addonController: ->
      App.request "command:kodi:controller", 'auto', 'AddOn'

    # Get all enabled addons
    getEnabledAddons: (callback) ->
      addons = []
      # If loaded, return from static
      if config.getLocal "addOnsLoaded", false
        addons = config.getLocal("addOnsEnabled", [])
        if callback
          callback addons
      else
        # Not loaded, lookup and set to static
        @addonController().getEnabledAddons true, (addons) ->
          config.setLocal "addOnsEnabled", addons
          config.setLocal "addOnsLoaded", true
          if callback
            callback addons
      addons

    # Given a filter check if addon is enabled, if addons not loaded returns false.
    isAddOnEnabled: (filter = {}, callback) ->
      addons = @getEnabledAddons callback
      _.findWhere addons, filter


  # Store enabled addons.
  App.on "before:start", ->
    API.getEnabledAddons (resp) ->
      ## Loaded, hopefully before anything needs it

  # Request is addon enabled.
  App.reqres.setHandler 'addon:isEnabled', (filter, callback) ->
    API.isAddOnEnabled filter, (enabled) -> if callback then callback(enabled)

  # Request is addon enabled.
  App.reqres.setHandler 'addon:enabled:addons', (callback) ->
    API.getEnabledAddons (addons) -> if callback then callback(addons)