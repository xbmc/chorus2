@Kodi.module "MusicVideoApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

  class Edit.Controller extends App.Controllers.Base

    initialize: ->
      @model = @getOption('model')
      options = {
        title: '<span>' + tr('Edit') + '</span>' + @model.get('title')
        form: @getStructure()
        formState: @model.attributes
        config:
          attributes: {class: 'edit-form'}
          editForm: true
          tabs: true
          callback: (data, formView) =>
            @saveCallback(data, formView)
      }
      form = App.request "form:popup:wrapper", options

    getStructure: ->
      [
        {
          title: 'General'
          id: 'general'
          children:[
            {id: 'title', title: tr('Title'), type: 'textfield'},
            {id: 'artist', title: tr('Artist'), type: 'textfield', format: 'array.string'},
            {id: 'album', title: tr('Album'), type: 'textfield'},
            {id: 'plot', title: tr('Plot'), type: 'textarea'},
            {id: 'studio', title: tr('Studio'), type: 'textfield', format: 'array.string'},
            {id: 'year', title: tr('Year'), type: 'number', format: 'integer', attributes: {class: 'half-width', step: 1, min: 0, max: 9999}},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}, suffix: '<div class="clearfix"></div>'},
          ]
        }
        {
          title: 'Tags'
          id: 'tags'
          children:[
            {id: 'director', title: tr('Directors'), type: 'textfield', format: 'array.string'},
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'tag', title: tr('Tags'), type: 'textfield', format: 'array.string'},
          ]
        }
        {
          title: 'Poster'
          id: 'poster'
          children:[
            {
              id: 'thumbnail', title: tr('URL'), type: 'imageselect', valueProperty: 'thumbnailOriginal', description: tr('Add an image via an external URL'),
            }
          ]
        }
        {
          title: 'Background'
          id: 'background'
          children:[
            {
              id: 'fanart', title: tr('URL'), type: 'imageselect', valueProperty: 'fanartOriginal', description: tr('Add an image via an external URL'),
            }
          ]
        }
        {
          title: 'Information'
          id: 'info'
          children:[
            {id: 'file', title: tr('File path'), type: 'textarea', attributes: {disabled: 'disabled', cols: 5}, format: 'prevent.submit'},
          ]
        }
      ]

    ## Save the settings to Kodi
    saveCallback: (data, formView) ->
      controller = App.request "command:kodi:controller", 'audio', 'VideoLibrary'
      controller.setMusicVideoDetails @model.get('id'), data, =>
        Kodi.vent.trigger 'entity:kodi:update', @model.get('uid')
        Kodi.execute "notification:show", t.sprintf(tr("Updated %1$s details"), 'album')