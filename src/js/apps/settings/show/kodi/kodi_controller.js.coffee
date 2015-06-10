@Kodi.module "SettingsApp.Show.Kodi", (Kodi, App, Backbone, Marionette, $, _) ->

  class Kodi.Controller extends App.Controllers.Base

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

    getForm: ->
      options = {
        form: @getSructure()
        formState: @getState()
        config:
          attributes: {class: 'settings-form'}
      }
      form = App.request "form:wrapper", options
      @layout.regionContent.show form

    getSructure: ->
      [
        {
          title: 'List options'
          id: 'list'
          children:[
            {id: 'ignore-article', title: 'Ignore article', type: 'checkbox', defaultValue: true, description: 'Ignore terms such as "The" and "a" when sorting lists'}
          ]
        }
      ]


    getState: ->
      {
      'default-player': 'local'
      'jsonrpc-address': '/jsonrpc'
      'test-checkbox': false
      }