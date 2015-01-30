@Kodi.module "NavMain", (NavMain, App, Backbone, Marionette, $, _) ->

  class NavMain.List extends Backbone.Marionette.ItemView
    template: "navMain/show/navMain"