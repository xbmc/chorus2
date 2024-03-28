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
this.Kodi.module("MovieApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "movie-list with-filters";
    }
  });
  Cls.initClass();

  Cls = (List.MovieTeaser = class MovieTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play"          : "movie:play",
        "click .watched"       : "movie:watched",
        "click .add"           : "movie:add",
        "click .localplay"     : "movie:localplay",
        "click .download"      : "movie:download",
        "click .edit"          : "movie:edit"
      };
    }
    initialize() {
      super.initialize(...arguments);
      this.setMeta();
      if (this.model != null) {
        return this.model.set( App.request('movie:action:items') );
      }
    }
    attributes() {
      return this.watchedAttributes('card');
    }
    setMeta() {
      if (this.model) {
        return this.model.set({
          labelHtml: this.model.get('label'),
          subtitleHtml: this.themeLink(this.model.get('year'), 'movies?year=' + this.model.get('year'))
        });
      }
    }
  });
  Cls.initClass();

  Cls = (List.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "movie-empty-result";
    }
  });
  Cls.initClass();

  Cls = (List.Movies = class Movies extends App.Views.VirtualListView {
    static initClass() {
      this.prototype.childView = List.MovieTeaser;
      this.prototype.emptyView = List.Empty;
      this.prototype.tagName = "ul";
      this.prototype.className = "card-grid--tall";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.MoviesSet = class MoviesSet extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.MovieTeaser;
        this.prototype.emptyView = List.Empty;
        this.prototype.tagName = "ul";
        this.prototype.className = "card-grid--tall";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
