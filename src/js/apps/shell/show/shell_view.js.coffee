@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Layout extends Backbone.Marionette.LayoutView
    template: "apps/shell/show/shell"

    regions:
      regionNav: '#nav-bar'
      regionContent: '#content'
      regionSidebarFirst: '#sidebar-first'
      regionPlaylist: '#playlist-bar'
      regionPlaylistSummary: '#playlist-summary'
      regionTitle: '#page-title .title'
      regionTitleContext: '#page-title .context'
      regionFanart: '#fanart'
      regionPlayerKodi: '#player-kodi'
      regionPlayerLocal: '#player-local'

    triggers:
      "click .playlist-toggle-open": "shell:playlist:toggle"

  App.execute "shell:view:ready"