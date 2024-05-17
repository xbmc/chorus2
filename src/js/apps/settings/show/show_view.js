// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  let Cls = (Show.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "settings-page";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Show.Sidebar = class Sidebar extends App.Views.LayoutView {
      static initClass() {
        this.prototype.className = "settings-sidebar";
        this.prototype.template = "apps/settings/show/settings_sidebar";
        this.prototype.tagName = "div";
        this.prototype.regions = {
          regionKodiNav: '.kodi-nav',
          regionLocalNav: '.local-nav'
        };
      }
    });
    Cls.initClass();
    return Cls;
  })();
});

