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
      "lab/api-browser"         : "apiBrowser"
      "lab/api-browser/:method"	: "apiBrowser"
      "lab/screenshot"          : "screenShot"
      "lab/icon-browser"        : "iconBrowser"

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
          title: 'API browser'
          description: 'Execute any API command.'
          path: 'lab/api-browser'
        }
        {
          title: 'Screenshot'
          description: 'Take a screenshot of Kodi right now.'
          path: 'lab/screenshot'
        }
        {
          title: 'Icon browser'
          description: 'View all the icons available to Chorus.'
          path: 'lab/icon-browser'
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

    iconBrowser: ->
      $.getJSON 'lib/icons/mdi.json', (mdiIcons) =>
        $.getJSON 'lib/icons/icomoon.json', (customIcons) =>
          console.log mdiIcons, customIcons
          view = new LabApp.IconBrowser.IconsPage
            materialIcons: mdiIcons
            customIcons: customIcons
          App.regionContent.show view

  App.on "before:start", ->
    new LabApp.Router
      controller: API
