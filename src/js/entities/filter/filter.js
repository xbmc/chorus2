// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {


  //# Filter entity.

  let Cls = (Entities.Filter = class Filter extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        alias: '',
        type: 'string',
        key: '',
        sortOrder: 'asc',
        title: '',
        active: false
      };
    }
  });
  Cls.initClass();

  Cls = (Entities.FilterCollection = class FilterCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.Filter;
    }
  });
  Cls.initClass();


  Cls = (Entities.FilterOption = class FilterOption extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        key: '',
        value: '',
        title: ''
      };
    }
  });
  Cls.initClass();

  Cls = (Entities.FilterOptionCollection = class FilterOptionCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.Filter;
    }
  });
  Cls.initClass();


  //# Sort entity.

  Cls = (Entities.FilterSort = class FilterSort extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        alias: '',
        type: 'string',
        defaultSort: false,
        defaultOrder: 'asc',
        key: '',
        active: false,
        order: 'asc',
        title: ''
      };
    }
  });
  Cls.initClass();

  Cls = (Entities.FilterSortCollection = class FilterSortCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.FilterSort;
    }
  });
  Cls.initClass();


  //# Sort entity.

  Cls = (Entities.FilterActive = class FilterActive extends Entities.Model {
    static initClass() {
      this.prototype.defaults = {
        key: '',
        values: [],
        title: ''
      };
    }
  });
  Cls.initClass();

  Cls = (Entities.FilterActiveCollection = class FilterActiveCollection extends Entities.Collection {
    static initClass() {
      this.prototype.model = Entities.FilterActive;
    }
  });
  Cls.initClass();


  //# Requests.

  App.reqres.setHandler('filter:filters:entities', collection => new Entities.FilterCollection(collection));

  App.reqres.setHandler('filter:filters:options:entities', collection => new Entities.FilterOptionCollection(collection));

  App.reqres.setHandler('filter:sort:entities', collection => new Entities.FilterSortCollection(collection));

  return App.reqres.setHandler('filter:active:entities', collection => new Entities.FilterActiveCollection(collection));
});
