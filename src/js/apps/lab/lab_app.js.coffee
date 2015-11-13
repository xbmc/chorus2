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
      "lab" : "labLanding"
      "lab/api-browser"    : "apiBrowser"
      "lab/api-browser/:method"	: "apiBrowser"
      "lab/screenshot": "screenShot"

  # Lab API controller.
  API =

    labLanding: ->
      view = new LabApp.lab.labItems
        collection: new App.Entities.NavMainCollection @labItems()
      App.regionContent.show view

    # TODO Make dynamic, some sort of hook or registry.
    labItems: ->
      [
        {
          title: 'Api Browser'
          description: 'Execute any api command.'
          path: 'lab/api-browser'
        }
        {
          title: 'ScreenShot'
          description: 'Take a screen shot of Kodi right now.'
          path: 'lab/screenshot'
        }
      ]

    # Open the api explorer.
    apiBrowser: (method = false)->
      new LabApp.apiBrowser.Controller
        method: method

    screenShot: ->
      App.execute "input:action", 'screenshot'
      App.execute "notification:show", t.gettext("Screenshot saved to your screenshots folder")
      App.navigate "#lab", {trigger: true}


  App.on "before:start", ->
    new LabApp.Router
      controller: API
