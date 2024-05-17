// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("LandingApp.Show", function(Show, App, Backbone, Marionette, $, _) {


  return Show.Controller = class Controller extends App.Controllers.Base {

    constructor(...args) {
      super(...args);
      this.getSections = this.getSections.bind(this);
      this.renderSection = this.renderSection.bind(this);
    }

    initialize(options) {
      this.fanarts = [];
      this.rendered = 0;
      this.settings = options.settings;
      this.layout = this.getLayoutView();
      $('body').addClass('landing-loading');
      this.listenTo(this.layout, "show", () => {
        this.content = this.getContentView();
        this.listenTo(this.content, "show", () => {
          window.scroll(0, 350);
          this.getSections(this.settings.sections);
          return this.getSubNav(this.settings.subnavId);
        });
        return this.layout.regionContent.show(this.content);
      });

      return App.regionContent.show(this.layout);
    }

    getLayoutView() {
      return new Show.Layout();
    }

    getContentView() {
      return new Show.Page();
    }

    getSubNav(subnavId) {
      const subNav = App.request("navMain:children:show", subnavId, 'Sections');
      return this.layout.regionSidebarFirst.show(subNav);
    }

    getSections(sections) {
      return (() => {
        const result = [];
        for (var i in sections) {
          var section = sections[i];
          section.idx = parseInt(i) + 1;
          result.push(this.getSection(section));
        }
        return result;
      })();
    }

    getSection(section) {
      section = this.addFilterValue(section);
      const opts = {
        sort: {method: section.sort, order: section.order},
        limit: {start: 0, end: section.limit},
        addFields: ['fanart'],
        cache: false,
        success: collection => {
          this.rendered++;
          if (collection.length > 0) {
            this.renderSection(section, collection);
            return this.getFanArts(collection);
          }
        }
      };
      if (section.filter) {
        opts.filter = section.filter;
      }
      return App.request(`${section.entity}:entities`, opts);
    }

    renderSection(section, collection) {
      const view = App.request(`${section.entity}:list:view`, collection, true);
      const setView = new Show.ListSet({
        section,
        filter: this.getOption('filter')
      });
      App.listenTo(setView, "show", () => {
        return setView.regionCollection.show(view);
      });
      App.listenTo(setView, 'landing:set:more', viewItem => App.navigate(viewItem.model.get('section').moreLink, {trigger: true}));
      if (this.content[`regionSection${section.idx}`]) {
        return this.content[`regionSection${section.idx}`].show(setView);
      }
    }

    addFilterValue(section) {
      const filterVal = this.getOption('filter');
      if (filterVal !== false) {
        if (section.filter && section.filter.value) {
          // TODO: Deal with complex nested rules that us 'and' or 'or'
          section.filter.value = filterVal;
        }
      }
      return section;
    }

    getFanArts(collection) {
      const $hero = $("#landing-hero");
      for (var item of collection.toJSON()) {
        if (item.fanart && (item.fanart !== '')) {
          this.fanarts.push(item);
        }
      }
      if ($hero.is(':visible') && (this.rendered === this.settings.sections.length) && (this.fanarts.length > 0)) {
        const randomModel = this.fanarts[Math.floor(Math.random() * this.fanarts.length)];
        $hero
          .css('background-image', 'url(' + randomModel.fanart + ')')
          .attr('href', '#' + randomModel.url).attr('title', randomModel.title);
        return $('body').removeClass('landing-loading');
      }
    }
  };
});
