/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PlaylistApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.Layout = class Layout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = "apps/playlist/list/playlist_bar";
      this.prototype.tagName = "div";
      this.prototype.className = "playlist-bar";
      this.prototype.regions = {
        kodiPlayList: '.kodi-playlist',
        localPlayList: '.local-playlist'
      };
      this.prototype.triggers = {
        'click .kodi-playlists .media-toggle .video'  :  'playlist:kodi:video',
        'click .kodi-playlists .media-toggle .audio'  :  'playlist:kodi:audio',
        'click .player-toggle .kodi'                  :  'playlist:kodi',
        'click .player-toggle .local'                 :  'playlist:local',
        'click .clear-playlist'                       :  'playlist:clear',
        'click .refresh-playlist'                     :  'playlist:refresh',
        'click .party-mode'                           :  'playlist:party',
        'click .save-playlist'                        :  'playlist:save'
      };
      this.prototype.events =
        {'click .playlist-menu a': 'menuClick'};
    }
    menuClick(e) {
      return e.preventDefault();
    }
  });
  Cls.initClass();

  Cls = (List.Item = class Item extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = "apps/playlist/list/playlist_item";
      this.prototype.tagName = "li";
      this.prototype.triggers = {
        "click .remove" : "playlist:item:remove",
        "click .play" : "playlist:item:play"
      };
      this.prototype.events =
        {"click .thumbs" : "toggleThumbs"};
    }
    initialize() {
      let subtitle = '';
      switch (this.model.get('type')) {
        case 'song':
          subtitle = this.model.get('artist') ? this.model.get('artist').join(', ') : '';
          break;
        default:
          subtitle = '';
      }
      return this.model.set({subtitle});
    }
    attributes() {
      const classes = ['item', 'pos-' + this.model.get('position'), 'plitem-' + this.model.get('type') + '-' + this.model.get('id')];
      if (this.model.get('canThumbsUp') && App.request('thumbsup:check', this.model)) {
        classes.push('thumbs-up');
      }
      return {
        class: classes.join(' '),
        'data-type': this.model.get('type'),
        'data-id': this.model.get('id'),
        'data-pos': this.model.get('position')
      };
    }
    toggleThumbs() {
      App.request("thumbsup:toggle:entity", this.model);
      this.$el.toggleClass('thumbs-up');
      return $('.item-' + this.model.get('type') + '-' + this.model.get('id')).toggleClass('thumbs-up');
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Items = class Items extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.Item;
        this.prototype.tagName = "ul";
        this.prototype.className = "playlist-items";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});




