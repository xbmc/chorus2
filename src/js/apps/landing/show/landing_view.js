// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("LandingApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  let Cls = (Show.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "landing-page";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Show.Page = class Page extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = "apps/landing/show/landing_page";
        this.prototype.className = "landing-content";
        this.prototype.regions = {
          regionHero: '#landing-hero',
          regionSection1: '#landing-section-1',
          regionSection2: '#landing-section-2',
          regionSection3: '#landing-section-3',
          regionSection4: '#landing-section-4',
          regionSection5: '#landing-section-5',
          regionSection6: '#landing-section-6'
        };
  
        (function() {
          Cls = (Show.ListSet = class ListSet extends App.Views.SetLayoutView {
            static initClass() {
              this.prototype.className = 'landing-set';
              this.prototype.triggers =
                {'click .more'     : 'landing:set:more'};
            }
            initialize() {
              this.setOptions();
              return this.createModel();
            }
            setOptions() {
              this.options.menu = {};
              if ((this.options.filter !== false) && this.options.section.title) {
                this.options.title = t.sprintf(tr(this.options.section.title), this.options.filter);
              } else if (this.options.section.title) {
                this.options.title = tr(this.options.section.title);
              }
              if (this.options.section.moreLink) {
                this.options.menu.more = tr('More like this');
              }
              if (this.options.section.preventSelect) {
                return this.options.noMenuDefault = true;
              }
            }
          });
          Cls.initClass();
          return Cls;
        })();
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
