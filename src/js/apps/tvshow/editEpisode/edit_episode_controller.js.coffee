@Kodi.module "TVShowApp.EditEpisode", (Edit, App, Backbone, Marionette, $, _) ->

  class Edit.Controller extends App.Controllers.Base

    initialize: ->
      @model = @getOption('model')
      options = {
        title: '<span>' + tr('Edit') + '</span>' + @model.get('showtitle') + ' - ' + @model.get('title') + ' (S' + @model.get('season') + ' E' + @model.get('episode') + ')'
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
            {id: 'plot', title: tr('Plot'), type: 'textarea'},
            {id: 'rating', title: tr('Rating'), type: 'number', format: 'float', attributes: {class: 'half-width', step: 0.1, min: 0, max: 10}},
            {id: 'firstaired', title: tr('First aired'), type: 'date', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'originaltitle', title: tr('Original title'), type: 'textfield'},
          ]
        }
        {
          title: 'Tags'
          id: 'tags'
          children:[
            {id: 'director', title: tr('Directors'), type: 'textfield', format: 'array.string'},
            {id: 'writer', title: tr('Writers'), type: 'textfield', format: 'array.string'},
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
      controller.setEpisodeDetails @model.get('id'), data, =>
        Kodi.vent.trigger 'entity:kodi:refresh', @model.get('uid')
        Kodi.execute "notification:show", t.sprintf("Updated %1$s details", 'episode')