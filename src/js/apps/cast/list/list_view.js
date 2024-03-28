/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CastApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.CastTeaser = class CastTeaser extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/cast/list/cast';
      this.prototype.tagName = "li";
      this.prototype.triggers = {
        "click .imdb"       : "cast:imdb",
        "click .google"    : "cast:google"
      };
    }
    onRender() {
      return _.defer(function() {
        // Prevent broken images
        const defaultThumb = App.request("images:path:get", '');
        return $('img', this.$el).on('error', function(e) {
          return $(this).attr('src', defaultThumb);
        });
      });
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.CastList = class CastList extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.CastTeaser;
        this.prototype.tagName = "ul";
        this.prototype.className = "cast-full";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
