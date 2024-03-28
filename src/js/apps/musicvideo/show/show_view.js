// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MusicVideoApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  let Cls = (Show.PageLayout = class PageLayout extends App.Views.LayoutWithHeaderView {
    static initClass() {
      this.prototype.className = 'musicvideo-show detail-container';
    }
  });
  Cls.initClass();

  Cls = (Show.HeaderLayout = class HeaderLayout extends App.Views.LayoutDetailsHeaderView {
    static initClass() {
      this.prototype.className = 'musicvideo-details';
    }
  });
  Cls.initClass();

  Cls = (Show.Details = class Details extends App.Views.DetailsItem {
    static initClass() {
      this.prototype.template = 'apps/musicvideo/show/details_meta';
      this.prototype.triggers = {
        "click .play"       : "musicvideo:play",
        "click .add"        : "musicvideo:add",
        "click .download"   : "musicvideo:download",
        "click .localplay"  : "musicvideo:localplay",
        "click .edit"       : "musicvideo:edit"
      };
    }
  });
  Cls.initClass();

  return (Show.DetailTeaser = class DetailTeaser extends App.MusicVideoApp.List.Teaser {
    attributes() {
      return this.watchedAttributes('card-detail');
    }
  });
});
