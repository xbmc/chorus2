// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AlbumApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  var API = {

    bindTriggers(view) {
      App.listenTo(view, 'album:play', item => App.execute('album:action', 'play', item));
      App.listenTo(view, 'album:add', item => App.execute('album:action', 'add', item));
      App.listenTo(view, 'album:localadd', item => App.execute('album:action', 'localadd', item));
      App.listenTo(view, 'album:localplay', item => App.execute('album:action', 'localplay', item));
      return App.listenTo(view, 'album:edit', item => App.execute('album:edit', item.model));
    },

    //# Return a set of albums with songs.
    //# Songs is expected to be an array of song collections
    //# keyed by albumid. The only thing that should be calling this is artists.
    getAlbumsFromSongs(songs) {
      const albumsCollectionView = new Show.WithSongsCollection();
      //# What happens when we add a child to this mofo
      albumsCollectionView.on("add:child", albumView => {
        return App.execute("when:entity:fetched", album, () => {
          const {
            model
          } = albumView;
          //# Add the teaser.
          const teaser = new Show.AlbumTeaser({model});
          API.bindTriggers(teaser);
          albumView.regionMeta.show(teaser);
          //# Add the songs.
          const songSet = _.findWhere(songs, {albumid: model.get('albumid')});
          const songView = App.request("song:list:view", songSet.songs);
          return albumView.regionSongs.show(songView);
        });
      });
      //# Loop over albums/song collections
      for (var albumSet of songs) {
        //# Get the album.
        var album = App.request("album:entity", albumSet.albumid, { success(album) {
          return albumsCollectionView.addChild(album, Show.WithSongsLayout);
        }
      }
        );
      }
      //# Return the collection view
      return albumsCollectionView;
    }
  };


  //# When viewing a full page we call the controller
  Show.Controller = class Controller extends App.Controllers.Base {

    //# The Album page.
    initialize(options) {
      const id = parseInt(options.id);
      const album = App.request("album:entity", id);
      //# Fetch the artist
      return App.execute("when:entity:fetched", album, () => {
        //# Get the layout.
        this.layout = this.getLayoutView(album);
        //# Ensure background removed when we leave.
        this.listenTo(this.layout, "destroy", () => {
          return App.execute("images:fanart:set", 'none');
        });
        //# Listen to the show of our layout.
        this.listenTo(this.layout, "show", () => {
          this.getMusic(id);
          return this.getDetailsLayoutView(album);
        });
        //# Add the layout to content.
        return App.regionContent.show(this.layout);
      });
    }

    //# Get the base layout
    getLayoutView(album) {
      return new Show.PageLayout({
        model: album});
    }

    //# Build the details layout.
    getDetailsLayoutView(album) {
      const headerLayout = new Show.HeaderLayout({model: album});
      this.listenTo(headerLayout, "show", () => {
        const teaser = new Show.AlbumDetailTeaser({model: album});
        API.bindTriggers(teaser);
        const detail = new Show.Details({model: album});
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
      const options =
        {filter: {albumid: id}};
      //# Get all the songs and parse them into separate album collections.
      const songs = App.request("song:entities", options);
      return App.execute("when:entity:fetched", songs, () => {
        const albumView = new Show.WithSongsLayout();
        const songView = App.request("song:list:view", songs);
        this.listenTo(albumView, "show", () => {
          return albumView.regionSongs.show(songView);
        });
        return this.layout.regionContent.show(albumView);
      });
    }
  };


  //# Return a set of albums with songs.
  return App.reqres.setHandler("albums:withsongs:view", songs => API.getAlbumsFromSongs(songs));
});

