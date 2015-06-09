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
            {id: 'lang', title: t.gettext("Language"), type: 'select', options: helpers.translate.getLanguages(), defaultValue: 'en', description: t.gettext('Preferred language, need to refresh browser to take effect')}
            {id: 'defaultPlayer', title: t.gettext("Default player"), type: 'select', options: {auto: 'Auto', kodi: 'Kodi', local: 'Local'}, defaultValue: 'auto', description: t.gettext('Which player to start with')}
          ]
        }
        {
          title: 'List options'
          id: 'list'
          children:[
            {id: 'ignoreArticle', title: t.gettext("Ignore article"), type: 'checkbox', defaultValue: true, description: t.gettext("Ignore articles (terms such as 'The' and 'A') when sorting lists")}
            {id: 'albumAtristsOnly', title: t.gettext("Album artists only"), type: 'checkbox', defaultValue: true, description: t.gettext('When listing artists should we only see artists with albums or all artists found. Warning: turning this off can impact performance with large libraries')}
          ]
        }
        {
          title: 'Advanced Options'
          id: 'advanced'
          children:[
            {id: 'socketsPort', title: t.gettext("Websockets Port"), type: 'textfield', defaultValue: '9090', description: "9090 " + t.gettext("is the default")}
            {id: 'socketsHost', title: t.gettext("Websockets Host"), type: 'textfield', defaultValue: 'auto', description: t.gettext("The hostname used for websockets connection. Set to 'auto' to use the current hostname.")}
            {id: 'pollInterval', title: t.gettext("Poll Interval"), type: 'select', defaultValue: '10000', options: {'5000': "5 " + t.gettext('sec'), '10000': "10 " + t.gettext('sec'), '30000': "30 " + t.gettext('sec'), '60000': "60 " + t.gettext('sec')}, description: t.gettext("How often do I poll for updates from Kodi (Only applies when websockets inactive)")}
            {id: 'reverseProxy', title: t.gettext("Reverse Proxy Support"), type: 'checkbox', defaultValue: false, description: t.gettext('Enable support for reverse proxying.')}
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
