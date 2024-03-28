/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  let Cls = (Views.EmptyViewPage = class EmptyViewPage extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = "views/empty/empty_page";
      this.prototype.regions =
        {regionEmptyContent:  ".empty--page"};
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Views.EmptyViewResults = class EmptyViewResults extends App.Views.ItemView {
      static initClass() {
        this.prototype.template = "views/empty/empty_results";
        this.prototype.regions =
          {regionEmptyContent:  ".empty-result"};
      }
      onRender() {
        if (this.options && this.options.emptyKey) {
          $('.empty-key', this.$el).text(tr(this.options.emptyKey));
        }
        if (this.options && this.options.emptyBackUrl) {
          return $('.back-link', this.$el).html(this.themeLink(tr('Go back'), this.options.emptyBackUrl));
        }
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
