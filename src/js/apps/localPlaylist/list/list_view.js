// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("localPlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "local-playlist-list";
    }
  });
  Cls.initClass();

  Cls = (List.SideLayout = class SideLayout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/localPlaylist/list/playlist_sidebar_layout';
      this.prototype.tagName = 'div';
      this.prototype.className = 'side-inner';
      this.prototype.regions =
        {regionLists: '.current-lists'};
      this.prototype.triggers =
        {'click .new-list' : 'lists:new'};
    }
  });
  Cls.initClass();

  Cls = (List.List = class List extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/localPlaylist/list/playlist';
      this.prototype.tagName = "li";
    }
    initialize() {
      const path = helpers.url.get('playlist', this.model.get('id'));
      this.model.set({title: this.model.get('name'), path});
      if (path === helpers.url.path()) {
        return this.model.set({active: true});
      }
    }
  });
  Cls.initClass();

  Cls = (List.Lists = class Lists extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'apps/localPlaylist/list/playlist_list';
      this.prototype.childView = List.List;
      this.prototype.tagName = "div";
      this.prototype.childViewContainer = 'ul.lists';
    }
    onRender() {
      return $('h3', this.$el).text( t.gettext('Playlists') );
    }
  });
  Cls.initClass();

  Cls = (List.Selection = class Selection extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/localPlaylist/list/playlist';
      this.prototype.tagName = "li";
      this.prototype.triggers =
        {'click .item' : 'item:selected'};
    }
    initialize() {
      return this.model.set({title: this.model.get('name')});
    }
  });
  Cls.initClass();

  Cls = (List.SelectionList = class SelectionList extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'apps/localPlaylist/list/playlist_list';
      this.prototype.childView = List.Selection;
      this.prototype.tagName = "div";
      this.prototype.className = 'playlist-selection-list';
      this.prototype.childViewContainer = 'ul.lists';
    }
    onRender() {
      return $('h3', this.$el).text( t.gettext('Existing playlists') );
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Layout = class Layout extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = 'apps/localPlaylist/list/playlist_layout';
        this.prototype.tagName = 'div';
        this.prototype.className = 'local-playlist';
        this.prototype.regions =
          {regionListItems: '.item-container'};
        this.prototype.triggers = {
          'click .local-playlist-header .rename' : 'list:rename',
          'click .local-playlist-header .clear' : 'list:clear',
          'click .local-playlist-header .delete' : 'list:delete',
          'click .local-playlist-header .play' : 'list:play',
          'click .local-playlist-header .localplay' : 'list:localplay',
          'click .local-playlist-header .export' : 'list:export'
        };
      }
      onRender() {
        if (this.options && this.options.list) {
          return $('h2', this.$el).text( this.options.list.get('name') );
        }
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
