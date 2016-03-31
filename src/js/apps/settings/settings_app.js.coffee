@Kodi.module "SettingsApp", (SettingsApp, App, Backbone, Marionette, $, _) ->

  class SettingsApp.Router extends App.Router.Base
    appRoutes:
      "settings/web"   	: "local"
      "settings/kodi"	  : "kodi"
      "settings/kodi/:section" : "kodi"
      "settings/addons" : "addons"
      "settings/nav" : "navMain"

  API =

    subNavId: 'settings/web'

    local: ->
      new SettingsApp.Show.Local.Controller()

    addons: ->
      new SettingsApp.Show.Addons.Controller()

    navMain: ->
      new SettingsApp.Show.navMain.Controller()

    kodi: (section, category) ->
      new SettingsApp.Show.Kodi.Controller
        section: section
        category: category

    getSubNav: () ->
      collection = App.request "settings:kodi:entities", {type: 'sections'}
      sidebarView = new SettingsApp.Show.Sidebar()

      # On sidebar show.
      App.listenTo sidebarView, "show", =>

        # Get Kodi settings menu.
        App.execute "when:entity:fetched", collection, =>
          kodiSettingsView = App.request "navMain:collection:show", collection, t.gettext('Kodi settings')
          sidebarView.regionKodiNav.show kodiSettingsView

        # Get Local/Web settings menu.
        settingsNavView = App.request "navMain:children:show", API.subNavId, 'General'
        sidebarView.regionLocalNav.show settingsNavView

      sidebarView


  App.on "before:start", ->
    new SettingsApp.Router
      controller: API

  App.reqres.setHandler 'settings:subnav', ->
    API.getSubNav()

