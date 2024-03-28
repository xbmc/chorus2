/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Shell", function(Shell, App, Backbone, Marionette, $, _) {

  let Cls = (Shell.Layout = class Layout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = "apps/shell/show/shell";
  
      this.prototype.regions = {
        regionNav: '#nav-bar',
        regionContent: '#content',
        regionSidebarFirst: '#sidebar-first',
        regionPlaylist: '#playlist-bar',
        regionTitle: '#page-title .title',
        regionTitleContext: '#page-title .context',
        regionFanart: '#fanart',
        regionPlayerKodi: '#player-kodi',
        regionPlayerLocal: '#player-local',
        regionModal: '#modal-window',
        regionModalTitle: '.modal-title',
        regionModalBody: '.modal-body',
        regionModalFooter: '.modal-footer',
        regionRemote: '#remote',
        regionSearch: '#search-region',
        regionTitle: '#page-title .title',
        regionOffscreen: '#offscreen'
      };
  
      this.prototype.triggers = {
        "click .playlist-toggle-open": "shell:playlist:toggle",
        "click .audio-scan": "shell:audio:scan",
        "click .video-scan": "shell:video:scan",
        "click .goto-lab": "shell:goto:lab",
        "click .send-input": "shell:send:input",
        "click .about": "shell:about",
        "click .selected-play": "shell:selected:play",
        "click .selected-add": "shell:selected:add",
        "click .selected-localadd": "shell:selected:localadd",
        "click .reconnect": "shell:reconnect"
      };
  
      this.prototype.events =
        {"click .player-menu > li": "closePlayerMenu"};
    }

    closePlayerMenu() {
      return App.execute("ui:playermenu", 'close');
    }
  });
  Cls.initClass();


  Cls = (Shell.HomepageLayout = class HomepageLayout extends Backbone.Marionette.LayoutView {
    static initClass() {
      this.prototype.template = "apps/shell/show/homepage";
    }
  });
  Cls.initClass();

  return App.execute("shell:view:ready");
});
