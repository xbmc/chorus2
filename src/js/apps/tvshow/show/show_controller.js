/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  const API = {

    bindTriggersTVShow(view) {
      App.listenTo(view, 'tvshow:play', view => App.execute('tvshow:action', 'play', view));
      App.listenTo(view, 'tvshow:add', view => App.execute('tvshow:action', 'add', view));
      App.listenTo(view, 'toggle:watched', view => App.execute('tvshow:action:watched', view.view, view.view, true));
      App.listenTo(view, 'tvshow:refresh', view => App.execute('tvshow:action', 'refresh', view));
      App.listenTo(view, 'tvshow:refresh:episodes', view => App.execute('tvshow:action', 'refreshEpisodes', view));
      return App.listenTo(view, 'tvshow:edit', view => App.execute('tvshow:edit', view.model));
    },

    bindTriggersTVSeason(view) {
      App.listenTo(view, 'childview:season:play', (parent, viewItem) => App.execute('tvshow:action', 'play', viewItem));
      App.listenTo(view, 'childview:season:add', (parent, viewItem) => App.execute('tvshow:action', 'add', viewItem));
      return App.listenTo(view, 'childview:season:watched', (parent, viewItem) => App.execute('tvshow:action:watched', parent, viewItem, false));
    }
  };

  return Show.Controller = class Controller extends App.Controllers.Base {

    //# The TVShow page.
    initialize(options) {
      const id = parseInt(options.id);
      const tvshow = App.request("tvshow:entity", id);
      //# Fetch the tvshow
      return App.execute("when:entity:fetched", tvshow, () => {
        //# Get the layout.
        this.layout = this.getLayoutView(tvshow);
        //# Ensure background removed when we leave.
        this.listenTo(this.layout, "destroy", () => {
          return App.execute("images:fanart:set", 'none');
        });
        //# Listen to the show of our layout.
        this.listenTo(this.layout, "show", () => {
          this.getDetailsLayoutView(tvshow);
          return this.getSeasons(tvshow);
        });
        //# Add the layout to content.
        return App.regionContent.show(this.layout);
      });
    }

    //# Get the base layout
    getLayoutView(tvshow) {
      return new Show.PageLayout({
        model: tvshow});
    }

    //# Build the details layout.
    getDetailsLayoutView(tvshow) {
      const headerLayout = new Show.HeaderLayout({model: tvshow});
      this.listenTo(headerLayout, "show", () => {
        const teaser = new Show.TVShowTeaser({model: tvshow});
        const detail = new Show.Details({model: tvshow});
        API.bindTriggersTVShow(detail);
        API.bindTriggersTVShow(teaser);
        headerLayout.regionSide.show(teaser);
        return headerLayout.regionMeta.show(detail);
      });
      return this.layout.regionHeader.show(headerLayout);
    }

    getSeasons(tvshow) {
      const collection = App.request("season:entities", tvshow.get('tvshowid'));
      return App.execute("when:entity:fetched", collection, () => {
        const view = App.request("season:list:view", collection);
        API.bindTriggersTVSeason(view);
        if (this.layout.regionContent) {
          this.layout.regionContent.show(view);
          // On update to show, reload seasons
          return App.vent.on('entity:kodi:update', uid => {
            if (tvshow.get('uid') === uid) {
              return this.getSeasons(tvshow);
            }
          });
        }
      });
    }
  };
});
