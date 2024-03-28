// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("ArtistApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {

  return Edit.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      let form;
      this.model = this.getOption('model');
      const options = {
        titleHtml: '<span>' + tr('Edit') + '</span>' + this.model.escape('artist'),
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
            {id: 'artist', title: tr('Title'), type: 'textfield'},
            {id: 'description', title: tr('Description'), type: 'textarea'},
            {id: 'formed', title: tr('Formed'), type: 'textfield', attributes: {class: 'half-width'}},
            {id: 'disbanded', title: tr('Disbanded'), type: 'textfield', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'born', title: tr('Born'), type: 'textfield', attributes: {class: 'half-width'}},
            {id: 'died', title: tr('Died'), type: 'textfield', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'yearsactive', title: tr('Years Active'), type: 'textfield', format: 'array.string'},
          ]
        },
        {
          title: 'Tags',
          id: 'tags',
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'style', title: tr('Styles'), type: 'textfield', format: 'array.string'},
            {id: 'instrument', title: tr('Instruments'), type: 'textarea', format: 'array.string'},
            {id: 'mood', title: tr('Moods'), type: 'textarea', format: 'array.string'},
          ]
        }
      ];
    }

    //# Save the settings to Kodi
    saveCallback(data, formView) {
      const controller = App.request("command:kodi:controller", 'audio', 'AudioLibrary');
      return controller.setArtistDetails(this.model.get('id'), data, () => {
        Kodi.vent.trigger('entity:kodi:update', this.model.get('uid'));
        return Kodi.execute("notification:show", t.sprintf(tr("Updated %1$s details"), 'album'));
      });
    }
  };
});
