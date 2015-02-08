@Kodi.module "SettingsApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "settings-page"