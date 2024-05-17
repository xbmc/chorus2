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
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  let Cls = (Views.CardView = class CardView extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = "views/card/card";
      this.prototype.tagName = "li";
  
      this.prototype.events = {
        "click .dropdown > i": "populateModelMenu",
        "click .thumbs" : "toggleThumbs",
        "click" : "toggleSelect"
      };
  
      this.prototype.modelEvents =
        {'change': 'modelChange'};
    }

    toggleThumbs() {
      App.request("thumbsup:toggle:entity", this.model);
      return this.$el.toggleClass('thumbs-up');
    }

    attributes() {
      const classes = ['card', 'card-loaded'];
      if (App.request("thumbsup:check", this.model)) {
        classes.push('thumbs-up');
      }
      return {
        class: classes.join(' ')
      };
    }

    onBeforeRender() {
      if ((this.model.get('labelHtml') == null)) {
        this.model.set('labelHtml', this.model.escape('label'));
      }
      if ((this.model.get('subtitleHtml') == null)) {
        return this.model.set('subtitleHtml', this.model.escape('subtitle'));
      }
    }

    onRender() {
      return this.$el.data('model', this.model);
    }

    onShow() {
      return $('.dropdown', this.$el).on('click', function() {
        return $(this).removeClass('open').trigger('hide.bs.dropdown');
      });
    }

    //# Make the links external
    makeLinksExternal() {
      return $('.title, .thumb', this.$el).attr('href', this.model.get('url')).attr('target', '_blank');
    }

    //# This triggers when a model has been updated, instances can add updates to setMeta()
    //# so init is not used (which doesn't get called on a re-render)
    modelChange() {
      if (_.isFunction(this.setMeta)) {
        this.setMeta();
      }
      return this.render();
    }
  });
  Cls.initClass();


  return (function() {
    Cls = (Views.CardViewPlaceholder = class CardViewPlaceholder extends App.Views.ItemView {
      static initClass() {
        this.prototype.template = "views/card/card_placeholder";
      }
      attributes() {
        return {
          class: 'card ph'
        };
      }
      onRender() {
        return this.$el.data('model', this.model);
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
