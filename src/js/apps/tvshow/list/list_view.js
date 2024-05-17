// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "tvshow-list with-filters";
    }
  });
  Cls.initClass();

  Cls = (List.TVShowTeaser = class TVShowTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play"       : "tvshow:play",
        "click .watched"    : "tvshow:watched",
        "click .add"        : "tvshow:add",
        "click .edit"       : "tvshow:edit"
      };
    }
    initialize() {
      super.initialize(...arguments);
      this.setMeta();
      return this.model.set( App.request('tvshow:action:items') );
    }
    attributes() {
      return this.watchedAttributes('card tv-show prevent-select');
    }
    setMeta() {
      if (this.model) {
        return this.model.set({
          subtitle: this.model.get('rating')});
      }
    }
  });
  Cls.initClass();

  Cls = (List.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "tvshow-empty-result";
    }
  });
  Cls.initClass();

  Cls = (List.TVShows = class TVShows extends App.Views.VirtualListView {
    static initClass() {
      this.prototype.childView = List.TVShowTeaser;
      this.prototype.emptyView = List.Empty;
      this.prototype.tagName = "ul";
      this.prototype.className = "card-grid--tall";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.TVShowsSet = class TVShowsSet extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.TVShowTeaser;
        this.prototype.emptyView = List.Empty;
        this.prototype.tagName = "ul";
        this.prototype.className = "card-grid--tall";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
