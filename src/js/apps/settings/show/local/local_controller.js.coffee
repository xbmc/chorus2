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
          title: 'General options'
          id: 'general'
          children:[
            {id: 'lang', title: t.gettext("Language"), type: 'select', options: helpers.translate.getLanguages(), defaultValue: 'en', description: t.gettext('Preferred language, need to refresh browser to take effect')}
            {id: 'defaultPlayer', title: t.gettext("Default player"), type: 'select', options: {auto: 'Auto', kodi: 'Kodi', local: 'Local'}, defaultValue: 'auto', description: t.gettext('Which player to start with')}
            {id: 'keyboardControl', title: t.gettext("Keyboard controls"), type: 'select', options: {kodi: 'Kodi', local: 'Browser', both: 'Both'}, defaultValue: 'kodi', description: t.gettext('In Chorus, will you keyboard control Kodi, the browser or both') + '. <a href="#help/keybind-readme">' + t.gettext('Learn more') + '</a>'}
          ]
        }
        {
          title: 'List options'
          id: 'list'
          children:[
            {id: 'ignoreArticle', title: t.gettext("Ignore article"), type: 'checkbox', defaultValue: true, description: t.gettext("Ignore articles (terms such as 'The' and 'A') when sorting lists")}
            {id: 'albumAtristsOnly', title: t.gettext("Album artists only"), type: 'checkbox', defaultValue: true, description: t.gettext('When listing artists should we only see artists with albums or all artists found. Warning: turning this off can impact performance with large libraries')}
            {id: 'playlistFocusPlaying', title: t.gettext("Focus playlist on playing"), type: 'checkbox', defaultValue: true, description: t.gettext('Automatically scroll the playlist to the current playing item. This happens whenever the playing item is changed')}
          ]
        }
        {
          title: 'Appearance'
          id: 'appearance'
          children:[
            {id: 'vibrantHeaders', title: t.gettext("Vibrant headers"), type: 'checkbox', defaultValue: true, description: t.gettext("Use colourful headers for media pages")}
          ]
        }
        {
          title: 'Advanced options'
          id: 'advanced'
          children:[
            {id: 'socketsPort', title: t.gettext("Websockets port"), type: 'textfield', defaultValue: '9090', description: "9090 " + t.gettext("is the default")}
            {id: 'socketsHost', title: t.gettext("Websockets host"), type: 'textfield', defaultValue: 'auto', description: t.gettext("The hostname used for websockets connection. Set to 'auto' to use the current hostname.")}
            {id: 'pollInterval', title: t.gettext("Poll interval"), type: 'select', defaultValue: '10000', options: {'5000': "5 " + t.gettext('sec'), '10000': "10 " + t.gettext('sec'), '30000': "30 " + t.gettext('sec'), '60000': "60 " + t.gettext('sec')}, description: t.gettext("How often do I poll for updates from Kodi (Only applies when websockets inactive)")}
            {id: 'kodiSettingsLevel', title: t.gettext("Kodi settings level"), type: 'select', defaultValue: 'standard', options: {'standard': 'Standard', 'advanced': 'Advanced'}, description: t.gettext('Advanced setting level is recommended for those who know what they are doing.')}
            {id: 'reverseProxy', title: t.gettext("Reverse proxy support"), type: 'checkbox', defaultValue: false, description: t.gettext('Enable support for reverse proxying.')}
          ]
        }
      ]

    ## Get settings from local storage
    getState: ->
      config.get 'app', 'config:local', config.static

    ## Save the settings to local storage.
    saveCallback: (data, formView) ->
      # Save to local storage
      config.set 'app', 'config:local', data
      # Update current session
      config.static = _.extend config.static, config.get('app', 'config:local', config.static)
      # Notify.
      Kodi.execute "notification:show", t.gettext("Web Settings saved.")
