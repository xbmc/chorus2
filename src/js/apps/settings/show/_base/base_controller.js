@Kodi.module "SettingsApp.Show.Base", (SettingsBase, App, Backbone, Marionette, $, _) ->

  class SettingsBase.Controller extends App.Controllers.Base

    initialize: ->

      ## Get and setup the layout
      @layout = @getLayoutView()
      @listenTo @layout, "show", =>
        @getSubNav()
        @getForm()

      ## Render the layout
      App.regionContent.show @layout

    getLayoutView: ->
      new App.SettingsApp.Show.Layout()

    getSubNav: ->
      subNav = App.request 'settings:subnav'
      @layout.regionSidebarFirst.show subNav

    # Builds the form and adds it to the layout
    getForm: ->
      @getCollection (collection) =>
        options = {
          form: @getStructure(collection)
          formState: []
          config:
            attributes: {class: 'settings-form'}
            callback: (formState, formView) =>
              @saveCallback(formState, formView)
            onShow: () =>
              @onReady()
        }
        form = App.request "form:wrapper", options
        @layout.regionContent.show form


    ## Override the following methods in your sub class ##

    # Callback gets passed the collection to process
    getCollection: (callback) ->
      # Return a collection of items
      res = {}
      callback res

    # Passed the collection and returns form structure
    getStructure: (collection) ->
      # Return a form structure
      []

    # Save only changed values
    saveCallback: (formState, formView) ->
      # Processes the form state and save the changes

    # Called when form is rendered
    onReady: ->
      # Bind onto any form elements added.
      @layout
