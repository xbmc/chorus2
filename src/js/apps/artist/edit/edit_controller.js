@Kodi.module "ArtistApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

  class Edit.Controller extends App.Controllers.Base

    initialize: ->
      @model = @getOption('model')
      options = {
        titleHtml: '<span>' + tr('Edit') + '</span>' + @model.escape('artist')
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
            {id: 'artist', title: tr('Title'), type: 'textfield'},
            {id: 'description', title: tr('Description'), type: 'textarea'},
            {id: 'formed', title: tr('Formed'), type: 'textfield', attributes: {class: 'half-width'}},
            {id: 'disbanded', title: tr('Disbanded'), type: 'textfield', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'born', title: tr('Born'), type: 'textfield', attributes: {class: 'half-width'}},
            {id: 'died', title: tr('Died'), type: 'textfield', attributes: {class: 'half-width'}, suffix: '<div class="clearfix"></div>'},
            {id: 'yearsactive', title: tr('Years Active'), type: 'textfield', format: 'array.string'},
          ]
        }
        {
          title: 'Tags'
          id: 'tags'
          children:[
            {id: 'genre', title: tr('Genres'), type: 'textfield', format: 'array.string'},
            {id: 'style', title: tr('Styles'), type: 'textfield', format: 'array.string'},
            {id: 'instrument', title: tr('Instruments'), type: 'textarea', format: 'array.string'},
            {id: 'mood', title: tr('Moods'), type: 'textarea', format: 'array.string'},
          ]
        }
      ]

    ## Save the settings to Kodi
    saveCallback: (data, formView) ->
      controller = App.request "command:kodi:controller", 'audio', 'AudioLibrary'
      controller.setArtistDetails @model.get('id'), data, =>
        Kodi.vent.trigger 'entity:kodi:update', @model.get('uid')
        Kodi.execute "notification:show", t.sprintf(tr("Updated %1$s details"), 'album')
