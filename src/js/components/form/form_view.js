// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Components.Form", function(Form, App, Backbone, Marionette, $, _) {


  //# Full form wrapper
  let Cls = (Form.FormWrapper = class FormWrapper extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = "components/form/form";
      this.prototype.tagName = "form";
  
      this.prototype.regions = {
        formContentRegion: ".form-content-region",
        formResponse:      ".response"
      };
  
      this.prototype.triggers = {
        "click .form-save"                  : "form:submit",
        "click [data-form-button='cancel']" : "form:cancel"
      };
  
      this.prototype.modelEvents = {
        "change:_errors"  : "changeErrors",
        "sync:start"      : "syncStart",
        "sync:stop"       : "syncStop"
      };
    }

    initialize() {
      this.config = this.options.config;
      return this.on("form:save", msg => {
        return this.addSuccessMsg(msg);
      });
    }

    attributes() {
      let attrs = {class: 'component-form'};
      if (this.options.config && this.options.config.attributes) {
        attrs = _.extend(attrs, this.options.config.attributes);
      }
      return attrs;
    }

    onRender() {
      return _.defer(() => {
        if (this.config.focusFirstInput) { this.focusFirstInput(); }
        $('.btn').ripples({color: 'rgba(255,255,255,0.1)'});
        App.vent.trigger("form:onshow", this.config);
        // Bind button triggers
        $('.form-item .form-button', this.$el).on('click', function(e) {
          e.preventDefault();
          if ($(this).data('trigger')) {
            return App.execute($(this).data('trigger'));
          }
        });
        if (this.config.tabs) {
          return this.makeTabs(this.$el);
        }
      });
    }

    focusFirstInput() {
      return this.$(":input:visible:enabled:first").focus();
    }

    changeErrors(model, errors, options) {
      if (this.config.errors) {
        if (_.isEmpty(errors)) { return this.removeErrors(); } else { return this.addErrors(errors); }
      }
    }

    removeErrors() {
      return this.$(".error").removeClass("error").find("small").remove();
    }

    addErrors(errors = {}) {
      return (() => {
        const result = [];
        for (var name in errors) {
          var array = errors[name];
          result.push(this.addError(name, array[0]));
        }
        return result;
      })();
    }

    addError(name, error) {
      const el = this.$(`[name='${name}']`);
      const sm = $("<small>").text(error);
      return el.after(sm).closest(".row").addClass("error");
    }

    addSuccessMsg(msg) {
      const $el = $(".response", this.$el);
      $el.text(msg).show();
      return setTimeout((() => $el.fadeOut()), 5000);
    }

    makeTabs($ctx) {
      const $tabs = $('<ul>').addClass('form-tabs');
      $('.group-title', $ctx).each((i, d) => $('<li>')
      .html($(d).html())
      .click(function(e) {
        $('.group-parent').hide();
        $(d).closest('.group-parent').show();
        $(e.target).closest('.form-tabs').find('li').removeClass('active');
        return $(e.target).addClass('active');}).appendTo($tabs));
      $('.form-groups', $ctx).before($tabs);
      $tabs.find('li').first().trigger('click');
      return $ctx.addClass('with-tabs');
    }
  });
  Cls.initClass();


  //# Form item element - very basic copy of drupals form api format
  Cls = (Form.Item = class Item extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'components/form/form_item';
      this.prototype.tagName = 'div';
    }

    initialize() {
      // Base and base material attributes
      let el;
      const name = this.model.get('name') ? this.model.get('name') : this.model.get('id');
      const baseAttrs = _.extend({id: 'form-edit-' + this.model.get('id'), name, class: ''}, this.model.get('attributes'));
      const materialBaseAttrs = _.extend({}, baseAttrs);
      materialBaseAttrs.class += ' form-control';

      // Escape raw titles.
      if ((this.model.get('titleHtml') == null)) {
        this.model.set('titleHtml', this.model.escape('title'));
      }

      // Create an element based on the type, extending base attrs
      switch (this.model.get('type')) {

        case 'checkbox':
          var attrs = {type: 'checkbox', value: 1, class: 'form-checkbox'};
          if (this.model.get('defaultValue') === true) {
            attrs.checked = 'checked';
          }
          el = this.themeTag('input', _.extend(baseAttrs, attrs), '');
          break;

        case 'textfield': case 'number': case 'date': case 'imageselect':
          var textfields = ['textfield', 'imageselect'];
          var inputType = helpers.global.inArray(this.model.get('type'), textfields) ? 'text' : this.model.get('type');
          attrs = {type: inputType, value: this.model.get('defaultValue')};
          el = this.themeTag('input', _.extend(materialBaseAttrs, attrs), '');
          break;

        case 'hidden':
          attrs = {type: 'hidden', value: this.model.get('defaultValue'), class: 'form-hidden'};
          el = this.themeTag('input', _.extend(baseAttrs, attrs), '');
          break;

        case 'button':
          attrs = {class: 'form-button btn btn-secondary'};
          if (this.model.get('trigger')) {
            attrs['data-trigger'] = this.model.get('trigger');
          }
          el = this.themeTag('button', _.extend(baseAttrs, attrs), this.model.get('value'));
          break;

        case 'textarea':
          el = this.themeTag('textarea', materialBaseAttrs, this.model.get('defaultValue'));
          break;

        case 'markup':
          attrs = {class: 'form-markup'};
          el = this.themeTag('div', attrs, this.model.get('markup'));
          break;

        case 'select':
          var options = '';
          var object = this.model.get('options');
          for (var key in object) {
            var val = object[key];
            attrs = {value: key};
            var value = this.model.get('defaultValue');
            if (String(value) === String(key)) {
              attrs.selected = 'selected';
            }
            options += this.themeTag('option', attrs, val);
          }
          el = this.themeTag('select', _.extend(baseAttrs, {class: 'form-control'}), options);
          break;

        default:
          el = null;
      }

      if (el) {
        return this.model.set({element: el});
      }
    }

    attributes() {
      let elClasses = [];
      const elAttrs = this.model.get('attributes');
      if (elAttrs.class) {
        elClasses = _.map(elAttrs.class.split(' '), c => 'form-item-' + c);
      }
      return {class: 'form-item form-group form-type-' + this.model.get('type') + ' form-edit-' + this.model.get('id') + ' ' + elClasses.join(' ')};
    }

    onRender() {
      return _.defer(() => {
        if (this.model.get('prefix')) {
          this.$el.before(this.model.get('prefix'));
        }
        if (this.model.get('suffix')) {
          return this.$el.after(this.model.get('suffix'));
        }
      });
    }
  });
  Cls.initClass();

  //# Form item list
  Cls = (Form.Group = class Group extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'components/form/form_item_group';
      this.prototype.tagName = 'div';
      this.prototype.childViewContainer = '.form-items';
    }
    // Dynamically assign child view depending on type
    getChildView(item) {
      if (item.get('type') === 'imageselect') {
        return Form.ItemImageSelect;
      } else {
        // Default
        return Form.Item;
      }
    }
    attributes() {
      return {
        class: 'form-group group-parent ' + this.model.get('class')
      };
    }
    initialize() {
      const children = this.model.get('children');
      if (children.length === 0) {
        return this.model.set('title', '');
      } else {
        return this.collection = children;
      }
    }
  });
  Cls.initClass();

  Cls = (Form.Groups = class Groups extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = Form.Group;
      this.prototype.className = 'form-groups';
    }
  });
  Cls.initClass();

  /*
    Custom Widgets that extend Form.Item
  */

  //# Image selector widget (gets assigned in getChildView within Form.Group)
  return (function() {
    Cls = (Form.ItemImageSelect = class ItemImageSelect extends Form.Item {
      static initClass() {
        this.prototype.template = 'components/form/form_item_imageselect';
      }
      //# Add the current image and assign as default
      initialize() {
        super.initialize(...arguments);
        const thumb = App.request("images:path:get", this.model.get('defaultValue'), this.model.get('id'));
        return this.model.set({image: {original: this.model.get('defaultValue'), thumb}});
      }
      //# We wait til render to fetch the external images and build the UI
      onRender() {
        const item = this.model.get('formState');
        const field = this.model.get('id');
        const metadataHandler = this.model.get('metadataImageHandler');
        const metadataLookup = this.model.get('metadataLookupField');
        // els in use.
        const $wrapper = $('.form-imageselect', this.$el);
        const $thumbs = $('.form-imageselect__thumbs', this.$el);
        const $input = $('.form-imageselect__url input', this.$el);
        const $tabs = $('.form-imageselect__tabs', this.$el);
        const $panes = $('.form-imageselect__panes', this.$el);
        // tabs toggle
        $tabs.on('click', 'li', function(e) {
          $tabs.find('li').removeClass('active');
          $(this).addClass('active');
          $panes.find('.pane').removeClass('active');
          return $panes.find('.pane[rel=' + $(this).data('pane') + ']').addClass('active');
        });
        // Load images and allow selection
        $thumbs.on('click', 'li', function(e) {
          $thumbs.find('li').removeClass('selected');
          return $input.val($(this).addClass('selected').data('original'));
        });
        return _.defer(function() {
          if (metadataHandler && metadataLookup && item[metadataLookup]) {
            $wrapper.addClass('images-loading');
            return App.execute(metadataHandler, item[metadataLookup], function(collection) {
              for (var image of collection.where({type: field})) {
                $('<li>').data('original', image.get('url'))
                  .css('background-image', 'url(' + image.get('thumbnail') + ')')
                  .attr('title', image.get('title')).appendTo($thumbs);
              }
              return $wrapper.removeClass('images-loading');
            });
          }
        });
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
