// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("AlbumApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {

  return Edit.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      let form;
      this.model = this.getOption('model');
      const options = {
        titleHtml: '<span>' + tr('Edit') + '</span>' + this.model.escape('title'),
        form: this.getStructure(),
        formState: this.model.attributes,
        config: {
          attributes: {class: 'edit-form'},
          editForm: true,
          tabs: true,
          callback: (data, formView) => {
            return this.saveCallback(data, formView);
          }
        }
      };
      return form = App.request("form:popup:wrapper", options);
    }

    getStructure() {
      return [
        {
          title: 'General',
          id: 'general',
          children:[
            {id: 'title', title: tr('Title'), type: 'textfield'},
            {id: 'artist', title: tr('Artist'), type: 'textfield', format: 'array.string'},
            {id: 'description', title: tr('Description'), type: 'textarea'},
            {id: 'albumlabel', title: tr('Label'), type: 'textfield'},
            {id: 'year', title: tr('Year'), type: 'number', format: 'integer', attributes: {class: 'half-width', step: 1, min: 0, max: 9999}},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}, suffix: '<div class="clearfix"></div>'},
          ]
        },
        {
          title: 'Tags',
          id: 'tags',
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'style', title: tr('Styles'), type: 'textfield', format: 'array.string'},
            {id: 'theme', title: tr('Themes'), type: 'textarea', format: 'array.string'},
            {id: 'mood', title: tr('Moods'), type: 'textarea', format: 'array.string'},
          ]
        }
      ];
    }

    //# Save the settings to Kodi
    saveCallback(data, formView) {
      const controller = App.request("command:kodi:controller", 'audio', 'AudioLibrary');
      return controller.setAlbumDetails(this.model.get('id'), data, () => {
        Kodi.vent.trigger('entity:kodi:update', this.model.get('uid'));
        return Kodi.execute("notification:show", t.sprintf(tr("Updated %1$s details"), 'album'));
      });
    }
  };
});
