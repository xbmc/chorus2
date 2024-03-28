/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("PVR.ChannelList", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "pvr-page";
    }
  });
  Cls.initClass();

  Cls = (List.ChannelTeaser = class ChannelTeaser extends App.Views.CardView {
    static initClass() {
      this.prototype.tagName = "li";
      this.prototype.triggers = {
        "click .play"       : "channel:play",
        "click .record"     : "channel:record"
      };
    }
    initialize() {
      super.initialize(...arguments);
      if (this.model != null) {
        return this.model.set({subtitle: this.model.get('broadcastnow').title});
      }
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (List.ChannelList = class ChannelList extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.ChannelTeaser;
        this.prototype.tagName = "ul";
        this.prototype.className = "card-grid--square";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
