@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Layout extends App.Views.LayoutView
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
      regionSearch: '#search-region'
      regionTitle: '#page-title .title'
      regionOffscreen: '#offscreen'

    triggers:
      "click .playlist-toggle-open": "shell:playlist:toggle"
      "click .audio-scan": "shell:audio:scan"
      "click .video-scan": "shell:video:scan"
      "click .goto-lab": "shell:goto:lab"
      "click .send-input": "shell:send:input"
      "click .about": "shell:about"
      "click .selected-play": "shell:selected:play"
      "click .selected-add": "shell:selected:add"
      "click .selected-localadd": "shell:selected:localadd"

    events:
      "click .player-menu > li": "closePlayerMenu"

    closePlayerMenu: ->
      App.execute "ui:playermenu", 'close'


  class Shell.HomepageLayout extends Backbone.Marionette.LayoutView
    template: "apps/shell/show/homepage"

  App.execute "shell:view:ready"