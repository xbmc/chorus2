@Kodi.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
	
  class Form.Controller extends App.Controllers.Base

    initialize: (options = {}) ->
      config = if options.config then options.config else {}

      @formLayout = @getFormLayout config

      @listenTo @formLayout, "show", =>
        @formBuild(options.form, options.formState, config)
        $.material.init()
        if config and typeof config.onShow is 'function'
          config.onShow options

      @listenTo @formLayout, "form:submit", =>
        @formSubmit(options)

      @

    formSubmit: (options) ->
      data = Backbone.Syphon.serialize @formLayout
      data = App.request "form:value:entities", options.form, data
      @processFormSubmit data, options

    processFormSubmit: (data, options) ->
      if options.config and typeof options.config.callback is 'function'
        options.config.callback data, @formLayout

    getFormLayout: (options = {}) ->
      new Form.FormWrapper
        config: options

    formBuild: (form = [], formState = {}, options = {}) ->
      collection = App.request "form:item:entities", form, formState
      buildView = new Form.Groups
        collection: collection
      @formLayout.formContentRegion.show buildView


  App.reqres.setHandler "form:render:items", (form, formState, options = {}) ->
    collection = App.request "form:item:entities", form, formState
    new Form.Groups
      collection: collection

  App.reqres.setHandler "form:wrapper", (options = {}) ->
    formController = new Form.Controller options
    formController.formLayout

  App.reqres.setHandler "form:popup:wrapper", (options = {}) ->
    originalCallback = options.config.callback
    options.config.callback = (data, layout) ->
      App.execute "ui:modal:close"
      originalCallback data, layout
    formController = new Form.Controller options
    formContent = formController.formLayout.render().$el
    formController.formLayout.trigger 'show'
    popupStyle = if options.config.editForm then 'edit-form' else 'form'
    App.execute "ui:modal:form:show", options.title, formContent, popupStyle

