/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SongApp.List", function(List, App, Backbone, Marionette, $, _) {

  const API = {

    //# Render the song view and attach to triggers
    getSongsView(songs, verbose = false) {
      this.songsView = new List.Songs({
        collection: songs,
        verbose
      });

      //# Triggers/Actions on a song
      App.listenTo(this.songsView, 'childview:song:play', (list, item) => {
        return this.playSong(item.model.get('songid'));
      });
      App.listenTo(this.songsView, 'childview:song:add', (list, item) => {
        return this.addSong(item.model.get('songid'));
      });
      App.listenTo(this.songsView, 'childview:song:localadd', (list, item) => {
        return this.localAddSong(item.model.get('songid'));
      });
      App.listenTo(this.songsView, 'childview:song:localplay', (list, item) => {
        return this.localPlaySong(item.model.get('songid'));
      });
      App.listenTo(this.songsView, 'childview:song:download', (list, item) => {
        return this.downloadSong(item.model);
      });
      App.listenTo(this.songsView, 'childview:song:musicvideo', (list, item) => {
        return App.execute("youtube:search:popup", item.model.get('label') + ' ' + item.model.get('artist'));
      });
      App.listenTo(this.songsView, 'childview:song:edit', (parent, item) => App.execute('song:edit', item.model));

      //# Potentially one of the songs could be playing so trigger a content state update
      App.listenTo(this.songsView, "show", () => App.vent.trigger("state:content:updated"));

      return this.songsView;
    },

    //# Play a tune
    playSong(songId) {
      return App.execute("command:audio:play", 'songid', songId);
    },

    //# Add a song to the list
    addSong(songId) {
      return App.execute("command:audio:add", 'songid', songId);
    },
      // playlist = App.request "command:kodi:controller", 'audio', 'PlayList'
      // playlist.add 'songid', songId

    //# Add the song to a local playlist
    localAddSong(songId) {
      return App.execute("localplaylist:addentity", 'songid', songId);
    },

    //# play the song locally
    localPlaySong(songId) {
      const localPlaylist = App.request("command:local:controller", 'audio', 'PlayList');
      return localPlaylist.play('songid', songId);
    },

    //# Download the song
    downloadSong(model) {
      const files = App.request("command:kodi:controller", 'video', 'Files');
      return files.downloadFile(model.get('file'));
    }
  };

  //# handler for other modules to get a songs view.
  return App.reqres.setHandler("song:list:view", (songs, verbose = false) => API.getSongsView(songs, verbose));
});
