@Kodi.module "KodiEntities", (KodiEntities, App, Backbone, Marionette, $, _) ->

  ###
    API Helpers
  ###

  API =

    availableProviders: ['video', 'audio', 'executable']

    fields:
      minimal: ['addonid', 'name', 'type', 'thumbnail', 'label']
      small: ['author', 'broken', 'description', 'version', 'enabled', 'extrainfo', 'summary']
      full: ['fanart', 'path']

    ## Fetch an entity collection.
    getCollection: (type, callback) ->
      addonController = App.request "command:kodi:controller", 'auto', 'AddOn'
      addonController.getEnabledAddons true, (addons) ->
        collection = new KodiEntities.AddonCollection API.parseAddons(addons, type)
        callback collection

    ## Parse the addons, adding a provides property and setup other properties we'll need
    parseAddons: (addons, type) ->
      ret = []
      for i, addon of addons
        addon.provides = []
        addon.label = addon.name
        addon = App.request "images:path:entity", addon
        for extra in addon.extrainfo
          # We use the extrainfo to filter to only addons that provide content
          if _.isObject(extra) and extra.key is 'provides' and extra.value and helpers.global.inArray(extra.value, API.availableProviders)
            addon.provides.push extra.value
        # If addon provides and filter matches, add to collection
        if addon.provides.length > 0 and (helpers.global.inArray(type, addon.provides) or type is 'all')
          addon.providesDefault = _.first addon.provides
          addon.subtitle = tr(addon.providesDefault)
          ret.push API.parsePath(addon)
      ret

    ## Create a path for the addon depending on its function
    parsePath: (addon) ->
      if helpers.global.inArray 'executable', addon.provides
        addon.url = 'addon/execute/' + addon.addonid
      else
        media = addon.providesDefault.replace 'audio', 'music'
        addon.url = 'browser/' + media + '/' + encodeURIComponent('plugin://' + addon.addonid + '/')
      addon


  ###
   Models and collections.
  ###

  ## Single Addon model.
  class KodiEntities.Addon extends App.KodiEntities.Model
    idAttribute: "addonid"
    defaults: ->
      @parseFieldsToDefaults helpers.entities.getFields(API.fields, 'full'), {}

  ## Addon collection
  class KodiEntities.AddonCollection extends App.KodiEntities.Collection
    model: KodiEntities.Addon


  ###
   Request Handlers.
  ###

  ## Get a addon collection, optionally filtered by provider type
  App.reqres.setHandler "addon:entities", (type = 'all', callback) ->
    API.getCollection type, callback
