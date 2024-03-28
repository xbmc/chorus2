/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.Episode", function(Episode, App, Backbone, Marionette, $, _) {


  let Cls = (Episode.EpisodeTeaser = class EpisodeTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play"        : "episode:play",
        "click .watched"     : "episode:watched",
        "click .add"         : "episode:add",
        "click .localplay"   : "episode:localplay",
        "click .download"    : "episode:download",
        "click .goto-season" : "episode:goto:season",
        "click .edit"        : "episode:edit"
      };
    }
    initialize() {
      super.initialize(...arguments);
      if (this.model != null) {
        this.setMeta();
        return this.model.set(App.request('episode:action:items'));
      }
    }
    attributes() {
      return this.watchedAttributes('card');
    }
    setMeta() {
      const epNum = this.themeTag('span', {class: 'ep-num'}, this.model.escape('season') + 'x' + this.model.escape('episode') + ' ');
      const epNumFull = this.themeTag('span', {class: 'ep-num-full'}, t.gettext('Episode') + ' ' + this.model.escape('episode'));
      const showLink = this.themeLink(this.model.escape('showtitle') + ' ', 'tvshow/' + this.model.escape('tvshowid'), {className: 'show-name'});
      const subTitleTip = this.model.escape('firstaired') ? {title: tr('First aired') + ': ' + this.model.escape('firstaired')} : {};
      return this.model.set({
        labelHtml: epNum + this.model.get('title'),
        subtitleHtml: this.themeTag('div', subTitleTip, showLink + epNumFull)
      });
    }
  });
  Cls.initClass();


  Cls = (Episode.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "episode-empty-result";
    }
  });
  Cls.initClass();

  Cls = (Episode.Episodes = class Episodes extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = Episode.EpisodeTeaser;
      this.prototype.emptyView = Episode.Empty;
      this.prototype.tagName = "ul";
      this.prototype.className = "card-grid--episode";
    }
  });
  Cls.initClass();


  Cls = (Episode.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'episode-show detail-container';
    }
  });
  Cls.initClass();

  Cls = (Episode.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'episode-details';
    }
  });
  Cls.initClass();

  Cls = (Episode.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/tvshow/episode/details_meta';
      this.prototype.triggers = {
        'click .play': 'episode:play',
        'click .add': 'episode:add',
        'click .stream': 'episode:localplay',
        'click .download': 'episode:download',
        'click .edit': 'episode:edit',
        'click .refresh': 'episode:refresh'
      };
    }
    attributes() {
      return this.watchedAttributes();
    }
  });
  Cls.initClass();

  Cls = (Episode.EpisodeDetailTeaser = class EpisodeDetailTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.tagName = "div";
      this.prototype.triggers =
        {"click .menu" : "episode-menu:clicked"};
    }
    initialize() {
      return this.model.set({actions: {thumbs: tr('Thumbs up')}});
    }
    attributes() {
      return this.watchedAttributes('card-detail');
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Episode.Content = class Content extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = 'apps/tvshow/episode/content';
        this.prototype.className = "episode-content content-sections";
        this.prototype.regions = {
          regionCast: '.region-cast',
          regionSeason: '.region-season'
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
    return Cls;
  })();
});
