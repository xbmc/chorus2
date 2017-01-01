@Kodi.module "TVShowApp.EditShow", (Edit, App, Backbone, Marionette, $, _) ->

  class Edit.Controller extends App.Controllers.Base

    initialize: ->
      @model = @getOption('model')
      options = {
        title: '<span>' + tr('Edit') + '</span>' + @model.get('title')
        form: @getSructure()
        formState: @model.attributes
        config:
          attributes: {class: 'edit-form'}
          editForm: true
          tabs: true
          callback: (data, formView) =>
            @saveCallback(data, formView)
      }
      form = App.request "form:popup:wrapper", options

    getSructure: ->
      [
        {
          title: 'General'
          id: 'general'
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
        }
        {
          title: 'Tags'
          id: 'tags'
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'tag', title: tr('Tags'), type: 'textarea', format: 'array.string'},
          ]
        }
        {
          title: 'Poster'
          id: 'poster'
          children:[
            {
              id: 'thumbnail', title: tr('URL'), type: 'imageselect', valueProperty: 'thumbnailOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'metadata:themoviedb:tv:images', metadataLookupField: 'imdbnumber'
            }
          ]
        }
        {
          title: 'Background'
          id: 'background'
          children:[
            {
              id: 'fanart', title: tr('URL'), type: 'imageselect', valueProperty: 'fanartOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'metadata:themoviedb:tv:images', metadataLookupField: 'imdbnumber'
            }
          ]
        }
      ]

    ## Save the settings to Kodi
    saveCallback: (data, formView) ->
      controller = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      controller.setTVShowDetails @model.get('id'), data, =>
        helpers.entities.triggerUpdate @model, data, ['watchedepisodes', 'episode']
        Kodi.execute "notification:show", t.sprintf("Updated %1$s details", 'tvshow')