/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SongApp.List", function(List, App, Backbone, Marionette, $, _) {

  //# Single song row
  let Cls = (List.Song = class Song extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/song/list/song';
      this.prototype.tagName = "tr";
  
      this.prototype.triggers = {
        "click .play"            : "song:play",
        "dblclick .song-title"   : "song:play",
        "click .add"             : "song:add",
        "click .song-localadd"   : "song:localadd",
        "click .song-download"   : "song:download",
        "click .song-localplay"  : "song:localplay",
        "click .song-musicvideo" : "song:musicvideo",
        "click .song-remove"     : "song:remove",
        "click .song-edit"            : "song:edit"
      };
  
      this.prototype.events = {
        "click .dropdown > i": "populateModelMenu",
        "click .thumbs" : "toggleThumbs",
        "click": "toggleSelect"
      };
  
      //# This triggers a re-render on model update
      this.prototype.modelEvents =
        {'change': 'render'};
    }
    initialize() {
      super.initialize(...arguments);
      if (this.model) {
        const duration = helpers.global.secToTime(this.model.get('duration'));
        const menu = {
          'song-localadd': 'Add to playlist',
          'song-download': 'Download song',
          'song-localplay': 'Play in browser',
          'song-musicvideo': 'Music video',
          'divider' : '',
          'song-edit': 'Edit'
        };
        return this.model.set({displayDuration: helpers.global.formatTime(duration), menu});
      }
    }

    toggleThumbs() {
      App.request("thumbsup:toggle:entity", this.model);
      this.$el.toggleClass('thumbs-up');
      return $('.plitem-' + this.model.get('type') + '-' + this.model.get('id')).toggleClass('thumbs-up');
    }

    attributes() {
      if (this.model) {
        const classes = ['song', 'table-row', 'can-play', 'item-' + this.model.get('uid')];
        if (App.request("thumbsup:check", this.model)) {
          classes.push('thumbs-up');
        }
        return {
          'class': classes.join(' '),
          'data-id': this.model.id
        };
      }
    }

    onShow() {
      return this.menuBlur();
    }

    onRender() {
      return this.$el.data('model', this.model);
    }
  });
  Cls.initClass();


  //# Song list
  return (function() {
    Cls = (List.Songs = class Songs extends App.Views.VirtualListView {
      static initClass() {
        this.prototype.childView = List.Song;
        this.prototype.placeHolderViewName = 'SongViewPlaceholder';
        this.prototype.cardSelector = '.song';
        this.prototype.preload = 40;
        this.prototype.tagName = "table";
      }
      attributes() {
        const verbose = this.options.verbose ? 'verbose' : 'basic';
        return {
          class: 'songs-table table table-hover ' + verbose
        };
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
