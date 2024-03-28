/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {

  return List.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      //# Watch the shell and render when ready.
      return App.vent.on("shell:ready", options => {
        return this.getPlaylistBar();
      });
    }

    playlistController(player, media) {
      return App.request(`command:${player}:controller`, media, 'PlayList');
    }

    playerController(player, media) {
      return App.request(`command:${player}:controller`, media, 'Player');
    }

    playerCommand(player, command, params = []) {
      return App.request(`command:${player}:player`, command, params, () => App.request("state:kodi:update"));
    }

    stateObj() {
      return App.request("state:current");
    }

    getPlaylistBar() {
      this.layout = this.getLayout();

      this.listenTo(this.layout, "show", () => {
        //# Load the kodi audio list
        this.renderList('kodi', 'audio');
        this.renderList('local', 'audio');
        //# Set the initial active playlist
        return App.vent.on("state:initialized", () => {
          return this.changePlaylist(this.stateObj().getState('player'), this.stateObj().getState('media'));
        });
      });

      this.listenTo(this.layout, 'playlist:kodi:audio', () => {
        return this.changePlaylist('kodi', 'audio');
      });
      this.listenTo(this.layout, 'playlist:kodi:video', () => {
        return this.changePlaylist('kodi', 'video');
      });
      this.listenTo(this.layout, 'playlist:kodi', () => {
        this.stateObj().setPlayer('kodi');
        return this.renderList('kodi', 'audio');
      });
      this.listenTo(this.layout, 'playlist:local', () => {
        this.stateObj().setPlayer('local');
        return this.renderList('local', 'audio');
      });
      this.listenTo(this.layout, 'playlist:clear', () => {
        return this.playlistController(this.stateObj().getPlayer(), this.stateObj().getState('media')).clear();
      });
      this.listenTo(this.layout, 'playlist:refresh', () => {
        this.renderList(this.stateObj().getPlayer(), this.stateObj().getState('media'));
        return App.execute("notification:show", tr('Playlist refreshed'));
      });
      this.listenTo(this.layout, 'playlist:party', () => {
        return this.playerController(this.stateObj().getPlayer(), this.stateObj().getState('media')).setPartyMode('toggle', resp => {
          App.request("state:" + this.stateObj().getPlayer() + ":update");
          return App.execute("notification:show", t.sprintf(tr('%1$s party mode toggled'), this.stateObj().getPlayer()));
        });
      });
      this.listenTo(this.layout, 'playlist:save', () => {
        return App.execute("localplaylist:addentity", 'playlist');
      });

      //# Render the layout
      return App.regionPlaylist.show(this.layout);
    }

    getLayout() {
      return new List.Layout();
    }

    getList(collection) {
      return new List.Items({
        collection});
    }

    renderList(type, media) {
      let collection;
      this.layout.$el.removeClassStartsWith('media-').addClass('media-' + media);
      if (type === 'kodi') {
        //# Get the collection and controller for this list
        collection = App.request("playlist:list", type, media);
        //# When fetched.
        return App.execute("when:entity:fetched", collection, () => {
          //# render to layout.
          const listView = this.getList(collection);
          App.listenTo(listView, "show", () => {
            //# Bind actions
            this.bindActions(listView, type, media);
            //# Trigger content update
            return App.vent.trigger("state:content:updated", type, media);
          });
          return this.layout.kodiPlayList.show(listView);
        });
      } else {
        //# Get the local playlist collection
        collection = App.request("localplayer:get:entities");
        const listView = this.getList(collection);
        App.listenTo(listView, "show", () => {
          //# Bind actions
          this.bindActions(listView, type, media);
          //# Trigger content update
          return App.vent.trigger("state:content:updated", type, media);
        });
        return this.layout.localPlayList.show(listView);
      }
    }

    bindActions(listView, type, media) {
      //# Get the controller for this
      const playlist = this.playlistController(type, media);
      //# Listen to commands
      this.listenTo(listView, "childview:playlist:item:remove", (playlistView, item) => playlist.remove(item.model.get('position')));
      this.listenTo(listView, "childview:playlist:item:play", (playlistView, item) => playlist.playEntity('position', parseInt( item.model.get('position') )));
      return this.initSortable(type, media);
    }

    changePlaylist(player, media) {
      return this.renderList(player, media);
    }

    initSortable(type, media) {
      const $ctx = $('.' + type + '-playlist');
      const playlist = this.playlistController(type, media);
      return $('ul.playlist-items', $ctx).sortable({
        filter: '.row-playing,.row-paused',
        onEnd(e) {
          return playlist.moveItem($(e.item).data('type'), $(e.item).data('id'), e.oldIndex, e.newIndex);
        }
      });
    }

    //# If playing item isn't visible already, scroll to it
    focusPlaying(type, media) {
      if (config.getLocal('playlistFocusPlaying', true)) {
        const $playing = $('.' + type + '-playlist .row-playing');
        if ($playing.length > 0) {
          return $playing.get(0).scrollIntoView();
        }
      }
    }
  };
});
