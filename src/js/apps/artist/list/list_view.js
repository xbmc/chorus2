// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ArtistApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "artist-list with-filters";
    }
  });
  Cls.initClass();

  Cls = (List.ArtistTeaser = class ArtistTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play" : "artist:play",
        "click .dropdown .add" : "artist:add",
        "click .dropdown .localadd" : "artist:localadd",
        "click .dropdown .localplay" : "artist:localplay",
        "click .dropdown .edit" : "artist:edit"
      };
    }

    initialize() {
      super.initialize(...arguments);
      if (this.model != null) {
        return this.model.set(App.request('album:action:items'));
      }
    }
  });
  Cls.initClass();

  Cls = (List.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "artist-empty-result";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Artists = class Artists extends App.Views.VirtualListView {
      static initClass() {
        this.prototype.childView = List.ArtistTeaser;
        this.prototype.emptyView = List.Empty;
        this.prototype.tagName = "ul";
        this.prototype.className = "card-grid--wide";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
