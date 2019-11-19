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
            {id: 'lang', title: tr("Language"), type: 'select', options: helpers.translate.getLanguages(), defaultValue: 'en', description: tr('Preferred language, need to refresh browser to take effect')}
            {id: 'defaultPlayer', title: tr("Default player"), type: 'select', options: {auto: 'Auto', kodi: 'Kodi', local: 'Local'}, defaultValue: 'auto', description: tr('Which player to start with')}
            {id: 'keyboardControl', title: tr("Keyboard controls"), type: 'select', options: {kodi: 'Kodi', local: 'Browser', both: 'Both'}, defaultValue: 'kodi', description: tr('In Chorus, will you keyboard control Kodi, the browser or both') + '. <a href="#help/keybind-readme">' + tr('Learn more') + '</a>'}
          ]
        }
        {
          title: 'List options'
          id: 'list'
          children:[
            {id: 'ignoreArticle', title: tr("Ignore article"), type: 'checkbox', defaultValue: true, description: tr("Ignore articles (terms such as 'The' and 'A') when sorting lists")}
            {id: 'albumArtistsOnly', title: tr("Album artists only"), type: 'checkbox', defaultValue: true, description: tr('When listing artists should we only see artists with albums or all artists found. Warning: turning this off can impact performance with large libraries')}
            {id: 'playlistFocusPlaying', title: tr("Focus playlist on playing"), type: 'checkbox', defaultValue: true, description: tr('Automatically scroll the playlist to the current playing item. This happens whenever the playing item is changed')}
          ]
        }
        {
          title: 'Appearance'
          id: 'appearance'
          children:[
            {id: 'vibrantHeaders', title: tr("Vibrant headers"), type: 'checkbox', defaultValue: true, description: tr("Use colourful headers for media pages")}
            {id: 'disableThumbs', title: tr("Disable Thumbs Up"), type: 'checkbox', defaultValue: false, description: t.sprintf(tr("Remove the thumbs up button from media. Note: you may also want to remove the menu item from the %1$s"), '<a href="#settings/nav">' + tr('Main Nav') + '</a>')}
            {id: 'showDeviceName', title: tr("Show device name"), type: 'checkbox', defaultValue: false, description: tr("Show the Kodi device name in the header of Chorus")}
          ]
        }
        {
          title: 'Advanced options'
          id: 'advanced'
          children:[
            {id: 'socketsPort', title: tr("Websockets port"), type: 'textfield', defaultValue: '9090', description: "9090 " + tr("is the default")}
            {id: 'socketsHost', title: tr("Websockets host"), type: 'textfield', defaultValue: 'auto', description: tr("The hostname used for websockets connection. Set to 'auto' to use the current hostname.")}
            {id: 'pollInterval', title: tr("Poll interval"), type: 'select', defaultValue: '10000', options: {'5000': "5 " + tr('sec'), '10000': "10 " + tr('sec'), '30000': "30 " + tr('sec'), '60000': "60 " + tr('sec')}, description: tr("How often do I poll for updates from Kodi (Only applies when websockets inactive)")}
            {id: 'kodiSettingsLevel', title: tr("Kodi settings level"), type: 'select', defaultValue: 'standard', options: {'standard': 'Standard', 'advanced': 'Advanced', 'expert': 'Expert'}, description: tr('Advanced setting level is recommended for those who know what they are doing.')}
            {id: 'reverseProxy', title: tr("Reverse proxy support"), type: 'checkbox', defaultValue: false, description: tr('Enable support for reverse proxying.')}
            {id: 'refreshIgnoreNFO', title: tr("Refresh Ignore NFO"), type: 'checkbox', defaultValue: true, description: tr('Ignore local NFO files when manually refreshing media.')}
          ]
        }
        {
          title: 'API Keys'
          id: 'apikeys'
          children:[
            {id: 'apiKeyTMDB', title: tr("The Movie DB"), type: 'textfield', defaultValue: '', description: tr("Set your personal API key")}
            {id: 'apiKeyFanartTv', title: tr("FanartTV"), type: 'textfield', defaultValue: '', description: tr("Set your personal API key")}
            {id: 'apiKeyYouTube', title: tr("YouTube"), type: 'textfield', defaultValue: '', description: tr("Set your personal API key")}
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
      Kodi.vent.trigger("config:local:updated", config.static)
      Kodi.execute "notification:show", tr("Web Settings saved.")