/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Custom saved playlists, saved in local storage
*/
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  var API = {

    savedFields: [
      'id', 'uid', 'position', 'file', 'type', 'label', 'thumbnail', 'artist', 'album', 'albumid', 'artistid',
      'artistid', 'tvshowid', 'tvshow', 'year', 'rating', 'duration', 'track', 'url', 'season', 'episode', 'title'
    ],

    playlistKey: 'localplaylist:list',
    playlistItemNamespace: 'localplaylist:item:',
    thumbsUpNamespace: 'thumbs:',
    localPlayerNamespace: 'localplayer:',

    getPlaylistKey(key) {
      return this.playlistItemNamespace + key;
    },

    getThumbsKey(media) {
      return this.thumbsUpNamespace + media;
    },

    getlocalPlayerKey(media = 'audio') {
      return this.localPlayerNamespace + media;
    },

    //# Get a collection of lists
    getListCollection(type = 'list') {
      const collection = new Entities.localPlaylistCollection();
      collection.fetch();
      collection.where({type});
      return collection;
    },

    addList(model) {
      const collection = this.getListCollection();
      model.id = this.getNextId();
      collection.create(model);
      return model.id;
    },

    getNextId() {
      let nextId;
      const collection = API.getListCollection();
      const items = collection.getRawCollection();
      if (items.length === 0) {
        nextId = 1;
      } else {
        const lastItem = _.max(items, item => item.id);
        nextId = lastItem.id + 1;
      }
      return nextId;
    },

    //# Get a collection of playlist items.
    getItemCollection(listId) {
      const collection = new Entities.localPlaylistItemCollection([], {key: listId});
      collection.fetch();
      return collection;
    },

    //# Add a collection to a playlist
    addItemsToPlaylist(playlistId, collection) {
      let items;
      if (_.isArray(collection)) {
        items = collection;
      } else {
        items = collection.getRawCollection();
      }
      collection = this.getItemCollection(playlistId);
      let pos = collection.length;
      for (var item of items) {
        collection.create(API.getSavedModelFromSource(item, pos));
        pos++;
      }
      return collection;
    },

    //# Parse a library item into a model structure to save
    getSavedModelFromSource(item, position) {
      const newItem = {};
      for (var fieldName of this.savedFields) {
        if (item[fieldName]) {
          newItem[fieldName] = item[fieldName];
        }
      }
      newItem.position = parseInt(position);

      const idfield = item.type + 'id';
      newItem[idfield] = item[idfield];
      return newItem;
    },

    //# remove all items from a list
    clearPlaylist(playlistId) {
      let model;
      const collection = this.getItemCollection(playlistId);
      while ((model = collection.first())) {
        model.destroy();
      }
    }
  };


  //# The a list reference
  let Cls = (Entities.localPlaylist = class localPlaylist extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        id: 0,
        name: '',
        media: '', //# song / movie / artist / etc.
        type: 'list'
      };
    }
  });
  Cls.initClass(); //# list / thumbsup / local

  //# The a list reference collection
  Cls = (Entities.localPlaylistCollection = class localPlaylistCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.localPlaylist;
      this.prototype.localStorage = new Backbone.LocalStorage(API.playlistKey);
    }
  });
  Cls.initClass();


  //# The saved list item
  Cls = (Entities.localPlaylistItem = class localPlaylistItem extends Entities.Model {
    static initClass() {
      this.prototype.idAttribute = "position";
    }
    defaults() {
      const fields = {};
      for (var f of API.savedFields) {
        fields[f] = '';
      }
      return fields;
    }
  });
  Cls.initClass();

  //# The config collection
  Cls = (Entities.localPlaylistItemCollection = class localPlaylistItemCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.localPlaylistItem;
    }
    initialize(model, options) {
      return this.localStorage = new Backbone.LocalStorage(API.getPlaylistKey(options.key));
    }
  });
  Cls.initClass();


  /*
    Saved Playlists
  */

  //# Handler to save a new playlist
  App.reqres.setHandler("localplaylist:add:entity", (name, media, type = 'list') => API.addList({name, media, type}));

  //# Handler to remove a playlist
  App.commands.setHandler("localplaylist:remove:entity", function(id) {
    const collection = API.getListCollection();
    const model = collection.findWhere({id: parseInt(id)});
    return model.destroy();
  });

  //# Handler to get saved lists
  App.reqres.setHandler("localplaylist:entities", () => API.getListCollection());

  //# Handler to clear all items from a list
  App.commands.setHandler("localplaylist:clear:entities", playlistId => API.clearPlaylist(playlistId));

  //# Handler to get a single saved list
  App.reqres.setHandler("localplaylist:entity", function(id) {
    const collection = API.getListCollection();
    return collection.findWhere({id: parseInt(id)});
});

  //# Handler to get list items
  App.reqres.setHandler("localplaylist:item:entities", playlistId => API.getItemCollection(playlistId));

  //# Handler to add items to a playlist
  App.reqres.setHandler("localplaylist:item:add:entities", (playlistId, collection) => API.addItemsToPlaylist(playlistId, collection));

  //# Handler to update the order of items in the playlist. This will
  //# rebuild the list including only positions found in order.
  App.reqres.setHandler("localplaylist:item:updateorder", function(playlistId, order) {
    const newList = [];
    const collection = API.getItemCollection(playlistId);
    for (var newPos in order) {
      var oldPos = order[newPos];
      var model = collection.findWhere({position: parseInt(oldPos)}).toJSON();
      model.position = newPos;
      model.id = newPos;
      newList.push(model);
    }
    API.clearPlaylist(playlistId);
    return API.addItemsToPlaylist(playlistId, newList);
  });


  /*
    Thumbs up lists
  */

  //# Handler toggle thumbs up on an entity
  App.reqres.setHandler("thumbsup:toggle:entity", function(model) {
    const media = model.get('type');
    const collection = API.getItemCollection(API.getThumbsKey(media));
    const existing = collection.findWhere({id: model.get('id')});
    if (existing) {
      existing.destroy();
    } else {
      collection.create(API.getSavedModelFromSource(model.attributes, model.get('id')));
    }
    return collection;
  });

  //# Handler to get a thumbs up collection
  App.reqres.setHandler("thumbsup:get:entities", media => API.getItemCollection(API.getThumbsKey(media)));

  //# Has a model being thumbed up?
  App.reqres.setHandler("thumbsup:check", function(model) {
    if (model != null) {
      const collection = API.getItemCollection(API.getThumbsKey(model.get('type')));
      const existing = collection.findWhere({id: model.get('id')});
      return _.isObject(existing);
    } else {
      return false;
    }
  });


  /*
    Local player lists
  */

  //# Handler to get a local player playlist collection
  App.reqres.setHandler("localplayer:get:entities", (media = 'audio') => API.getItemCollection(API.getlocalPlayerKey(media)));

  //# Handler to clear all items from a list
  App.commands.setHandler("localplayer:clear:entities", (media = 'audio') => API.clearPlaylist(API.getlocalPlayerKey(media)));

  //# Handler to add items to a playlist
  return App.reqres.setHandler("localplayer:item:add:entities", (collection, media = 'audio') => API.addItemsToPlaylist(API.getlocalPlayerKey(media), collection));
});
