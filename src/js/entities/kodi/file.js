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
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
  */

  var API = {

    fields: {
      minimal: ['title', 'file', 'mimetype'],
      small: ['thumbnail', 'dateadded'],
      full: ['fanart', 'streamdetails']
    },
    addonFields: ['path', 'name'],

    sources: [
      {media: 'video', label: 'Video', type: 'source', provides: 'video'},
      {media: 'music', label: 'Music', type: 'source', provides: 'audio'},
      {media: 'music', label: 'Audio add-ons', type: 'addon', provides: 'audio', addonType: 'xbmc.addon.audio', content: 'unknown'},
      {media: 'video', label: 'Video add-ons', type: 'addon', provides: 'files', addonType: 'xbmc.addon.video', content: 'unknown'}
    ],

    directorySeparator: '/',

    //# Fetch a single entity
    getEntity(id, options) {
      const entity = new App.KodiEntities.File();
      entity.set({file: id, properties:  helpers.entities.getFields(API.fields, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an entity collection.
    getCollection(type, options) {
      let collection;
      const defaultOptions = {cache: true, useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      if (type === 'sources') {
        collection = new KodiEntities.SourceCollection();
      } else {
        collection = new KodiEntities.FileCollection();
      }
      collection.fetch(options);
      return collection;
    },

    //# Split a collection into files and folders
    parseToFilesAndFolders(collection) {
      const all = collection.getRawCollection();
      const collections = {};
      collections.file = new KodiEntities.FileCustomCollection(_.where(all, {filetype: 'file'}));
      collections.directory = new KodiEntities.FileCustomCollection(_.where(all, {filetype: 'directory'}));
      return collections;
    },

    //# Get a source media types, we don't use backbone.rpc because it's multiple
    //# calls seem really flaky on collections as it is geared towards models.
    //# This allows better parsing anyway as we can add the media to each model.
    //# We also parse in available addon sources.
    getSources() {
      let source;
      const commander = App.request("command:kodi:controller", 'auto', 'Commander');
      const commands = [];
      let collection = new KodiEntities.SourceCollection();
      for (source of this.sources) {
        if (source.type === 'source') {
          commands.push({method: 'Files.GetSources', params: [source.media]});
        }
        if (source.type === 'addon') {
          commands.push({method: 'Addons.GetAddons', params: [source.addonType, source.content, true, this.addonFields]});
        }
      }
      //# Parse the source response and create a collection
      commander.multipleCommands(commands, resp => {
        for (var i in resp) {
          var item = resp[i];
          source = this.sources[i];
          var responseKey = source.type + 's';
          if (item[responseKey]) {
            for (var model of item[responseKey]) {
              model.media = source.media;
              model.sourcetype = source.type;
              if (source.type === 'addon') {
                model.file = this.createAddonFile(model);
                model.label = model.name;
              }
              model.url = this.createFileUrl(source.media, model.file);
              collection.add(model);
            }
          }
        }
        collection = this.addPlaylists(collection);
        return collection.trigger('cachesync');
      });
      return collection;
    },

    //# Turn the full source collection into collection sets.
    parseSourceCollection(collection) {
      const all = collection.getRawCollection();
      collection = [];
      for (var source of this.sources) {
        var items = _.where(all, {media: source.media});
        if ((items.length > 0) && (source.type === 'source')) {
          source.sources = new KodiEntities.SourceCollection(items);
          source.url = 'browser/' + source.media;
          collection.push(source);
        }
      }
      return new KodiEntities.SourceSetCollection(collection);
    },

    //# Create a url for this file/folder
    createFileUrl(media, file) {
      return 'browser/' + media + '/' + encodeURIComponent(file);
    },

    //# Create a url for an addon
    createAddonFile(addon) {
      return 'plugin://' + addon.addonid + this.directorySeparator;
    },

    //# Parse files for extra data
    parseFiles(items, media) {
      for (var i in items) {
        var item = items[i];
        if (!item.parsed) {
          item = App.request("images:path:entity", item);
          items[i] = this.correctFileType(item);
          items[i].media = media;
          items[i].player = this.getPlayer(media);
          items[i].url = this.createFileUrl(media, item.file);
          items[i].parsed = true;
          items[i].defaultSort = parseInt(i);
          items[i].label = helpers.global.removeBBCode(item.label);
        }
      }
      return items;
    },

    //# Add music and video playlist sources.
    addPlaylists(collection) {
      const types = ['video', 'music'];
      for (var type of types) {
        var model = this.createPathModel(type, t.gettext('Playlists'), 'special://profile/playlists/' + type);
        model.sourcetype = 'playlist';
        collection.add(model);
      }
      return collection;
    },

    //# The damn kodi api is returning folders with a filetype of 'file' !!??!
    //# So we do some extra checking and parsing to correct the filetype.
    //# TODO: follow up with montelese and topfs
    correctFileType(item) {
      const directoryMimeTypes = ['x-directory/normal'];
      if (item.mimetype && helpers.global.inArray(item.mimetype, directoryMimeTypes)) {
        item.filetype = 'directory';
      }
      return item;
    },

    //# Parse a path and attempt to make a collection from it
    createPathCollection(file, sourcesCollection) {
      const items = [];
      let parentSource = {};
      const allSources = sourcesCollection.getRawCollection();
      for (var source of allSources) {
        if (parentSource.file) { //# only match on the first found
          continue;
        }
        if (helpers.global.stringStartsWith(source.file, file)) {
          parentSource = source;
        }
      }
      if (parentSource.file) {
        items.push(parentSource);
        let basePath = parentSource.file;
        const pathParts = helpers.global.stringStripStartsWith(parentSource.file, file).split(this.directorySeparator);
        const excludedPaths = App.request("addon:excludedPaths", parentSource.addonid);
        for (var part of pathParts) {
          if (part !== '') {
            basePath += part + this.directorySeparator;
            if (excludedPaths.indexOf(basePath) === -1) { //# Don't add excluded paths
              items.push(this.createPathModel(parentSource.media, part, basePath));
            }
          }
        }
      }
      return new KodiEntities.FileCustomCollection(items);
    },

    //# Create a model structure for a virtual path entity.
    createPathModel(media, label, file) {
      const model = {
        label,
        file,
        media,
        url: this.createFileUrl(media, file)
      };
      return model;
    },

    //# fix the naming discrepancy between files and the rest of the app :(
    getPlayer(media) {
      if (media === 'music') {
        'audio';
      }
      return media;
    }
  };


  /*
   Models and collections.
  */

  //# Single File model.
  let Cls = (KodiEntities.EmptyFile = class EmptyFile extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.idAttribute = "file";
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {filetype: 'directory', media: '', label: '', url: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
  });
  Cls.initClass();

  //# Single File model.
  Cls = (KodiEntities.File = class File extends KodiEntities.EmptyFile {
    static initClass() {
      this.prototype.methods = {read: ['Files.GetFileDetails', 'file', 'properties']};
    }
    parse(resp, xhr) {
      const obj = (resp.filedetails != null) ? resp.filedetails : resp;
      if (resp.filedetails != null) {
        obj.fullyloaded = true;
      }
      return obj;
    }
  });
  Cls.initClass();

  //# Files collection
  Cls = (KodiEntities.FileCollection = class FileCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.File;
      this.prototype.methods = {read: ['Files.GetDirectory', 'directory', 'media', 'properties', 'sort']};
    }
    args() { return this.getArgs({
      directory: this.argCheckOption('file', ''),
      media: this.argCheckOption('media', ''),
      properties: this.argFields(helpers.entities.getFields(API.fields, 'small')),
      sort: this.argSort('none', 'ascending')
    }); }
    parse(resp, xhr) {
      const items = this.getResult(resp, 'files');
      return API.parseFiles(items, this.options.media);
    }
  });
  Cls.initClass();


  //# Files custom collection (for splitting into files and folders)
  Cls = (KodiEntities.FileCustomCollection = class FileCustomCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.File;
    }
  });
  Cls.initClass();

  //# Sources model.
  Cls = (KodiEntities.Source = class Source extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.idAttribute = "file";
      this.prototype.defaults = {
        label: '',
        file: '',
        media: '',
        url: ''
      };
    }
  });
  Cls.initClass();

  //# Files collection
  Cls = (KodiEntities.SourceCollection = class SourceCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Source;
    }
  });
  Cls.initClass();


  //# Sources set model.
  Cls = (KodiEntities.SourceSet = class SourceSet extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.idAttribute = "file";
      this.prototype.defaults = {
        label: '',
        sources: ''
      };
    }
  });
  Cls.initClass();

  //# Files collection
  Cls = (KodiEntities.SourceSetCollection = class SourceSetCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Source;
    }
  });
  Cls.initClass();


  /*
   Request Handlers.
  */

  // Get a single file
  App.reqres.setHandler("file:entity", (id, options = {}) => API.getEntity(id, options));

  // Create a new file entity with info extracted from the url
  App.reqres.setHandler("file:url:entity", function(media, hash) {
    const file = decodeURIComponent(hash);
    return new KodiEntities.EmptyFile({media, file, url: API.createFileUrl(media, file)});
});

  //# Get an file collection
  App.reqres.setHandler("file:entities", (options = {}) => API.getCollection('files', options));

  // Get a path collection, requires a sources collection
  App.reqres.setHandler("file:path:entities", (file, sourceCollection) => API.createPathCollection(file, sourceCollection));

  //# Get an file/directory collection
  App.reqres.setHandler("file:parsed:entities", collection => API.parseToFilesAndFolders(collection));

  //# Get all sources.
  App.reqres.setHandler("file:source:entities", media => API.getSources());

  //# Create a new source sub collection sources.
  App.reqres.setHandler("file:source:media:entities", collection => API.parseSourceCollection(collection));

  //# Get a source media types
  return App.reqres.setHandler("file:source:mediatypes", () => API.availableSources);
});
