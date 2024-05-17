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
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {

  let Cls = (Entities.FormItem = class FormItem extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        id: 0,
        title: '',
        type: '',
        element: '',
        options: [],
        defaultValue: '',
        description: '',
        children: [],
        attributes: {},
        class: '',
        suffix: '',
        prefix: '',
        formState: {}
      };
    }
  });
  Cls.initClass();

  Cls = (Entities.Form = class Form extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.FormItem;
    }
  });
  Cls.initClass();


  var API = {

    applyState(item, formState) {
      item.formState = formState;
      item.defaultValue = item.defaultValue ? item.defaultValue : '';
      // Use 'valueProperty' to override where the value comes from (default is the id of the element)
      const property = item.valueProperty ? item.valueProperty : item.id;
      if (formState[property] != null) {
        item.defaultValue = this.formatDefaultValue(item.format, formState[property]);
        item.defaultsApplied = true;
      }
      return item;
    },

    formatDefaultValue(format, value) {
      if ((format === 'array.string') || (format === 'array.integer')) {
        return value.join('; ');
      } else if ((format === 'integer') && (value !== '')) {
        return parseInt(value);
      } else {
        return value;
      }
    },

    formatSubmittedValues(item, values) {
      if (item.format && (values[item.id] != null)) {
        if (item.format === 'array.string') {
          values[item.id] = values[item.id] !== '' ? _.map(values[item.id].split(';'), v => v.trim()) : [];
        } else if (item.format === 'array.integer') {
          values[item.id] = values[item.id] !== '' ? _.map(values[item.id].split(';'), v => parseInt(v.trim())) : [];
        } else if (item.format === 'integer') {
          values[item.id] = parseInt(values[item.id]);
        } else if (item.format === 'float') {
          values[item.id] = parseFloat(values[item.id]);
        } else if (item.format === 'prevent.submit') {
          delete values[item.id];
        }
      }
      return values;
    },

    processItems(items, formState = {}, isChild = false) {
      const collection = [];
      for (var item of items) {
        item = this.applyState(item, formState);
        if (item.children && (item.children.length > 0)) {
          item.children = API.processItems(item.children, formState, true);
        }
        collection.push(item);
      }
      return collection;
    },

    processSubmitted(items, formState = {}, isChild = false) {
      for (var item of items) {
        formState = this.formatSubmittedValues(item, formState);
        if (item.children && (item.children.length > 0)) {
          formState = API.processSubmitted(item.children.toJSON(), formState, true);
        }
      }
      return formState;
    },

    toCollection(items) {
      for (var i in items) {
        var item = items[i];
        if (item.children && (item.children.length > 0)) {
          var childCollection = new Entities.Form(item.children);
          items[i].children = childCollection;
        }
      }
      return new Entities.Form(items);
    }
  };


  //# Return a collection of form items parsed with the form state
  App.reqres.setHandler("form:item:entities", (form = [], formState = {}) => API.toCollection(API.processItems(form, formState)));

  //# Apply correct formatting to submitted values
  return App.reqres.setHandler("form:value:entities", (form = [], formState = {}) => API.processSubmitted(form, formState));
});
