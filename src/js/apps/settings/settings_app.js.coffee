@Kodi.module "SettingsApp", (SettingsApp, App, Backbone, Marionette, $, _) ->

  class SettingsApp.Router extends App.Router.Base
    appRoutes:
      "settings/web"   	: "local"
      "settings/kodi"	  : "kodi"

  API =

    subNavId: 51

    local: ->
      new SettingsApp.Show.Local.Controller()

    kodi: ->
      new SettingsApp.Show.Kodi.Controller()

    getSubNav: ->
      App.request "navMain:children:show", @subNavId, 'Sections'


  App.on "before:start", ->
    new SettingsApp.Router
      controller: API

  App.reqres.setHandler 'settings:subnav', ->
    API.getSubNav()

