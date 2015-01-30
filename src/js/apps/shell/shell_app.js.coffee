@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Layout extends Backbone.Marionette.LayoutView
    template: "shell/show/shell"

    regions:
      regionNav: '#nav-bar'
      regionContent: '#content'
      regionSidebarFirst: '#sidebar-first'
      regionSidebarSecond: '#sidebar-second'
      regionTitle: '#page-title .title'
      regionTitleContext: '#page-title .context'

  App.addInitializer ->
    App.root.show( new Shell.Layout() )
