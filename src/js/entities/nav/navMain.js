// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  const API = {

    localKey: 'mainNav',

    getItems() {
      const navCollection = this.getLocalCollection();
      let items = navCollection.getRawCollection();
      if (items.length === 0) {
        items = this.getDefaultItems();
      }
      return items;
    },

    getDefaultItems(onlyVisible = true){
      const nav = [];

      //# Music.
      nav.push({id: 1, title: tr("Music"), path: 'music', icon: 'mdi-av-my-library-music', classes: 'nav-music', parent: 0});
      nav.push({id: 2, title: tr("Music"), path: 'music', icon: '', classes: '', parent: 1});
      nav.push({id: 6, title: tr("Genres"), path: 'music/genres', icon: '', classes: '', parent: 1});
      nav.push({id: 7, title: tr("Top music"), path: 'music/top', icon: '', classes: '', parent: 1});
      nav.push({id: 3, title: tr("Artists"), path: 'music/artists', icon: '', classes: '', parent: 1});
      nav.push({id: 4, title: tr("Albums"), path: 'music/albums', icon: '', classes: '', parent: 1});
      nav.push({id: 8, title: tr("Videos"), path: 'music/videos', icon: '', classes: '', parent: 1});

      //# Movies.
      nav.push({id: 11, title: tr("Movies"), path: 'movies/recent', icon: 'mdi-av-movie', classes: 'nav-movies', parent: 0});
      nav.push({id: 12, title: tr("Movies"), path: 'movies/recent', icon: '', classes: '', parent: 11});
      nav.push({id: 13, title: tr("All movies"), path: 'movies', icon: '', classes: '', parent: 11});

      //# TV.
      nav.push({id: 21, title: tr("TV shows"), path: 'tvshows/recent', icon: 'mdi-hardware-tv', classes: 'nav-tv', parent: 0});
      nav.push({id: 22, title: tr("TV shows"), path: 'tvshows/recent', icon: '', classes: '', parent: 21});
      nav.push({id: 23, title: tr("All TV shows"), path: 'tvshows', icon: '', classes: '', parent: 21});

      //# Browser.
      nav.push({id: 31, title: tr("Browser"), path: 'browser', icon: 'mdi-action-view-list', classes: 'nav-browser', parent: 0});

      //# PVR
      nav.push({id: 81, title: tr("PVR"), path: 'pvr/tv', icon: 'mdi-action-settings-input-antenna', classes: 'pvr-link', parent: 0, visibility: "addon:pvr:enabled"});
      nav.push({id: 82, title: tr("TV Channels"), path: 'pvr/tv', icon: '', classes: '', parent: 81});
      nav.push({id: 83, title: tr("Radio Stations"), path: 'pvr/radio', icon: '', classes: '', parent: 81});
      nav.push({id: 84, title: tr("Recordings"), path: 'pvr/recordings', icon: '', classes: '', parent: 81});

      //# Addons
      nav.push({id: 71, title: tr("Add-ons"), path: 'addons/all', icon: 'mdi-action-extension', classes: 'nav-addons', parent: 0});
      nav.push({id: 72, title: tr("all"), path: 'addons/all', icon: '', classes: '', parent: 71});
      nav.push({id: 73, title: tr("video"), path: 'addons/video', icon: '', classes: '', parent: 71});
      nav.push({id: 74, title: tr("audio"), path: 'addons/audio', icon: '', classes: '', parent: 71});
      // Placeholder for pictures (75)
      nav.push({id: 76, title: tr("executable"), path: 'addons/executable', icon: '', classes: '', parent: 71});
      nav.push({id: 77, title: tr("settings"), path: 'settings/addons', icon: '', classes: '', parent: 71});

      //# Thumbs up.
      nav.push({id: 41, title: tr("Thumbs up"), path: 'thumbsup', icon: 'mdi-action-thumb-up', classes: 'nav-thumbs-up', parent: 0});

      //# Playlists.
      nav.push({id: 42, title: tr("Playlists"), path: 'playlists', icon: 'mdi-action-assignment', classes: 'playlists', parent: 0});

      //# Settings.
      nav.push({id: 51, title: tr("Settings"), path: 'settings/web', icon: 'mdi-action-settings', classes: 'nav-settings', parent: 0});
      nav.push({id: 52, title: tr("Web interface"), path: 'settings/web', icon: '', classes: '', parent: 51});
      nav.push({id: 54, title: tr("Main Menu"), path: 'settings/nav', icon: '', classes: '', parent: 51});
      nav.push({id: 53, title: tr("Add-ons"), path: 'settings/addons', icon: '', classes: '', parent: 51});
      nav.push({id: 55, title: tr("Search"), path: 'settings/search', icon: '', classes: '', parent: 51});


      //# Help
      nav.push({id: 61, title: tr("Help"), path: 'help', icon: 'mdi-action-help', classes: 'nav-help', parent: 0});

      //# Return only visible or all
      if (onlyVisible) {
        return this.checkVisibility(nav);
      } else {
        return nav;
      }
    },

    //# Nav items can have a visibility property, if this is set, the request handler
    //# is called for that value which should return true or false depending if that
    //# item is visible.  e.g. pvr links check if pvr is enabled.
    checkVisibility(items) {
      const newItems = [];
      for (var item of items) {
        if (item.visibility != null) {
          if (App.request(item.visibility)) {
            newItems.push(item);
          }
        } else {
          newItems.push(item);
        }
      }
      return newItems;
    },

    //# Get a collection from local storage.
    getLocalCollection() {
      const collection = new Entities.LocalNavMainCollection([], {key: this.localKey});
      collection.fetch();
      return collection;
    },

    //# Get a full standard structure
    getStructure() {
      const navParsed = this.sortStructure(this.getItems());
      const navCollection = new Entities.NavMainCollection(navParsed);
      return navCollection;
    },

    //# Get only child items from a given parent
    getChildStructure(parentId) {
      const nav = this.getDefaultItems(false);
      const parent = _.findWhere(nav, {id: parentId});
      const childItems = _.where(nav, {parent: parentId});
      parent.items = new Entities.NavMainCollection(childItems);
      return new Entities.NavMain(parent);
    },

    //# Sort the structure into a hierarchy.
    sortStructure(structure) {
      let model;
      const children = {};
      //# Parse the children from via the parent.
      for (model of structure) {
        //# Translate the titles while we are here
        if ((model.path != null) && (model.parent !== 0)) {
          model.title = t.gettext( model.title );
          //# Parse into children
          if (children[model.parent] == null) { children[model.parent] = []; }
          children[model.parent].push(model);
        }
      }
      //# Add the parsed children to the parents.
      const newParents = [];
      for (var i in structure) {
        model = structure[i];
        if (model.path != null) {
          if (model.parent === 0) {
            model.children = children[model.id];
            newParents.push(model);
          }
        }
      }
      return newParents;
    },

    // Returns the ID for the given path (no hash)
    getIdfromPath(path) {
      const model = _.findWhere(this.getDefaultItems(), {path});
      if (model != null) { return model.id; } else { return 1; }
    },

    // Save current form to local storage collection
    saveLocal(items) {
      const collection = this.clearLocal();
      for (var i in items) {
        var item = items[i];
        collection.create(item);
      }
      return collection;
    },

    //# remove all items from a list
    clearLocal() {
      let model;
      const collection = this.getLocalCollection();
      while ((model = collection.first())) {
        model.destroy();
      }
      return collection;
    }
  };


  //# NavMain model
  let Cls = (Entities.NavMain = class NavMain extends App.Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        id: 0,
        title: 'Untitled',
        path: '',
        description: '',
        icon: '',
        classes: '',
        parent: 0,
        children: []
      };
    }
  });
  Cls.initClass();

  //# NavMain collection
  Cls = (Entities.NavMainCollection = class NavMainCollection extends App.Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.NavMain;
    }
  });
  Cls.initClass();

  //# NavMain local storage collection
  Cls = (Entities.LocalNavMainCollection = class LocalNavMainCollection extends App.Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.NavMain;
      this.prototype.localStorage = new Backbone.LocalStorage(API.localKey);
    }
  });
  Cls.initClass();


  //# Handler to return the collection, parent is path to parent.
  App.reqres.setHandler("navMain:entities", function(parent = 'all') {
    if (parent === 'all') {
      return API.getStructure();
    } else {
      const parentId = API.getIdfromPath(parent);
      return API.getChildStructure(parentId);
    }
  });

  //# Turn an array of link objects into a collection.
  App.reqres.setHandler("navMain:array:entities", function(items) {
    // Auto populate ids from paths
    for (var i in items) {
      var item = items[i];
      items[i].id = item.path;
    }
    return new Entities.NavMainCollection(items);
  });

  //# Update mainNav local storage entities
  App.reqres.setHandler("navMain:update:entities", items => API.saveLocal(items));

  //# Update mainNav local storage entities
  return App.reqres.setHandler("navMain:update:defaults", items => API.clearLocal());
});
