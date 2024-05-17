// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.Episode", function(Episode, App, Backbone, Marionette, $, _) {

  const API = {

    //# Includes triggers for lists.
    getEpisodeList(collection) {
      const view = new Episode.Episodes({
        collection});
      App.listenTo(view, 'childview:episode:play', (parent, viewItem) => App.execute('episode:action', 'play', viewItem));
      App.listenTo(view, 'childview:episode:add', (parent, viewItem) => App.execute('episode:action', 'add', viewItem));
      App.listenTo(view, 'childview:episode:localplay', (parent, viewItem) => App.execute('episode:action', 'localplay', viewItem));
      App.listenTo(view, 'childview:episode:download', (parent, viewItem) => App.execute('episode:action', 'download', viewItem));
      App.listenTo(view, 'childview:episode:watched', (parent, viewItem) => App.execute('episode:action:watched', parent, viewItem));
      App.listenTo(view, 'childview:episode:goto:season', (parent, viewItem) => App.execute('episode:action', 'gotoSeason', viewItem));
      App.listenTo(view, 'childview:episode:edit', (parent, viewItem) => App.execute('episode:edit', viewItem.model));
      return view;
    },

    //# triggers for full view.
    bindTriggers(view) {
      App.listenTo(view, 'episode:play', viewItem => App.execute('episode:action', 'play', viewItem));
      App.listenTo(view, 'episode:add', viewItem => App.execute('episode:action', 'add', viewItem));
      App.listenTo(view, 'episode:localplay', viewItem => App.execute('episode:action', 'localplay', viewItem));
      App.listenTo(view, 'episode:download', viewItem => App.execute('episode:action', 'download', viewItem));
      App.listenTo(view, 'toggle:watched', viewItem => App.execute('episode:action:watched', viewItem.view, viewItem.view));
      App.listenTo(view, 'episode:refresh', viewItem => App.execute('episode:action', 'refresh', viewItem));
      return App.listenTo(view, 'episode:edit', viewItem => App.execute('episode:edit', viewItem.model));
    }
  };


  //# Main controller
  Episode.Controller = class Controller extends App.Controllers.Base {

    //# The TVShow page.
    initialize(options) {
      const id = parseInt(options.id);
      const seasonId = parseInt(options.season);
      const episodeId = parseInt(options.episodeid);

      //# Fetch the tvshow
      const episode = App.request("episode:entity", episodeId);
      return App.execute("when:entity:fetched", episode, () => {
        //# Get the layout.
        this.layout = this.getLayoutView(episode);

        //# Listen to the show of our layout.
        this.listenTo(this.layout, "show", () => {
          this.getDetailsLayoutView(episode);
          return this.getContentView(episode);
        });

        //# Add the layout to content.
        return App.regionContent.show(this.layout);
      });
    }

    getLayoutView(episode) {
      return new Episode.PageLayout({
        model: episode});
    }

    //# Build the details layout.
    getDetailsLayoutView(episode) {
      const headerLayout = new Episode.HeaderLayout({model: episode});
      this.listenTo(headerLayout, "show", () => {
        const teaser = new Episode.EpisodeDetailTeaser({model: episode});
        const detail = new Episode.Details({model: episode});
        API.bindTriggers(detail);
        headerLayout.regionSide.show(teaser);
        return headerLayout.regionMeta.show(detail);
      });
      return this.layout.regionHeader.show(headerLayout);
    }

    getContentView(episode) {
      this.contentLayout = new Episode.Content({model: episode});
      App.listenTo(this.contentLayout, 'show', () => {
        if (episode.get('cast').length > 0) {
          this.contentLayout.regionCast.show(this.getCast(episode));
        }
        return this.getSeason(episode);
      });
      return this.layout.regionContent.show(this.contentLayout);
    }

    getCast(episode) {
      return App.request('cast:list:view', episode.get('cast'), 'tvshows');
    }

    getSeason(episode) {
      const collection = App.request("episode:tvshow:entities", episode.get('tvshowid'), episode.get('season'));
      return App.execute("when:entity:fetched", collection, () => {
        collection.sortCollection('episode', 'asc');
        const view = App.request("episode:list:view", collection);
        return this.contentLayout.regionSeason.show(view);
      });
    }
  };


  //# handler for other modules to get a list view.
  return App.reqres.setHandler("episode:list:view", collection => API.getEpisodeList(collection));
});
