@Kodi.module "MovieApp.Edit", (Edit, App, Backbone, Marionette, $, _) ->

  class Edit.Controller extends App.Controllers.Base

    initialize: ->
      @model = @getOption('model')
      options = {
        title: @model.get('title')
        form: @getSructure()
        formState: @model.attributes
        config:
          attributes: {class: 'edit-form'}
          callback: (data, formView) =>
            @saveCallback(data, formView)
      }
      form = App.request "form:popup:wrapper", options

    getSructure: ->
      [
        {
          title: 'Information'
          id: 'general'
          children:[
            {id: 'title', title: 'Title', type: 'textfield', defaultValue: ''},
            {id: 'plotoutline', title: 'Plot outline', type: 'textarea', defaultValue: ''},
            {id: 'plot', title: 'Plot', type: 'textarea', defaultValue: ''},
            {id: 'rating', title: 'Rating', type: 'textfield', defaultValue: ''},
            {id: 'imdbnumber', title: 'IMDb', type: 'textfield', defaultValue: ''}
          ]
        }
      ]

    ## Save the settings to local storage.
    saveCallback: (data, formView) ->
      data.rating = parseFloat(data.rating)
      videoLib = App.request "command:kodi:controller", 'video', 'VideoLibrary'
      videoLib.setMovieDetails @model.get('id'), data, ->
        Kodi.execute "notification:show", t.gettext("Updated movie details")