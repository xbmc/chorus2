/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlayerApp.Show", (Show, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (Show.Player = class Player extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = "apps/player/show/player";

      this.prototype.regions = {
        regionProgress  : '.playing-progress',
        regionVolume    : '.volume',
        regionThumbnail : '.playing-thumb',
        regionTitle     : '.playing-title',
        regionSubtitle  : '.playing-subtitle',
        regionTimeCur   : '.playing-time-current',
        regionTimeDur   : '.playing-time-duration'
      };
      this.prototype.triggers = {
        'click .remote-toggle'    : 'remote:toggle',
        'click .control-prev'     : 'control:prev',
        'click .control-play'     : 'control:play',
        'click .control-next'     : 'control:next',
        'click .control-stop'     : 'control:stop',
        'click .control-mute'     : 'control:mute',
        'click .control-shuffle'  : 'control:shuffle',
        'click .control-repeat'   : 'control:repeat',
        'click .control-menu'     : 'control:menu'
      };
    }
  });
  Cls.initClass();
  return Cls;
})());
