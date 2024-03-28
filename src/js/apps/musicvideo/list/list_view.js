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
this.Kodi.module("MusicVideoApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.ListLayout = class ListLayout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "musicvideo-list with-filters";
    }
  });
  Cls.initClass();

  Cls = (List.Teaser = class Teaser extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        "click .play"           : "musicvideo:play",
        "click .add"            : "musicvideo:add",
        'click .stream'         : 'musicvideo:localplay',
        'click .download'       : 'musicvideo:download',
        'click .edit'           : 'musicvideo:edit',
        'click .refresh'        : 'musicvideo:refresh'
      };
    }
    initialize() {
      super.initialize(...arguments);
      if (this.model != null) {
        this.setMeta();
        return this.model.set(App.request('musicvideo:action:items'));
      }
    }
    setMeta() {
      if (this.model) {
        const artist = this.model.get('artist') !== '' ? this.model.get('artist') : '&nbsp;';
        return this.model.set({subtitleHtml: this.themeLink(this.model.get('artist'), 'search/artist/' + artist)});
      }
    }
  });
  Cls.initClass();

  Cls = (List.Empty = class Empty extends App.Views.EmptyViewResults {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.className = "musicvideo-empty-result";
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.Videos = class Videos extends App.Views.VirtualListView {
      static initClass() {
        this.prototype.childView = List.Teaser;
        this.prototype.emptyView = List.Empty;
        this.prototype.tagName = "ul";
        this.prototype.className = "card-grid--musicvideo";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
