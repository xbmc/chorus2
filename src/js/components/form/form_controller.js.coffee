@Kodi.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->
	
  class Form.Controller extends App.Controllers.Base

    initialize: (options = {}) ->
      config = if options.config then options.config else {}

      @formLayout = @getFormLayout config

      @listenTo @formLayout, "show", =>
        @formBuild(options.form, options.formState, config)
        $.material.init()

      @listenTo @formLayout, "form:submit", =>
        @formSubmit(options)

    formSubmit: (options) ->
      data = Backbone.Syphon.serialize @formLayout
      @processFormSubmit data, options

    processFormSubmit: (data, options) ->
      if options.config and typeof options.config.callback is 'function'
        options.config.callback data, @formLayout

    getFormLayout: (options = {}) ->
      new Form.FormWrapper
        config: options

    formBuild: (form = [], formState = {}, options = {}) ->
      collection = App.request "form:item:entites", form, formState
      buildView = new Form.Groups
        collection: collection
      @formLayout.formContentRegion.show buildView


  App.reqres.setHandler "form:wrapper", (options = {}) ->
    formController = new Form.Controller options
    formController.formLayout