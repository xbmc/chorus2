// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PVR.RecordingList", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "pvr-page";
    }
  });
  Cls.initClass();

  Cls = (List.RecordingTeaser = class RecordingTeaser extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/pvr/recordingList/recording';
      this.prototype.tagName = "li";
      this.prototype.className = 'pvr-card card';
      this.prototype.triggers =
        {"click .play"       : "recording:play"};
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.RecordingList = class RecordingList extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.RecordingTeaser;
        this.prototype.tagName = "ul";
        this.prototype.className = "recordings";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
