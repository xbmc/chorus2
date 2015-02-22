@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Layout extends Backbone.Marionette.LayoutView
    template: "apps/shell/show/shell"

    regions:
      regionNav: '#nav-bar'
      regionContent: '#content'
      regionSidebarFirst: '#sidebar-first'
      regionPlaylist: '#playlist-bar'
      regionTitle: '#page-title .title'
      regionTitleContext: '#page-title .context'
      regionFanart: '#fanart'
      regionPlayerKodi: '#player-kodi'
      regionPlayerLocal: '#player-local'
      regionModal: '#modal-window'
      regionModalTitle: '.modal-title'
      regionModalBody: '.modal-body'
      regionModalFooter: '.modal-footer'
      regionRemote: '#remote'

    triggers:
      "click .playlist-toggle-open": "shell:playlist:toggle"

  class Shell.HomepageLayout extends Backbone.Marionette.LayoutView
    template: "apps/shell/show/homepage"

  App.execute "shell:view:ready"