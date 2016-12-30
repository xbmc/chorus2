@Kodi.module "MovieApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

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
            {id: 'plotoutline', title: tr('Tagline'), type: 'textfield'},
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
            {id: 'director', title: tr('Directors'), type: 'textfield', format: 'array.string'},
            {id: 'writer', title: tr('Writers'), type: 'textfield', format: 'array.string'},
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'country', title: tr('Country'), type: 'textfield', format: 'array.string'},
            {id: 'set', title: tr('Set'), type: 'textfield'},
            {id: 'tag', title: tr('Tags'), type: 'textarea', format: 'array.string'},
          ]
        }
        {
          title: 'Other media'
          id: 'media'
          children:[
            {id: 'trailer', title: tr('Trailer'), type: 'textfield'},
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
      controller = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      controller.setMovieDetails @model.get('id'), data, ->
        Kodi.execute "notification:show", t.sprintf("Updated %1$s details", 'movie')