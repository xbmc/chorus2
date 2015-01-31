@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  class NavMain.List extends Backbone.Marionette.ItemView
    template: "apps/navMain/show/navMain"