@Kodi.module "CommandApp.Kodi", (Api, App, Backbone, Marionette, $, _) ->

  ## Application commander.
  class Api.AddOn extends Api.Commander

    commandNameSpace: 'Addons'

    addonAllFields: [
      "name",
      "version",
      "summary",
      "description",
      "path",
      "author",
      "thumbnail",
      "disclaimer",
      "fanart",
      "dependencies",
      "broken",
      "extrainfo",
      "rating",
      "enabled"
    ]

    # Get an array of addons from the api
    getAddons: (type = "unknown", enabled = true, fields = [], callback) ->
      @singleCommand @getCommand('GetAddons'), [type, "unknown", enabled, fields], (resp) =>
        @doCallback callback, resp.addons

    # If load set then get all the addon fields else get basics
    getEnabledAddons: (load = true, callback) =>
      fields = if load then @addonAllFields else ["name"]
      @getAddons "unknown", true, fields, (resp) =>
        @doCallback callback, resp

    # If load set then get all the addon fields else get basics
    getAllAddons: (callback) =>
      @getAddons "unknown", "all", @addonAllFields, (resp) =>
        @doCallback callback, resp

    # Execute an addon
    executeAddon: (addonId, params = {}, callback) ->
      opts = {addonid: addonId}
      if not _.isEmpty params
        opts.params = params
      @singleCommand @getCommand('ExecuteAddon'), opts, (resp) =>
        @doCallback callback, resp.addons