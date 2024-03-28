// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("FilterApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  /*
    Base.
  */

  let Cls = (Show.FilterLayout = class FilterLayout extends App.Views.LayoutView {
    static initClass() {
      this.prototype.template = 'apps/filter/show/filters_ui';
      this.prototype.className = "side-bar";
      this.prototype.regions = {
        regionSort: '.sort-options',
        regionFiltersActive: '.filters-active',
        regionFiltersList: '.filters-list',
        regionFiltersOptions: '.filter-options-list',
        regionNavSection: '.nav-section'
      };
      this.prototype.triggers = {
        'click .close-filters' : 'filter:layout:close:filters',
        'click .close-options' : 'filter:layout:close:options',
        'click .open-filters' : 'filter:layout:open:filters'
      };
    }
  });
  Cls.initClass();

  Cls = (Show.ListItem = class ListItem extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/filter/show/list_item';
      this.prototype.tagName = 'li';
    }
  });
  Cls.initClass();

  Cls = (Show.List = class List extends App.Views.CollectionView {
    static initClass() {
      this.prototype.childView = Show.ListItem;
      this.prototype.tagName = "ul";
      this.prototype.className = "selection-list";
    }
  });
  Cls.initClass();


  /*
    Extends.
  */


  //# Sort.

  Cls = (Show.SortListItem = class SortListItem extends Show.ListItem {
    static initClass() {
      this.prototype.triggers =
        {"click .sortable": "filter:sortable:select"};
    }
    initialize() {
      const classes = ['option', 'sortable'];
      if (this.model.get('active') === true) {
        classes.push('active');
      }
      classes.push('order-' + this.model.get('order'));
      const tag = this.themeTag('span', {'class': classes.join(' ')}, t.gettext(this.model.get('alias')));
      return this.model.set({title: tag});
    }
  });
  Cls.initClass();

  Cls = (Show.SortList = class SortList extends Show.List {
    static initClass() {
      this.prototype.childView = Show.SortListItem;
    }
  });
  Cls.initClass();


  //# Filter

  Cls = (Show.FilterListItem = class FilterListItem extends Show.ListItem {
    static initClass() {
      this.prototype.triggers =
        {"click .filterable": "filter:filterable:select"};
    }
    initialize() {
      const classes = ['option', 'option filterable'];
      if (this.model.get('active')) {
        classes.push('active');
      }
      const tag = this.themeTag('span', {'class': classes.join(' ')}, t.gettext(this.model.get('alias')));
      return this.model.set({title: tag});
    }
  });
  Cls.initClass();


  Cls = (Show.FilterList = class FilterList extends Show.List {
    static initClass() {
      this.prototype.childView = Show.FilterListItem;
    }
  });
  Cls.initClass();


  //# Filter option.

  Cls = (Show.OptionListItem = class OptionListItem extends Show.ListItem {
    static initClass() {
      this.prototype.triggers =
        {"click .filterable-option" : "filter:option:select"};
    }
    initialize() {
      const classes = ['option', 'option filterable-option'];
      if (this.model.get('active')) {
        classes.push('active');
      }
      const tag = this.themeTag('span', {'class': classes.join(' ')}, this.model.get('value'));
      return this.model.set({title: tag});
    }
  });
  Cls.initClass();

  Cls = (Show.OptionList = class OptionList extends App.Views.CompositeView {
    static initClass() {
      this.prototype.template = 'apps/filter/show/filter_options';
      this.prototype.activeValues = [];
      this.prototype.childView = Show.OptionListItem;
      this.prototype.childViewContainer = 'ul.selection-list';
      this.prototype.triggers =
        {'click .deselect-all': 'filter:option:deselectall'};
    }
    onRender() {
      //# hide filter search if < 10 items
      if (this.collection.length <= 10) {
        $('.options-search-wrapper', this.$el).addClass('hidden');
      }
      //# Filter options via search box.
      return $('.options-search', this.$el).filterList();
    }
  });
  Cls.initClass();


  //# Active Filters.

  Cls = (Show.ActiveListItem = class ActiveListItem extends Show.ListItem {
    static initClass() {
      this.prototype.triggers =
        {"click .filterable-remove" : "filter:option:remove"};
    }
    initialize() {
      const tooltip = t.gettext('Remove') + ' ' + this.model.escape('key') + ' ' + t.gettext('filter');
      const text = this.themeTag('span', {'class': 'text'}, this.model.get('values').join(', '));
      const tag = this.themeTag('span', {'class': 'filter-btn filterable-remove', title: tooltip}, text);
      return this.model.set({title: tag});
    }
  });
  Cls.initClass();

  Cls = (Show.ActiveNewListItem = class ActiveNewListItem extends Show.ListItem {
    static initClass() {
      this.prototype.triggers =
        {"click .filterable-add" : "filter:add"};
    }
    initialize() {
      const tag = this.themeTag('span', {'class': 'filter-btn filterable-add'}, t.gettext('Add filter'));
      return this.model.set({title: tag});
    }
  });
  Cls.initClass();

  Cls = (Show.ActiveList = class ActiveList extends Show.List {
    static initClass() {
      this.prototype.childView = Show.ActiveListItem;
      this.prototype.emptyView = Show.ActiveNewListItem;
      this.prototype.className = "active-list";
    }
  });
  Cls.initClass();


  //# Filters bar

  return (function() {
    Cls = (Show.FilterBar = class FilterBar extends App.Views.ItemView {
      static initClass() {
        this.prototype.template = 'apps/filter/show/filters_bar';
        this.prototype.className = "filters-active-bar";
        this.prototype.triggers =
          {'click .remove': 'filter:remove:all'};
      }
      onRender() {
        if (this.options.filters) {
          return $('.filters-active-all', this.$el).text( this.options.filters.join(', ') );
        }
      }
    });
    Cls.initClass();
    return Cls;
  })();
});
