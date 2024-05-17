// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.Season", function(Season, App, Backbone, Marionette, $, _) {

  const API = {

    getSeasonList(collection) {
      const view = new Season.Seasons({
        collection});
      return view;
    },

    bindTriggers(view) {
      App.listenTo(view, 'season:play', view => App.execute('tvshow:action', 'play', view));
      App.listenTo(view, 'season:add', view => App.execute('tvshow:action', 'add', view));
      return App.listenTo(view, 'toggle:watched', view => App.execute('tvshow:action:watched', view.view, view.view, true));
    },

    mergeSeasonDetails(tvshow, season, seasons) {
      const mergeAttributes = ['season', 'thumbnail', 'episode', 'unwatched', 'playcount', 'progress', 'watchedepisodes'];
      const attributes = {seasons, type: 'season'};
      for (var prop of mergeAttributes) {
        attributes[prop] = season.get(prop);
      }
      tvshow.set(attributes);
      return tvshow;
    }
  };


  //# Main controller
  Season.Controller = class Controller extends App.Controllers.Base {

    //# The TVShow page.
    initialize(options) {
      const id = parseInt(options.id);
      const seasonId = parseInt(options.season);

      //# Fetch the tvshow
      let tvshow = App.request("tvshow:entity", id);
      return App.execute("when:entity:fetched", tvshow, () => {

        //# Fetch the seasons
        const seasons = App.request("season:entities", tvshow.get('id'));
        return App.execute("when:entity:fetched", seasons, () => {
          //# Merge current season
          const season = seasons.findWhere({season: seasonId});
          tvshow = API.mergeSeasonDetails(tvshow, season, seasons);

          //# Get the layout.
          this.layout = this.getLayoutView(tvshow);

          //# Listen to the show of our layout.
          this.listenTo(this.layout, "show", () => {
            this.getDetailsLayoutView(tvshow);
            return this.getEpisodes(tvshow, seasonId);
          });

          //# Add the layout to content.
          return App.regionContent.show(this.layout);
        });
      });
    }

    getLayoutView(tvshow) {
      return new Season.PageLayout({
        model: tvshow});
    }

    //# Build the details layout.
    getDetailsLayoutView(tvshow) {
        const headerLayout = new Season.HeaderLayout({model: tvshow});
        this.listenTo(headerLayout, "show", () => {
          const teaser = new Season.SeasonDetailTeaser({model: tvshow});
          const detail = new Season.Details({model: tvshow});
          API.bindTriggers(detail);
          headerLayout.regionSide.show(teaser);
          return headerLayout.regionMeta.show(detail);
        });
        return this.layout.regionHeader.show(headerLayout);
      }

    //# Get the episodes
    getEpisodes(tvshow, seasonId) {
      const collection = App.request("episode:tvshow:entities", tvshow.get('tvshowid'), seasonId);
      return App.execute("when:entity:fetched", collection, () => {
        collection.sortCollection('episode', 'asc');
        const view = App.request("episode:list:view", collection);
        return this.layout.regionContent.show(view);
      });
    }
  };


  //# handler for other modules to get a list view.
  return App.reqres.setHandler("season:list:view", collection => API.getSeasonList(collection));
});
