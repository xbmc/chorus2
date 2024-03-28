/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.EditEpisode", function(Edit, App, Backbone, Marionette, $, _) {

  return Edit.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      let form;
      this.model = this.getOption('model');
      const options = {
        titleHtml: '<span>' + tr('Edit') + '</span>' + this.model.escape('showtitle') + ' - ' + this.model.escape('title') + ' (S' + this.model.escape('season') + ' E' + this.model.escape('episode') + ')',
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
            {id: 'plot', title: tr('Plot'), type: 'textarea'},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}},
            {id: 'firstaired', title: tr('First aired'), type: 'date', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'originaltitle', title: tr('Original title'), type: 'textfield'},
          ]
        },
        {
          title: 'Tags',
          id: 'tags',
          children:[
            {id: 'director', title: tr('Directors'), type: 'textfield', format: 'array.string'},
            {id: 'writer', title: tr('Writers'), type: 'textfield', format: 'array.string'},
          ]
        },
        {
          title: 'Information',
          id: 'info',
          children:[
            {id: 'file', title: tr('File path'), type: 'textarea', attributes: {disabled: 'disabled', cols: 5}, format: 'prevent.submit'},
          ]
        }
      ];
    }

    //# Save the settings to Kodi
    saveCallback(data, formView) {
      const controller = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      return controller.setEpisodeDetails(this.model.get('id'), data, () => {
        Kodi.vent.trigger('entity:kodi:update', this.model.get('uid'));
        return Kodi.execute("notification:show", t.sprintf(tr("Updated %1$s details"), 'episode'));
      });
    }
  };
});
