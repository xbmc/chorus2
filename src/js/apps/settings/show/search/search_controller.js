// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp.Show.Search", function(Search, App, Backbone, Marionette, $, _) {

  return Search.Controller = class Controller extends App.SettingsApp.Show.Base.Controller {

    // Callback gets passed the collection to process
    constructor(...args) {
      super(...args);
      this.onReady = this.onReady.bind(this);
    }

    getCollection(callback) {
      this.collection = App.request('searchAddons:entities');
      return callback(this.collection);
    }

    // Passed the collection and returns form structure
    getStructure(data) {
      this.data = data;
      // Form header/intro
      const form = [{
        title: t.gettext('Custom Add-on search'),
        id: 'intro',
        children: [{
          id: 'intro-text',
          type: 'markup',
          markup: t.sprintf(tr("Add custom add-on searches"), '<a href="#help/addons">' + tr('Add-ons help page') + '</a>')
        }
        ]
      }
      ];
      // Return a form structure
      const items = this.collection.toJSON();
      if (items.length === 0) {
        items.push(this.getBlank(items.length));
      }
      for (var i in items) {
        var item = items[i];
        item.weight = i;
        var row = this.getRow(item);
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
          url: formState.url[i],
          media: formState.media[i],
          weight: formState.weight[i],
          id: formState.id[i]
        });
      }
      // Save items, refresh page and show notification
      App.request("searchAddons:update:entities", items);
      return Kodi.execute("notification:show", t.gettext('Custom Addon search updated'));
    }

    // The form has been rendered
    onReady() {
      const self = this;
      const $ctx = this.layout.regionContent.$el;
      $('.settings-form').addClass('settings-form-draggable');
      this.binds();

      // Reordering and dragging (large screen only)
      if ($(window).width() > config.getLocal('largeBreakpoint')) {
        $('.form-groups', $ctx).sortable({
          draggable: ".draggable-row",
          onEnd(e) {
            return $('input[id^="form-edit-weight-"]', e.target).each((i, d) => $(d).attr('value', i));
          }
        });
      }

      // Add another button callback
      $('#form-edit-add-another', $ctx).click(function(e) {
        e.preventDefault();
        const blank = self.getBlank($(".item-row").length);
        const row = self.getRow(blank);
        const formView = App.request("form:render:items", [row]);
        $(this).closest('.add-another-wrapper').before(formView.render().$el);
        return self.binds();
      });

      // Reset default link
      return $('.restore-defaults', $ctx).on("click", e => {});
    }
        // this should clear all.

    getBlank(weight) {
      return {weight, title: '', url: '', media: 'music'};
    }

    // Things to refresh after render
    binds() {
      const $ctx = $('.settings-form');
      $('.remove-item', $ctx).on("click", function(e) {
        return $(this).closest('.group-parent', $ctx).remove();
      });
      return $.material.init();
    }

    // Get the form structure for a row
    getRow(item) {
      const i = item.weight;
      return {
        id: 'item-' + item.weight,
        class: 'item-row draggable-row',
        children: [
          {id: 'title-' + i, name: 'title[]', type: 'textfield', title: 'Title', defaultValue: item.title},
          {id: 'url-' + i, name: 'url[]', type: 'textfield', title: 'Url', defaultValue: item.url},
          {id: 'media-' + i, name: 'media[]', type: 'select', title: 'Media', defaultValue: item.media, options: {music: 'Music', video: 'Video'}},
          {id: 'weight-' + i, name: 'weight[]', type: 'hidden', title: '', defaultValue: i},
          {id: 'id-' + i, name: 'id[]', type: 'hidden', title: '', defaultValue: 'custom.addon.' + i},
          {id: 'remove-' + i, type: 'markup', markup: '<span class="remove-item">&times;</span>'}
        ]
      };
    }
  };
});
