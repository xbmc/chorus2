// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  //# Shard functionality between composite and layout set views
  //# Template is also shared
  const API = {

    createModel(options = {}) {
      const defaultMenu = {selectall: tr('Toggle select all')};
      const model = _.extend({childViewTag: 'div', ChildViewClass: ''}, options);
      if (!options.noMenuDefault) {
        model.menu = _.isObject(options.menu) ? _.extend(defaultMenu, options.menu) : defaultMenu;
      }
      return new Backbone.Model(model);
    },

    toggleSelectAll($el) {
      const $ctx = $('.set__collection', $el);
      return $('.card, .song', $ctx).toggleClass('selected').each(function(i, d) {
        const $d = $(d);
        const op = $(d).hasClass('selected') ? 'add' : 'remove';
        return App.execute("selected:update:items", op, $d.data('model').toJSON());
      });
    }
  };


  //# A composite set view with a title, actions and collection
  let Cls = (Views.SetCompositeView = class SetCompositeView extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'views/set/set';
      this.prototype.childView = App.Views.CardView;
      this.prototype.tagName = 'div';
      this.prototype.className = "set__wrapper";
      this.prototype.childViewContainer = ".set__collection";
      this.prototype.events = {
        "click .dropdown > i": "populateSetMenu",
        "click .selectall": "toggleSelectAll"
      };
    }

    initialize() {
      return this.createModel();
    }

    // Create a model from options.
    createModel() {
      return this.model = API.createModel(this.options);
    }

    toggleSelectAll() {
      return API.toggleSelectAll(this.$el);
    }
  });
  Cls.initClass();


  //# A set view is a layout view with a title, actions and collection
  return (function() {
    Cls = (Views.SetLayoutView = class SetLayoutView extends App.Views.LayoutView {
      static initClass() {
        this.prototype.template = 'views/set/set';
        this.prototype.tagName = 'div';
        this.prototype.className = "set__wrapper";
        this.prototype.regions =
          {regionCollection: ".set__collection"};
        this.prototype.events = {
          "click .dropdown > i": "populateSetMenu",
          "click .selectall": "toggleSelectAll"
        };
      }

      initialize() {
        return this.createModel();
      }

      // Create a model from options.
      createModel() {
        return this.model = API.createModel(this.options);
      }

      toggleSelectAll() {
        return API.toggleSelectAll(this.$el);
      }
    });
    Cls.initClass();
    return Cls;
  })();
});

