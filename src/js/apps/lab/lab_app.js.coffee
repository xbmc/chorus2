# Lab App handles new experimental features.
#
# Each sub module should have its own folder with controller, view, etc.
# Global Lab features here.
#
# @param [Object] This app object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "LabApp", (LabApp, App, Backbone, Marionette, $, _) ->

  # Create our LabApp router.
  class LabApp.Router extends App.Router.Base
    appRoutes:
      "lab/api-browser"    : "apiBrowser"
      "lab/api-browser/:method"	: "apiBrowser"

  # Lab API controller.
  API =

    # Open the api explorer.
    apiBrowser: (method = false)->
      new LabApp.apiBrowser.Controller
        method: method


  App.on "before:start", ->
    new LabApp.Router
      controller: API
