@Kodi.module "AlbumApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

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
            {id: 'artist', title: tr('Artist'), type: 'textfield', format: 'array.string'},
            {id: 'description', title: tr('Description'), type: 'textarea'},
            {id: 'albumlabel', title: tr('Label'), type: 'textfield'},
            {id: 'year', title: tr('Year'), type: 'textfield', format: 'integer', attributes: {class: 'half-width'}},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}, suffix: '<div class="clearfix"></div>'},
          ]
        }
        {
          title: 'Tags'
          id: 'tags'
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'style', title: tr('Styles'), type: 'textfield', format: 'array.string'},
            {id: 'theme', title: tr('Themes'), type: 'textarea', format: 'array.string'},
            {id: 'mood', title: tr('Moods'), type: 'textarea', format: 'array.string'},
          ]
        }
      ]

    ## Save the settings to Kodi
    saveCallback: (data, formView) ->
      controller = App.request "command:kodi:controller", 'audio', 'AudioLibrary'
      controller.setAlbumDetails @model.get('id'), data, ->
        Kodi.execute "notification:show", t.sprintf("Updated %1$s details", 'album')