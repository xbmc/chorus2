/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("BrowserApp.List", function(List, App, Backbone, Marionette, $, _) {

  var API = {

    bindFileTriggers(view) {
      App.listenTo(view, 'childview:file:play', (set, item) => {
        const playlist = App.request("command:kodi:controller", item.model.get('player'), 'PlayList');
        return playlist.play('file', item.model.get('file'));
      });
      App.listenTo(view, 'childview:file:queue', (set, item) => {
        const playlist = App.request("command:kodi:controller", item.model.get('player'), 'PlayList');
        return playlist.add('file', item.model.get('file'));
      });
      return App.listenTo(view, 'childview:file:download', (set, item) => {
        return App.request("command:kodi:controller", 'auto', 'Files').downloadFile(item.model.get('file'));
      });
    },

    bindFolderTriggers(view) {
      App.listenTo(view, 'childview:folder:play', (set, item) => {
        return App.request("command:kodi:controller", item.model.get('player'), 'PlayList').play('directory', item.model.get('file'));
      });
      return App.listenTo(view, 'childview:folder:queue', (set, item) => {
        return App.request("command:kodi:controller", item.model.get('player'), 'PlayList').add('directory', item.model.get('file'));
      });
    },

    getFileListView(collection) {
      const fileView = new List.FileList({
        collection});
      API.bindFileTriggers(fileView);
      return fileView;
    },

    getFolderListView(collection) {
      const folderView = new List.FolderList({
        collection});
      App.listenTo(folderView, 'childview:folder:open', (set, item) => {
        return App.navigate(item.model.get('url'), {trigger: true});
    });
      API.bindFolderTriggers(folderView);
      return folderView;
    }
  };



  const Cls = (List.Controller = class Controller extends App.Controllers.Base {
    static initClass() {
  
      this.prototype.sourceCollection = {};
      this.prototype.backButtonModel = {};
    }

    initialize(options = {}) {
      this.layout = this.getLayout();
      this.listenTo(this.layout, "show", () => {
        this.getSources(options);
        return this.getFolderLayout();
      });
      return App.regionContent.show(this.layout);
    }

    getLayout() {
      return new List.ListLayout();
    }

    getFolderLayout() {
      const options = {sortSettings: this.getSort()};
      this.folderLayout = new List.FolderLayout(options);
      this.listenTo(this.folderLayout, 'browser:sort', (sort, $el) => {
        return this.setSort(sort, $el);
      });
      this.listenTo(this.folderLayout, 'browser:play', view => {
        if (this.model) {
          return App.request("command:kodi:controller", this.model.get('player'), 'PlayList').play('directory', this.model.get('file'));
        }
      });
      this.listenTo(this.folderLayout, 'browser:queue', view => {
        if (this.model) {
          return App.request("command:kodi:controller", this.model.get('player'), 'PlayList').add('directory', this.model.get('file'));
        }
      });
      return this.layout.regionContent.show(this.folderLayout);
    }

    setSort(sort, $el) {
      const sortSettings = this.getSort();
      if (sortSettings.method === sort) {
        sortSettings.order = sortSettings.order === 'ascending' ? 'descending' : 'ascending';
      }
      if ($el) {
        $el.removeClassStartsWith('order-').addClass('order-' + sortSettings.order).addClass('active');
      }
      sortSettings.method = sort;
      if (sortSettings.method) {
        config.set('app', 'browserSort', sortSettings);
      }
      if (this.model) {
        return this.getFolder(this.model);
      }
    }

    getSort() {
      return config.get('app', 'browserSort', {method: 'none', order: 'ascending'});
    }


    //# Get the source lists
    getSources(options) {
      const sources = App.request("file:source:entities", 'video');
      return App.execute("when:entity:fetched", sources, () => {
        //# Store the sources collection for later
        this.sourceCollection = sources;
        //# Parse into sets
        const sets = App.request("file:source:media:entities", sources);
        const setView = new List.SourcesSet({collection: sets});
        this.layout.regionSidebarFirst.show(setView);
        this.listenTo(setView, 'childview:childview:source:open', (set, item) => {
          return this.getFolder(item.model);
        });
        return this.loadFromUrl(options);
      });
    }

    loadFromUrl(options) {
      if (options.media && options.id) {
        const model = App.request("file:url:entity", options.media, options.id);
        return this.getFolder(model);
      }
    }

    getFolder(model) {
      this.model = model;
      //# Do a virtual navigate and load up the folder view
      App.navigate(model.get('url'));
      //# Get the collection
      const sortSettings = this.getSort();
      const collection = App.request("file:entities", {file: model.get('file'), media: model.get('media'), sort: sortSettings});
      const pathCollection = App.request("file:path:entities", model.get('file'), this.sourceCollection);
      this.getPathList(pathCollection);
      return App.execute("when:entity:fetched", collection, () => {
        //# parse and render
        const collections = App.request("file:parsed:entities", collection);
        this.getFolderList(collections.directory);
        return this.getFileList(collections.file);
      });
    }

    getFolderListView(collection) {
      const folderView = new List.FolderList({
        collection});
      this.listenTo(folderView, 'childview:folder:open', (set, item) => {
        return this.getFolder(item.model);
      });
      API.bindFolderTriggers(folderView);
      return folderView;
    }

    getFolderList(collection) {
      this.folderLayout.regionFolders.show(this.getFolderListView(collection));
      return this.getBackButton();
    }

    getFileListView(collection) {
      return API.getFileListView(collection);
    }

    getFileList(collection) {
      return this.folderLayout.regionFiles.show(this.getFileListView(collection));
    }

    getPathList(collection) {
      const pathView = new List.PathList({
        collection});
      this.folderLayout.regionPath.show(pathView);
      this.setBackModel(collection);
      return this.listenTo(pathView, 'childview:folder:open', (set, item) => {
        return this.getFolder(item.model);
      });
    }

    setBackModel(pathCollection) {
      // Back button should be the second last model
      if (pathCollection.length >= 2) {
        return this.backButtonModel = pathCollection.models[pathCollection.length - 2];
      } else {
        return this.backButtonModel = {};
      }
    }

    getBackButton() {
      if (this.backButtonModel.attributes) {
        const backView = new List.Back({
          model: this.backButtonModel});
        this.folderLayout.regionBack.show(backView);
        return this.listenTo(backView, 'folder:open', model => {
          return this.getFolder(model.model);
        });
      } else {
        return this.folderLayout.regionBack.empty();
      }
    }

    // Get view with a collection of files only
    getFileViewByPath(path, media, callback) {
      const collection = App.request("file:entities", {file: path, media});
      return App.execute("when:entity:fetched", collection, () => {
        const view = this.getFileListView(collection);
        if (callback) {
          return callback(view);
        }
      });
    }
  });
  Cls.initClass();


  // Get view with a collection of files only
  App.reqres.setHandler("browser:file:view", collection => API.getFileListView(collection));

  // Get view with a collection of files only
  return App.reqres.setHandler("browser:directory:view", collection => API.getFolderListView(collection));
});

