@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Layout extends Backbone.Marionette.LayoutView
    template: "shell/show/shell"

    regions:
      regionNav: '#nav-bar'
      regionContent: '#content'
      regionSidebarFirst: '#sidebar-first'
      regionPlaylist: '#playlist-bar'
      regionPlaylistSummary: '#playlist-summary'
      regionTitle: '#page-title .title'
      regionTitleContext: '#page-title .context'
      regionFanart: '#fanart'

    triggers:
      "click .playlist-toggle-open": "shell:playlist:toggle"

  App.execute "shell:view:ready"