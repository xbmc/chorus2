/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SearchApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.PageLayout = class PageLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "search-page-layout";
    }
  });
  Cls.initClass();

  Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/search/list/search_layout';
      this.prototype.className = "search-page";
      this.prototype.regions = {
        artistSet: '.entity-set-artist',
        albumSet:  '.entity-set-album',
        songSet:   '.entity-set-song',
        movieSet:  '.entity-set-movie',
        tvshowSet: '.entity-set-tvshow',
        musicvideoSet: '.entity-set-musicvideo',
        loadingSet: '.entity-set-loading'
      };
  
      (function() {
        Cls = (List.ListSet = class ListSet extends App.Views.SetLayoutView {
          static initClass() {
            this.prototype.className = "search-set landing-set";
          }
          initialize() {
            this.setOptions();
            return this.createModel();
          }
          setOptions() {
            if (this.options.more && this.options.query) {
              return this.options.more = this.themeLink(t.gettext('Show more'), 'search/' + this.options.entity + '/' + this.options.query);
            }
          }
        });
        Cls.initClass();
        return Cls;
      })();
    }
    // Allow dynamically adding multiple addon views to a region
    appendAddonView(addonId, addonView) {
      const addonViewId = 'addonSet_' + addonId.split('.').join('_');
      $('.entity-set-addons', this.$el).append('<div id="' + addonViewId+ '">');
      this.regionManager.addRegion(addonViewId, '#' + addonViewId);
      return this[addonViewId].show(addonView);
    }
  });
  Cls.initClass();


  //# List of sidebar links for media and addons
  return (function() {
    Cls = (List.Sidebar = class Sidebar extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = 'apps/search/list/search_sidebar';
        this.prototype.className = "search-sidebar";
      }
      onRender() {
        const query = encodeURIComponent(this.options.query);
        return (() => {
          const result = [];
          for (var type in this.options.links) {
            var links = this.options.links[type];
            if (links.length === 0) {
              result.push($('.sidebar-section-' + type, this.$el).remove());
            } else {
              var $list = $('.search-' + type + '-links', this.$el);
              result.push((() => {
                const result1 = [];
                for (var item of links) {
                  var active = helpers.url.arg(1) === item.id ? 'active' : '';
                  var link = this.themeLink(t.gettext(item.title), 'search/' + item.id + '/' + query, {className: active});
                  result1.push($list.append(this.themeTag('li', {}, link)));
                }
                return result1;
              })());
            }
          }
          return result;
        })();
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
