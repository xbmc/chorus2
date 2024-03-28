@Kodi.module "AddonApp", (AddonApp, App, Backbone, Marionette, $, _) ->

  class AddonApp.Router extends App.Router.Base
    appRoutes:
      "addons/:type"            : "list"
      "addon/execute/:id" : "execute"

  API =

    # Get list page
    list: (type) ->
      new AddonApp.List.Controller
        type: type

    # Execute addon
    execute: (id) ->
      API.addonController().executeAddon id, helpers.url.params(), () ->
        Kodi.execute "notification:show", tr('Executed addon')
      App.navigate "addons/executable", {trigger: true}

    # Get the addon controller
    addonController: ->
      App.request "command:kodi:controller", 'auto', 'AddOn'

    # Get all enabled addons
    getEnabledAddons: (callback) ->
      addons = []
      # If loaded, return from static
      if config.getLocal("addOnsLoaded", false) is true
        addons = config.getLocal("addOnsEnabled", [])
        if callback
          callback addons
      else
        # Not loaded, lookup and set to static
        @addonController().getEnabledAddons true, (addons) ->
          config.setLocal "addOnsEnabled", addons
          config.setLocal "addOnsLoaded", true
          config.set 'app', "addOnsSearchSettings", API.getSearchSettings(addons)
          if callback
            callback addons
      addons

    ## Get search settings
    getSearchSettings: (addons) ->
      searchSettings = []
      for addon in addons
        searchSetting = App.request("addon:search:settings:" + addon.addonid)
        if searchSetting
          if not _.isArray(searchSetting)
            searchSetting = [searchSetting]
          for i, set of searchSetting
            set.id = addon.addonid + '.' + i
            searchSettings.push set
      searchSettings

    # Given a filter check if addon is enabled, if addons not loaded returns false.
    isAddOnEnabled: (filter = {}, callback) ->
      addons = @getEnabledAddons callback
      _.findWhere addons, filter


  App.on "before:start", ->
    new AddonApp.Router
      controller: API
    # Store enabled addons.
    API.getEnabledAddons (resp) ->
      App.vent.trigger "navMain:refresh"
      # Addons loaded to cache, hopefully before required


  # Request is addon enabled.
  App.reqres.setHandler 'addon:isEnabled', (filter, callback) ->
    API.isAddOnEnabled filter, (enabled) -> if callback then callback(enabled)

  # Request is addon enabled.
  App.reqres.setHandler 'addon:enabled:addons', (callback) ->
    API.getEnabledAddons (addons) -> if callback then callback(addons)

  # Request excluded breadcrumb paths
  App.reqres.setHandler 'addon:excludedPaths', (addonId) ->
    if addonId?
      excludedPaths = App.request "addon:excludedPaths:" + addonId
    if not excludedPaths?
      excludedPaths = []
    excludedPaths

  # Request excluded breadcrumb paths
  App.reqres.setHandler 'addon:search:enabled', ->
    settings = config.get 'app', "addOnsSearchSettings", []
    settings = settings.concat App.request('searchAddons:entities').toJSON()
    settings
