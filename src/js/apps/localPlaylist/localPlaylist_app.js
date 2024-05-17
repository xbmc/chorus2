// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("localPlaylistApp", function(localPlaylistApp, App, Backbone, Marionette, $, _) {

  const Cls = (localPlaylistApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "playlists"       : "list",
        "playlist/:id"   : "list"
      };
    }
  });
  Cls.initClass();


  /*
    Main functionality.
  */

  var API = {

    playlistNameMsg: 'Give your playlist a name',

    //# if no id, find the first list, else id is 0
    list(id) {
      if (id === null) {
        const lists = App.request("localplaylist:entities");
        const items = lists.getRawCollection();
        if (_.isEmpty(lists)) {
          id = 0;
        } else {
          const item = _.min(items, list => list.id);
          ({
            id
          } = item);
          App.navigate(helpers.url.get('playlist', id));
        }
      }
      return new localPlaylistApp.List.Controller({
        id});
    },

    //# Wrapper for adding to a new or existing list.
    addToList(entityType, id) {
      const playlists = App.request("localplaylist:entities");
      if (!playlists || (playlists.length === 0)) {
        return this.createNewList(entityType, id);
      } else {
        const view = new localPlaylistApp.List.SelectionList({
          collection: playlists});
        const $content = view.render().$el;
        //# New list button
        const $new = $('<button>').text( tr('Create a new list') ).addClass('btn btn-primary');
        $new.on('click', () => {
          return _.defer(() => API.createNewList(entityType, id));
        });
        //# Show the list of playlists.
        App.execute("ui:modal:show", tr('Add to playlist'), $content, $new);
        return App.listenTo(view, 'childview:item:selected', (list, item) => {
          return this.addToExistingList(item.model.get('id'), entityType, id);
        });
      }
    },

    //# Add to a known playlist
    addToExistingList(playlistId, entityType, ids) {
      //# Normalise ids is always an array but accepts a single id too
      if (!_.isArray(ids)) {
        ids = [ids];
      }
      if (helpers.global.inArray(entityType, ['albumid', 'artistid', 'songid'])) {
        // Get a custom collection of songs based on type and ids
        return App.request("song:custom:entities", entityType, ids, collection => {
          return this.addCollectionToList(collection, playlistId);
        });
      } else if (entityType === 'playlist') {
        //# Save current audio playlist
        const collection = App.request("playlist:kodi:entities", 'audio');
        return App.execute("when:entity:fetched", collection, () => {
          return this.addCollectionToList(collection, playlistId);
        });
      }
      else {}
    },
        //# TODO: movie/episode.

    //# Add the collection to the list
    addCollectionToList(collection, playlistId, notify = true) {
      App.request("localplaylist:item:add:entities", playlistId, collection);
      App.execute("ui:modal:close");
      if (notify === true) {
        return App.execute("notification:show", tr("Added to your playlist"));
      }
    },

    //# Create a new list
    createNewList(entityType, id) {
      return App.execute("ui:textinput:show", tr('Add a new playlist'), {msg: tr(API.playlistNameMsg)}, text => {
        if (text !== '') {
          const playlistId = App.request("localplaylist:add:entity", text, 'song');
          return this.addToExistingList(playlistId, entityType, id);
        }
      }
      , false);
    },

    //# Create a new empty list.
    createEmptyList() {
      return App.execute("ui:textinput:show", tr('Add a new playlist'), {msg: tr(API.playlistNameMsg)}, text => {
        if (text !== '') {
          const playlistId = App.request("localplaylist:add:entity", text, 'song');
          return App.navigate(`playlist/${playlistId}`, {trigger: true});
        }
    });
    },

    //# Rename a playlist.
    rename(id) {
      const listModel = App.request("localplaylist:entity", id);
      return App.execute("ui:textinput:show", tr('Rename playlist'), {msg: tr(API.playlistNameMsg), defaultVal: listModel.get('name')}, text => {
        listModel.set({name: text}).save();
        return API.list(id);
      });
    }
  };


  /*
    Listeners.
  */

  App.commands.setHandler("localplaylist:addentity", (entityType, id) => API.addToList(entityType, id));

  App.commands.setHandler("localplaylist:newlist", () => API.createEmptyList());

  App.commands.setHandler("localplaylist:reload", id => API.list(id));

  App.commands.setHandler("localplaylist:rename", id => API.rename(id));

  /*
    Init the router
  */

  return App.on("before:start", () => new localPlaylistApp.Router({
    controller: API}));
});
