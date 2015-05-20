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
        form: @getStructure()
        formState: @getState()
        config:
          attributes: {class: 'settings-form'}
          callback: (data, formView) =>
            @saveCallback(data, formView)
      }
      form = App.request "form:wrapper", options
      @layout.regionContent.show form

    getStructure: ->
      [
        {
          title: 'General Options'
          id: 'general'
          children:[
            {id: 'defaultPlayer', title: 'Default player', type: 'select', options: {auto: 'Auto', kodi: 'Kodi', local: 'Local'}, defaultValue: 'auto', description: t.gettext('What player to start with')}
          ]
        }
        {
          title: 'List options'
          id: 'list'
          children:[
            {id: 'ignoreArticle', title: 'Ignore article', type: 'checkbox', defaultValue: true, description: t.gettext('Ignore terms such as "The" and "a" when sorting lists')}
            {id: 'albumAtristsOnly', title: 'Album artists only', type: 'checkbox', defaultValue: true, description: t.gettext('When listing artists should we only see arttists with albums or all artists found. Warning: turning this off can impact performance with large libraries')}
          ]
        }
        {
          title: 'Advanced Options'
          id: 'advanced'
          children:[
            {id: 'socketsPort', title: 'Websockets port', type: 'textfield', defaultValue: '9090', description: t.gettext("Default is '9090'")}
            {id: 'socketsHost', title: 'Websockets Host', type: 'textfield', defaultValue: 'auto', description: t.gettext("The hostname used for websockets connection. Set to 'auto' to use the current hostname.")}
            {id: 'pollInterval', title: 'Poll Interval', type: 'select', defaultValue: '10000', options: {'5000': t.gettext('5 sec'), '10000': t.gettext('10 sec'), '30000': t.gettext('30 sec'), '60000': t.gettext('1 min')}, description: t.gettext("How often do I poll for updates from Kodi (Only applies when websockets inactive)")}
            {id: 'reverseProxy', title: 'Reverse Proxy Support', type: 'checkbox', defaultValue: false, description: t.gettext('Enable support for reverse proxying.')}
          ]
        }
      ]

    ## Get settings from local storage
    getState: ->
      config.get 'app', 'config:local', config.static

    ## Save the settings to local storage.
    saveCallback: (data, formView) ->
      config.set 'app', 'config:local', data
      Kodi.execute "notification:show", t.gettext("Web Settings saved.")
