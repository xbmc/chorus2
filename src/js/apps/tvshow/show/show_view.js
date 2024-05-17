// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  let Cls = (Show.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'tvshow-show tv-collection detail-container';
    }
  });
  Cls.initClass();

  Cls = (Show.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'tvshow-details';
    }
  });
  Cls.initClass();

  Cls = (Show.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/tvshow/show/details_meta';
      this.prototype.triggers = {
        "click .play"               : "tvshow:play",
        "click .add"                : "tvshow:add",
        "click .edit"               : "tvshow:edit",
        "click .refresh"            : "tvshow:refresh",
        "click .refresh-episodes"   : "tvshow:refresh:episodes"
      };
    }
    attributes() {
      return this.watchedAttributes('details-meta');
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Show.TVShowTeaser = class TVShowTeaser extends App.Views.CardView {
      static initClass() {
        this.prototype.tagName = "div";
        this.prototype.triggers =
          {"click .play"       : "tvshow:play"};
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
