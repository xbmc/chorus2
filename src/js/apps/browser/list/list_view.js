/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("BrowserApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "browser-page";
    }
  });
  Cls.initClass();


  /*
    Sources
  */

  Cls = (List.Source = class Source extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/browser/list/source';
      this.prototype.tagName = 'li';
      this.prototype.triggers =
        {'click .source' : 'source:open'};
    }
    attributes() {
      return {
        class: 'type-' + this.model.get('sourcetype')
      };
    }
  });
  Cls.initClass();

  //# Our composite view allows adding another view via the 'childViewContainer' el
  //# which is in the template
  Cls = (List.Sources = class Sources extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'apps/browser/list/source_set';
      this.prototype.childView = List.Source;
      this.prototype.tagName = "div";
      this.prototype.childViewContainer = 'ul.sources';
      this.prototype.className = "source-set";
    }
    initialize() {
      //# We need to tell the child view where to get its collection
      return this.collection = this.model.get('sources');
    }
  });
  Cls.initClass();

  Cls = (List.SourcesSet = class SourcesSet extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = List.Sources;
      this.prototype.tagName = "div";
      this.prototype.className = "sources-sets";
    }
  });
  Cls.initClass();


  /*
    Folder
  */

  Cls = (List.FolderLayout = class FolderLayout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/browser/list/folder_layout';
      this.prototype.className = "folder-page-wrapper";
      this.prototype.regions = {
        regionPath: '.path',
        regionFolders: '.folders',
        regionFiles: '.files',
        regionBack: '.back'
      };
      this.prototype.triggers = {
        'click .play' : 'browser:play',
        'click .queue' : 'browser:queue'
      };
      this.prototype.events =
        {'click .sorts li' : 'sortList'};
    }
    sortList(e) {
      $('.sorts li', this.$el).removeClass('active');
      return this.trigger('browser:sort', $(e.target).data('sort'), $(e.target));
    }
    onRender() {
      $('.sorts li', this.$el).addClass('order-' + this.options.sortSettings.order);
      return $('.sorts li[data-sort=' + this.options.sortSettings.method + ']', this.$el).addClass('active');
    }
  });
  Cls.initClass();


  Cls = (List.Item = class Item extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/browser/list/file';
      this.prototype.tagName = 'li';
    }
    initialize() {
    // Parse title text
      return this.model.set({labelHtml: this.formatText(this.model.get('label'))});
    }

    onBeforeRender() {
      if (!this.model.get('labelHtml')) {
        return this.model.set({labelHtml: this.model.escape('label')});
      }
    }
  });
  Cls.initClass();

  Cls = (List.Folder = class Folder extends List.Item {
    static initClass() {
      this.prototype.className = 'folder';
      this.prototype.triggers = {
        'click .title' : 'folder:open',
        'dblclick .title' : 'file:play',
        'click .play' : 'folder:play',
        'click .queue' : 'folder:queue'
      };
      this.prototype.events =
        {"click .dropdown > i": "populateModelMenu"};
    }
    initialize() {
      const menu = {queue: tr('Queue in Kodi')};
      return this.model.set({menu});
    }
  });
  Cls.initClass();

  Cls = (List.EmptyFiles = class EmptyFiles extends App.Views.EmptyViewPage {
    static initClass() {
      this.prototype.tagName = 'li';
    }
    initialize() {
      return this.model.set({id: 'empty', content: t.gettext('no media in this folder')});
    }
  });
  Cls.initClass();

  Cls = (List.File = class File extends List.Item {
    static initClass() {
      this.prototype.className = 'file';
      this.prototype.triggers = {
        'click .play' : 'file:play',
        'dblclick .title' : 'file:play',
        'click .queue' : 'file:queue',
        'click .download' : 'file:download'
      };
      this.prototype.events =
        {"click .dropdown > i": "populateModelMenu"};
    }
    initialize() {
      const menu = {queue: tr('Queue in Kodi')};
      if ((this.model.get('filetype') === 'file') && (this.model.get('file').lastIndexOf('plugin://', 0) !== 0)) {
        menu.download = tr('Download');
      }
      return this.model.set({menu});
    }
  });
  Cls.initClass();


  Cls = (List.FolderList = class FolderList extends App.Views.CollectionView {
    static initClass() {
      this.prototype.tagName = 'ul';
      this.prototype.className = 'browser-folder-list';
      this.prototype.childView = List.Folder;
    }
  });
  Cls.initClass();

  Cls = (List.FileList = class FileList extends App.Views.CollectionView {
    static initClass() {
      this.prototype.tagName = 'ul';
      this.prototype.className = 'browser-file-list';
      this.prototype.childView = List.File;
      this.prototype.emptyView = List.EmptyFiles;
    }
  });
  Cls.initClass();

  /*
    Path
  */

  Cls = (List.Path = class Path extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/browser/list/path';
      this.prototype.tagName = 'li';
      this.prototype.triggers =
        {'click .title' : 'folder:open'};
    }
  });
  Cls.initClass();

  Cls = (List.PathList = class PathList extends App.Views.CollectionView {
    static initClass() {
      this.prototype.tagName = 'ul';
      this.prototype.childView = List.Path;
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Back = class Back extends App.Views.ItemView {
      static initClass() {
        this.prototype.template = 'apps/browser/list/back_button';
        this.prototype.tagName = 'div';
        this.prototype.className = 'back-button';
        this.prototype.triggers = {
          'click .title' : 'folder:open',
          'click i' : 'folder:open'
        };
      }
    });
    Cls.initClass();
    return Cls;
  })();
});

