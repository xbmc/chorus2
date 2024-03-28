/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AlbumApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "album-list with-filters";
    }
  });
  Cls.initClass();

  Cls = (List.AlbumTeaser = class AlbumTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play"               : "album:play",
        "click .dropdown .add"      : "album:add",
        "click .dropdown .localadd" : "album:localadd",
        "click .dropdown .localplay" : "album:localplay",
        "click .dropdown .edit"     : "album:edit"
      };
    }
    initialize() {
      super.initialize(...arguments);
      if (this.model != null) {
        this.setMeta();
        return this.model.set(App.request('album:action:items'));
      }
    }
    setMeta() {
      if (this.model) {
        return this.model.set({subtitleHtml: this.themeLink(this.model.get('artist'), helpers.url.get('artist', this.model.get('artistid')))});
      }
    }
  });
  Cls.initClass();

  Cls = (List.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "album-empty-result";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Albums = class Albums extends App.Views.VirtualListView {
      static initClass() {
        this.prototype.childView = List.AlbumTeaser;
        this.prototype.emptyView = List.Empty;
        this.prototype.tagName = "ul";
        this.prototype.sort = 'artist';
        this.prototype.className = "card-grid--square";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
