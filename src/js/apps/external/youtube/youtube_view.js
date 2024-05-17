// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ExternalApp.Youtube", function(Youtube, App, Backbone, Marionette, $, _) {

  let Cls = (Youtube.Item = class Item extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/external/youtube/youtube';
      this.prototype.tagName = 'li';
      this.prototype.triggers = {
        'click .play': 'youtube:play',
        'click .localplay': 'youtube:localplay'
      };
      this.prototype.events =
        {'click .action': 'closeModal'};
    }
    closeModal() {
      return App.execute("ui:modal:close");
    }
  });
  Cls.initClass();

  Cls = (Youtube.List = class List extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = Youtube.Item;
      this.prototype.tagName = 'ul';
      this.prototype.className = 'youtube-list';
    }
  });
  Cls.initClass();

  Cls = (Youtube.Card = class Card extends App.Views.CardView {
    static initClass() {
      this.prototype.triggers = {
        'click .play': 'youtube:play',
        'click .localplay': 'youtube:localplay'
      };
    }
    initialize() {
      return this.getMeta();
    }
    getMeta() {
      if (this.model) {
        this.model.set({subtitleHtml: this.themeLink('YouTube', this.model.get('url'), {external: true})});
        if (this.model.get('addonEnabled')) {
          return this.model.set({menu: {localplay: 'Local play'}});
        }
      }
    }
    onRender() {
      return this.makeLinksExternal();
    }
  });
  Cls.initClass();

  return (function() {
    Cls = (Youtube.CardList = class CardList extends App.Views.SetCompositeView {
      static initClass() {
        this.prototype.childView = Youtube.Card;
        this.prototype.className = "section-content card-grid--musicvideo";
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
