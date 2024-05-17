// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("TVShowApp.EditShow", function(Edit, App, Backbone, Marionette, $, _) {

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
            this.setArt(data);
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
            {id: 'studio', title: tr('Studio'), type: 'textfield', format: 'array.string'},
            {id: 'mpaa', title: tr('Content rating'), type: 'textfield', attributes: {class: 'half-width'}},
            {id: 'premiered', title: tr('Premiered'), type: 'date', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}},
            {id: 'imdbnumber', title: tr('IMDb'), type: 'textfield', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'sorttitle', title: tr('Sort title'), type: 'textfield'},
            {id: 'originaltitle', title: tr('Original title'), type: 'textfield'},
          ]
        },
        {
          title: 'Tags',
          id: 'tags',
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'tag', title: tr('Tags'), type: 'textarea', format: 'array.string'},
          ]
        },
        {
          title: 'Poster',
          id: 'poster',
          children:[
            {
              id: 'thumbnail', title: tr('URL'), type: 'imageselect', valueProperty: 'thumbnailOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'themoviedb:tv:image:entities', metadataLookupField: 'imdbnumber'
            }
          ]
        },
        {
          title: 'Background',
          id: 'background',
          children:[
            {
              id: 'fanart', title: tr('URL'), type: 'imageselect', valueProperty: 'fanartOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'themoviedb:tv:image:entities', metadataLookupField: 'imdbnumber'
            }
          ]
        }
      ];
    }

    //# Properly write the art map
    setArt(data) {
      const art = {};
      if ('fanart' in data) {
        art["fanart"] = data.fanart;
      }
      if ('thumbnail' in data) {
        art["poster"] = data.thumbnail;
        delete data.thumbnail;
      }
      return data["art"] = art;
    }

    //# Save the settings to Kodi
    saveCallback(data, formView) {
      const controller = App.request("command:kodi:controller", 'video', 'VideoLibrary');
      return controller.setTVShowDetails(this.model.get('id'), data, () => {
        Kodi.vent.trigger('entity:kodi:update', this.model.get('uid'));
        return Kodi.execute("notification:show", t.sprintf(tr("Updated %1$s details"), 'tvshow'));
      });
    }
  };
});
