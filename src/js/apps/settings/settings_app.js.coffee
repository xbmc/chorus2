@Kodi.module "SettingsApp", (SettingsApp, App, Backbone, Marionette, $, _) ->

  class SettingsApp.Router extends App.Router.Base
    appRoutes:
      "settings/web"   	: "local"
      "settings/kodi"	  : "kodi"
      "settings/kodi/:section" : "kodi"
      "settings/kodi/:section/:category" : "kodi"

  API =

    subNavId: 51

    local: ->
      new SettingsApp.Show.Local.Controller()

    localNav: ->
      [
        {
          title: "General"
          id: "general"
          path: "settings/web"
        }
      ]

    kodi: (section, category) ->
      new SettingsApp.Show.Kodi.Controller
        section: section
        category: category

    getSubNav: (callback) ->
      collection = App.request "settings:kodi:entities", {type: 'sections'}
      App.execute "when:entity:fetched", collection, =>
        kodiSettingsView = App.request "navMain:collection:show", collection, t.gettext('Kodi Settings')
        sidebarView = new SettingsApp.Show.Sidebar()
        App.listenTo sidebarView, "show", =>
          sidebarView.regionKodiNav.show kodiSettingsView
        if callback
          callback sidebarView


  App.on "before:start", ->
    new SettingsApp.Router
      controller: API

  App.reqres.setHandler 'settings:subnav', (callback) ->
    API.getSubNav callback

