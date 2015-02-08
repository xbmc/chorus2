@Kodi.module "SettingsApp.Show.Local", (Local, App, Backbone, Marionette, $, _) ->

  class Local.Controller extends App.Controllers.Base

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
          callback: (data, formView) =>
            @saveCallback(data, formView)
      }
      form = App.request "form:wrapper", options
      @layout.regionContent.show form

    getSructure: ->
      [
        {
          title: 'General Options'
          id: 'general'
          children:[
            {id: 'defaultPlayer', title: 'Default player', type: 'select', options: {auto: 'Auto', kodi: 'Kodi', local: 'Local'}, defaultValue: 'auto', description: 'What player to start with'}
          ]
        }
        {
          title: 'List options'
          id: 'list'
          children:[
            {id: 'ignoreArticle', title: 'Ignore article', type: 'checkbox', defaultValue: true, description: 'Ignore terms such as "The" and "a" when sorting lists'}
            {id: 'albumAtristsOnly', title: 'Album artists only', type: 'checkbox', defaultValue: true, description: 'When listing artists should we only see arttists with albums or all artists found. Warning: turning this off can impact performance with large libraries'}
          ]
        }
        {
          title: 'Advanced Options'
          id: 'advanced'
          children:[
            {id: 'jsonRpcEndpoint', title: 'JsonRPC path', type: 'textfield', defaultValue: 'jsonrpc', description: "Default is 'jsonrpc'"}
            {id: 'socketsHost', title: 'Websockets Host', type: 'textfield', defaultValue: 'auto', description: "The hostname used for websockets connection. Set to 'auto' to use the current hostname."}
            {id: 'pollInterval', title: 'Poll Interval', type: 'select', defaultValue: '10000', options: {'5000': '5 sec', '10000': '10 sec', '30000': '30 sec', '60000': '1 min'}, description: "How often do I poll for updates from Kodi (Only applies when websockets inactive)"}
          ]
        }
      ]

    ## Get settings from local storage
    getState: ->
      config.get 'app', 'config:local', config.static

    ## Save the settings to local storage.
    saveCallback: (data, formView) ->
      config.set 'app', 'config:local', data
      Kodi.execute "notification:show", "Web Settings saved."