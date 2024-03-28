// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ArtistApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  let Cls = (Show.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'artist-show detail-container';
    }
  });
  Cls.initClass();

  Cls = (Show.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'artist-details';
    }
  });
  Cls.initClass();

  Cls = (Show.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/artist/show/details_meta';
      this.prototype.triggers = {
        "click .play"       : "artist:play",
        "click .add"        : "artist:add",
        "click .localadd"   : "artist:localadd",
        "click .localplay"  : "artist:localplay",
        "click .edit"       : "artist:edit"
      };
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Show.ArtistTeaser = class ArtistTeaser extends App.ArtistApp.List.ArtistTeaser {
      static initClass() {
        this.prototype.tagName = "div";
      }
      initialize() {
        return this.model.set({actions: {thumbs: tr('Thumbs up')}});
      }
      attributes() {
        return this.watchedAttributes('card-detail');
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
