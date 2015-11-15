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
          id: "settings/web"
          path: "settings/web"
        }
      ]

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
          kodiSettingsView = App.request "navMain:collection:show", collection, t.gettext('Kodi Settings')
          sidebarView.regionKodiNav.show kodiSettingsView

        # Get Local/Web settings menu.
        localNavCollection = App.request "navMain:array:entities", @localNav()
        localSettingsView = App.request "navMain:collection:show", localNavCollection, t.gettext('Web Settings')
        sidebarView.regionLocalNav.show localSettingsView

      sidebarView


  App.on "before:start", ->
    new SettingsApp.Router
      controller: API

  App.reqres.setHandler 'settings:subnav', ->
    API.getSubNav()

