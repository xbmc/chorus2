// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("EPGApp.List", function(List, App, Backbone, Marionette, $, _) {

  let Cls = (List.Layout = class Layout extends App.Views.LayoutWithSidebarFirstView {
    static initClass() {
      this.prototype.className = "epg-page";
    }
  });
  Cls.initClass();

  Cls = (List.ChannelActions = class ChannelActions extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/epg/list/channel';
      this.prototype.className = 'nav-sub';
      this.prototype.triggers =
        {'click .play'         : 'broadcast:play'};
      this.prototype.events =
        {'click .record'       : 'toggleRecord'};
    }
    toggleRecord() {
      console.log($('.airing'));
      $('.airing').toggleClass('has-timer');
      return this.trigger('broadcast:record', this);
    }
  });
  Cls.initClass();

  Cls = (List.ProgrammeList = class ProgrammeList extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/epg/list/programme';
      this.prototype.tagName = "li";
      this.prototype.className = "pvr-card card";
      this.prototype.triggers =
        {'click .play'         : 'broadcast:play'};
      this.prototype.events = {
        'click .record'       : 'toggleRecord',
        'click .toggle-timer' : 'toggleTimer'
      };
    }
    onRender() {
      //# Add a class to indicate the programme has finished
      if (this.model.attributes.wasactive) { this.$el.addClass("aired"); }
      if (this.model.attributes.isactive) { this.$el.addClass("airing"); }
      if (this.model.attributes.hastimer) { return this.$el.addClass("has-timer"); }
    }
    toggleRecord() {
      this.$el.toggleClass('has-timer');
      return this.trigger('broadcast:record', this);
    }
    toggleTimer() {
      this.$el.toggleClass('has-timer');
      return this.trigger('broadcast:timer', this);
    }
  });
  Cls.initClass();


  return (function() {
    Cls = (List.EPGList = class EPGList extends App.Views.CollectionView {
      static initClass() {
        this.prototype.childView = List.ProgrammeList;
        this.prototype.tagName = "ul";
        this.prototype.className = "programmes";
        this.prototype.emptyView = App.Views.EmptyViewResults;
        this.prototype.emptyViewOptions =
          {emptyKey: 'EPG data'};
      }
      onShow() {
        const $airing = this.$el.find('.airing');
        if ($airing.length) {
          return $(window).scrollTop($airing.offset().top-150);
        }
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
