@Kodi.module "MovieApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

  class Edit.Controller extends App.Controllers.Base

    initialize: ->
      @model = @getOption('model')

      options = {
        titleHtml: '<span>' + tr('Edit') + '</span>' + @model.escape('title')
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
            {id: 'plotoutline', title: tr('Tagline'), type: 'textfield'},
            {id: 'plot', title: tr('Plot'), type: 'textarea'},
            {id: 'studio', title: tr('Studio'), type: 'textfield', format: 'array.string'},
            {id: 'year', title: tr('Year'), type: 'number', format: 'integer', attributes: {class: 'half-width', step: 1, min: 1000, max: 9999}},
            {id: 'mpaa', title: tr('Content rating'), type: 'textfield', attributes: {class: 'half-width'}},
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
          title: 'Trailer'
          id: 'trailers'
          children:[
            {
              id: 'trailer', title: tr('URL'), type: 'imageselect', attributes: {class: 'fanart-size'},
              description: t.sprintf(tr('This should be the play path for the trailer. Eg. %1$s'), 'plugin://plugin.video.youtube/?action=play_video&videoid=[YOUTUBE_ID]'),
              metadataImageHandler: 'youtube:trailer:entities', metadataLookupField: 'title'
            }
          ]
        }
        {
          title: 'Poster'
          id: 'poster'
          children:[
            {
              id: 'thumbnail', title: tr('URL'), type: 'imageselect', valueProperty: 'thumbnailOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'themoviedb:movie:image:entities', metadataLookupField: 'imdbnumber'
            }
          ]
        }
        {
          title: 'Background'
          id: 'background'
          children:[
            {
              id: 'fanart', title: tr('URL'), type: 'imageselect', valueProperty: 'fanartOriginal', description: tr('Add an image via an external URL'),
              metadataImageHandler: 'themoviedb:movie:image:entities', metadataLookupField: 'imdbnumber'
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
      controller = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      controller.setMovieDetails @model.get('id'), data, =>
        Kodi.vent.trigger 'entity:kodi:update', @model.get('uid')
        App.execute "notification:show", t.sprintf(tr("Updated %1$s details"), 'movie')