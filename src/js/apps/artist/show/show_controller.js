/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ArtistApp.Show", function(Show, App, Backbone, Marionette, $, _) {


  const API = {

    bindTriggers(view) {
      App.listenTo(view, 'artist:play', item => App.execute('artist:action', 'play', item));
      App.listenTo(view, 'artist:add', item => App.execute('artist:action', 'add', item));
      App.listenTo(view, 'artist:localadd', item => App.execute('artist:action', 'localadd', item));
      App.listenTo(view, 'artist:localplay', item => App.execute('artist:action', 'localplay', item));
      return App.listenTo(view, 'artist:edit', item => App.execute('artist:edit', item.model));
    }
  };

  return Show.Controller = class Controller extends App.Controllers.Base {

    //# The Artist page.
    initialize(options) {
      const id = parseInt(options.id);
      const artist = App.request("artist:entity", id);

      //# Fetch the artist
      return App.execute("when:entity:fetched", artist, () => {
        //# Get the layout.
        this.layout = this.getLayoutView(artist);
        //# Ensure background removed when we leave.
        this.listenTo(this.layout, "destroy", () => {
          return App.execute("images:fanart:set", 'none');
        });
        //# Listen to the show of our layout.
        this.listenTo(this.layout, "show", () => {
          this.getMusic(id);
          return this.getDetailsLayoutView(artist);
        });
        //# Add the layout to content.
        return App.regionContent.show(this.layout);
      });
    }

    //# Get the base layout
    getLayoutView(artist) {
      return new Show.PageLayout({
        model: artist});
    }

    //# Build the details layout.
    getDetailsLayoutView(artist) {
      const headerLayout = new Show.HeaderLayout({model: artist});
      this.listenTo(headerLayout, "show", () => {
        const teaser = new Show.ArtistTeaser({model: artist});
        API.bindTriggers(teaser);
        const detail = new Show.Details({model: artist});
        this.listenTo(detail, "show", () => {
          return API.bindTriggers(detail);
        });
        headerLayout.regionSide.show(teaser);
        return headerLayout.regionMeta.show(detail);
      });
      return this.layout.regionHeader.show(headerLayout);
    }

    //# Get a list of all the music for this artist parsed into albums.
    getMusic(id) {
      // Might take a while so show loader
      const loading = App.request("loading:get:view", tr('Loading albums'));
      this.layout.regionContent.show(loading);
      // Set artist id for fetch
      const options =
        {filter: {artistid: id}};
      // Get all the songs and parse them into separate album collections.
      const songs = App.request("song:entities", options);
      return App.execute("when:entity:fetched", songs, () => {
        const songsCollections = App.request("song:albumparse:entities", songs);
        const albumsCollection = App.request("albums:withsongs:view", songsCollections);
        return this.layout.regionContent.show(albumsCollection);
      });
    }
  };
});

