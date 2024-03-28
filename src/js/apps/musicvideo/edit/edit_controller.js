/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MusicVideoApp.Edit", function(Edit, App, Backbone, Marionette, $, _) {

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
            {id: 'album', title: tr('Album'), type: 'textfield'},
            {id: 'plot', title: tr('Plot'), type: 'textarea'},
            {id: 'studio', title: tr('Studio'), type: 'textfield', format: 'array.string'},
            {id: 'year', title: tr('Year'), type: 'number', format: 'integer', attributes: {class: 'half-width', step: 1, min: 0, max: 9999}},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}, suffix: '<div class="clearfix"></div>'},
          ]
        },
        {
          title: 'Tags',
          id: 'tags',
          children:[
            {id: 'director', title: tr('Directors'), type: 'textfield', format: 'array.string'},
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'tag', title: tr('Tags'), type: 'textfield', format: 'array.string'},
          ]
        },
        {
          title: 'Poster',
          id: 'poster',
          children:[
            {
              id: 'thumbnail', title: tr('URL'), type: 'imageselect', valueProperty: 'thumbnailOriginal', description: tr('Add an image via an external URL'), attributes: {class: 'fanart-size'},
              metadataImageHandler: 'fanarttv:artist:image:entities', metadataLookupField: 'artist'
            }
          ]
        },
        {
          title: 'Background',
          id: 'background',
          children:[
            {
              id: 'fanart', title: tr('URL'), type: 'imageselect', valueProperty: 'fanartOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'fanarttv:artist:image:entities', metadataLookupField: 'artist'
            }
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
      const controller = App.request("command:kodi:controller", 'audio', 'VideoLibrary');
      return controller.setMusicVideoDetails(this.model.get('id'), data, () => {
        Kodi.vent.trigger('entity:kodi:update', this.model.get('uid'));
        return Kodi.execute("notification:show", t.sprintf(tr("Updated %1$s details"), 'album'));
      });
    }
  };
});
