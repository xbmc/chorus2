@Kodi.module "SettingsApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "settings-page"

  class Show.Sidebar extends App.Views.LayoutView
    className: "settings-sidebar"
    template: "apps/settings/show/settings_sidebar"
    tagName: "div"
    regions:
      regionKodiNav: '.kodi-nav'
      regionLocalNav: '.local-nav'

