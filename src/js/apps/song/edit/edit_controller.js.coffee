@Kodi.module "SongApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

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
            {id: 'albumartist', title: tr('Album artist'), type: 'textfield', format: 'array.string'},
            {id: 'album', title: tr('Album'), type: 'textfield'},
            {id: 'year', title: tr('Year'), type: 'number', format: 'integer', attributes: {class: 'half-width', step: 1, min: 1000, max: 9999}},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}, suffix: '<div class="clearfix"></div>'},
            {id: 'track', title: tr('Track'), type: 'textfield', format: 'integer', attributes: {class: 'half-width'}}
            {id: 'disc', title: tr('Disc'), type: 'textfield', format: 'integer', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'}
          ]
        }
        {
          title: 'Tags'
          id: 'tags'
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
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
      controller = App.request "command:kodi:controller", 'audio', 'AudioLibrary'
      controller.setSongDetails @model.get('id'), data, =>
        Kodi.vent.trigger 'entity:kodi:update', @model.get('uid')
        Kodi.execute "notification:show", t.sprintf("Updated %1$s details", 'song')