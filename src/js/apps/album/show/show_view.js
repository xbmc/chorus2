/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AlbumApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  //# Album with songs.

  let Cls = (Show.WithSongsLayout = class WithSongsLayout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/album/show/album_with_songs';
      this.prototype.className = 'album-wrapper';
      this.prototype.regions = {
        regionMeta: '.region-album-meta',
        regionSongs: '.region-album-songs'
      };
    }
  });
  Cls.initClass();

  Cls = (Show.WithSongsCollection = class WithSongsCollection extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = Show.WithSongsLayout;
      this.prototype.tagName = "div";
      this.prototype.sort = 'year';
      this.prototype.className = "albums-wrapper";
    }
  });
  Cls.initClass();

  //# Full page views.

  Cls = (Show.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'album-show detail-container';
    }
  });
  Cls.initClass();

  Cls = (Show.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'album-details';
    }
  });
  Cls.initClass();

  Cls = (Show.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/album/show/details_meta';
      this.prototype.triggers = {
        "click .play"       : "album:play",
        "click .add"        : "album:add",
        "click .localadd"   : "album:localadd",
        "click .localplay"  : "album:localplay",
        "click .edit"       : "album:edit"
      };
    }
  });
  Cls.initClass();

  Cls = (Show.AlbumTeaser = class AlbumTeaser extends App.AlbumApp.List.AlbumTeaser {
    static initClass() {
      this.prototype.tagName = "div";
    }
    initialize() {
      this.setMeta();
      return this.model.set(App.request('album:action:items'));
    }
    setMeta() {
      return this.model.set({
        subtitleHtml: this.themeLink(this.model.get('year'), 'music/albums?year=' + this.model.get('year'))});
    }
    attributes() {
      return this.watchedAttributes('card-minimal');
    }
  });
  Cls.initClass();

  return (Show.AlbumDetailTeaser = class AlbumDetailTeaser extends Show.AlbumTeaser {
    attributes() {
      return this.watchedAttributes('card-detail');
    }
  });
});
