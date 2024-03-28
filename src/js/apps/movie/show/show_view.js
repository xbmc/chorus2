/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MovieApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  let Cls = (Show.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'movie-show detail-container';
    }
  });
  Cls.initClass();

  Cls = (Show.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'movie-details';
    }
  });
  Cls.initClass();

  Cls = (Show.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/movie/show/details_meta';
      this.prototype.triggers = {
        'click .play': 'movie:play',
        'click .add': 'movie:add',
        'click .stream': 'movie:localplay',
        'click .download': 'movie:download',
        'click .edit': 'movie:edit',
        'click .refresh': 'movie:refresh'
      };
    }
    attributes() {
      return this.watchedAttributes();
    }
  });
  Cls.initClass();

  Cls = (Show.MovieTeaser = class MovieTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.tagName = "div";
      this.prototype.triggers =
        {'click .play': 'movie:play'};
    }
    initialize() {
      return this.model.set({actions: {thumbs: tr('Thumbs up')}});
    }
    attributes() {
      return this.watchedAttributes('card-detail');
    }
  });
  Cls.initClass();

  Cls = (Show.Content = class Content extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/movie/show/content';
      this.prototype.className = "movie-content content-sections";
      this.prototype.triggers =
        {'click .youtube': 'movie:youtube'};
      this.prototype.regions = {
        regionCast: '.region-cast',
        regionMore1: '.region-more-1',
        regionMore2: '.region-more-2',
        regionMore3: '.region-more-3',
        regionMore4: '.region-more-4',
        regionMore5: '.region-more-5'
      };
      this.prototype.modelEvents =
        {'change': 'modelChange'};
    }
    modelChange() {
      this.render();
      return this.trigger('show');
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Show.Set = class Set extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = 'apps/movie/show/set';
        this.prototype.className = 'movie-set';
      }
      onRender() {
        if (this.options && this.options.set) {
            return $('h2.set-name', this.$el).html( this.options.set );
          }
      }
      regions() {
        return {regionCollection: '.collection-items'};
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
