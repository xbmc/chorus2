/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp.Show.navMain", function(NavMain, App, Backbone, Marionette, $, _) {

  //# There is a lot of jQuery'ing happening in this file, if you require the same functionality
  //# again (draggable lists) you should abstract it in a nicer way
  return NavMain.Controller = class Controller extends App.SettingsApp.Show.Base.Controller {

    // Callback gets passed the collection to process
    constructor(...args) {
      super(...args);
      this.onReady = this.onReady.bind(this);
    }

    getCollection(callback) {
      const collection = App.request('navMain:entities');
      return $.getJSON('lib/icons/mdi.json', iconList => callback({
        collection,
        icons: iconList
      }));
    }

    // Passed the collection and returns form structure
    getStructure(data) {
      this.data = data;
      // Form header/intro
      const defaults = ' <a class="nav-restore-defaults">' + t.gettext('Click here restore defaults') + '</a>';
      const iconLink = '<a href="#lab/icon-browser">icons</a>';
      const form = [{
        title: t.gettext('Main Menu Structure'),
        id: 'intro',
        children: [{
          id: 'intro-text',
          type: 'markup',
          markup: t.sprintf(tr('Here you can change the title, url and %1$s for menu items. You can also remove, re-order and add new items.'), iconLink) + defaults
        }
        ]
      }
      ];
      // Return a form structure
      const object = data.collection.getRawCollection();
      for (var i in object) {
        var item = object[i];
        item.weight = i;
        var row = this.getRow(item, data.icons);
        form.push(row);
      }
      form.push({
        id: 'add-another',
        class: 'add-another-wrapper',
        children: [
          {type: 'button', value: 'Add another', id: 'add-another'}
        ]
      });
      return form;
    }

    // Save only changed values
    saveCallback(formState, formView) {
      // Parse the elements into items
      const items = [];
      for (var i in formState.title) {
        var item = formState.title[i];
        items.push({
          title: formState.title[i],
          path: formState.path[i],
          icon: formState.icon[i],
          weight: formState.weight[i],
          id: formState.id[i],
          parent: 0
        });
      }
      // Save items, refresh page and show notification
      App.request("navMain:update:entities", items);
      App.vent.trigger("navMain:refresh");
      return Kodi.execute("notification:show", t.gettext('Menu updated'));
    }

    // The form has been rendered
    onReady() {
      const self = this;
      const $ctx = this.layout.regionContent.$el;
      $('.settings-form').addClass('settings-form-draggable');
      this.binds();

      // Add another button callback
      $('#form-edit-add-another', $ctx).click(function(e) {
        e.preventDefault();
        const blank = {weight: $(".nav-item-row").length + 1, title: '', path: '', icon: 'mdi-action-extension'};
        const row = self.getRow(blank);
        const formView = App.request("form:render:items", [row]);
        $(this).closest('.add-another-wrapper').before(formView.render().$el);
        return self.binds();
      });

      // Reordering and dragging (large screen only)
      if ($(window).width() > config.getLocal('largeBreakpoint')) {
        $('.form-groups', $ctx).sortable({
          draggable: ".draggable-row",
          onEnd(e) {
            return $('input[id^="form-edit-weight-"]', e.target).each((i, d) => $(d).attr('value', i));
          }
        });
      }

      // Reset default link
      return $('.nav-restore-defaults', $ctx).on("click", e => {
        e.preventDefault();
        App.request("navMain:update:defaults");
        this.initialize();
        return App.vent.trigger("navMain:refresh");
      });
    }

    // Things to refresh after render
    binds() {
      const $ctx = $('.settings-form');
      $('select[id^="form-edit-icon"]', $ctx).once('icon-changer').on("change", function(e) {
        return $(this).closest('.group-parent', $ctx).find('i').first().attr('class', $(this).val());
      });
      $('.remove-item', $ctx).on("click", function(e) {
        return $(this).closest('.group-parent', $ctx).remove();
      });
      return $.material.init();
    }

    // Get the form structure for a row
    getRow(item) {
      const {
        icons
      } = this.data;
      const i = item.weight;
      const icon = '<i class="' + item.icon + '"></i>';
      return {
        id: 'item-' + item.weight,
        class: 'nav-item-row draggable-row',
        children: [
          {id: 'title-' + i, name: 'title[]', type: 'textfield', title: 'Title', defaultValue: item.title},
          {id: 'path-' + i, name: 'path[]', type: 'textfield', title: 'Url', defaultValue: item.path},
          {id: 'icon-' + i, name: 'icon[]', type: 'select', titleHtml: 'Icon' + icon, defaultValue: item.icon, options: icons},
          {id: 'weight-' + i, name: 'weight[]', type: 'hidden', title: '', defaultValue: i},
          {id: 'id-' + i, name: 'id[]', type: 'hidden', title: '', defaultValue: (1000 + i)},
          {id: 'remove-' + i, type: 'markup', markup: '<span class="remove-item">&times;</span>'}
        ]
      };
    }
  };
});
