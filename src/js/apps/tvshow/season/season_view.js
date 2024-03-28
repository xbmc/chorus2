/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.Season", function(Season, App, Backbone, Marionette, $, _) {


  let Cls = (Season.SeasonTeaser = class SeasonTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play"       : "season:play",
        "click .watched"    : "season:watched",
        "click .add"        : "season:add"
      };
    }
    initialize() {
      super.initialize(...arguments);
      const subtitle = this.model.get('episode') + ' ' + tr('episodes');
      this.model.set({subtitle});
      this.model.set( App.request('tvshow:action:items') );
      return this.model.set({label: tr('Season') + ' ' + this.model.get('season')});
    }
    attributes() {
      return this.watchedAttributes('card tv-season prevent-select');
    }
  });
  Cls.initClass();

  Cls = (Season.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "season-empty-result";
    }
  });
  Cls.initClass();

  Cls = (Season.Seasons = class Seasons extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = Season.SeasonTeaser;
      this.prototype.emptyView = Season.Empty;
      this.prototype.tagName = "ul";
      this.prototype.className = "card-grid--tall";
    }
  });
  Cls.initClass();


  Cls = (Season.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'season-show tv-collection detail-container';
    }
  });
  Cls.initClass();

  Cls = (Season.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'season-details';
    }
  });
  Cls.initClass();

  Cls = (Season.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/tvshow/season/details_meta';
      this.prototype.triggers = {
        "click .play"       : "season:play",
        "click .add"        : "season:add"
      };
    }
    attributes() {
      return this.watchedAttributes('details-meta');
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Season.SeasonDetailTeaser = class SeasonDetailTeaser extends App.Views.CardView {
      static initClass() {
        this.prototype.tagName = "div";
        this.prototype.className = "card-detail";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});


