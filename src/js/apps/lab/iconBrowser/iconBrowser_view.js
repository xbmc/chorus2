/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("LabApp.IconBrowser", (lab, App, Backbone, Marionette, $, _) => (function() {
  const Cls = (lab.IconsPage = class IconsPage extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/lab/iconBrowser/icon_browser_page';
      this.prototype.tagName = "div";
      this.prototype.className = "icon-browser page";
    }
    onRender() {
      return (() => {
        const result = [];
        for (var type of ['material', 'custom']) {
          var $ctx = $('#icons-' + type, this.$el);
          var set = type + 'Icons';
          result.push((() => {
            const result1 = [];
            for (var icoClass in this.options[set]) {
              var name = this.options[set][icoClass];
              var $ico = $('<li><i class="' + icoClass + '"></i><span>' + name + '</span><small>' + icoClass + '</small></li>');
              result1.push($ctx.append($ico));
            }
            return result1;
          })());
        }
        return result;
      })();
    }
  });
  Cls.initClass();
  return Cls;
})());
