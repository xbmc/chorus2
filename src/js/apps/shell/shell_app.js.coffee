@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Router extends App.Router.Base
    appRoutes:
      ""      	: "homePage"
      "home"   	: "homePage"


  API =

    homePage: ->
      home = new Shell.HomepageLayout()
      App.regionContent.show home
      @setFanart()
      ## Change the fanart when the state changes.
      App.vent.on "state:changed", (state) =>
        stateObj = App.request "state:current"
        if stateObj.isPlayingItemChanged() and helpers.url.arg(0) is ''
          @setFanart()
      ## Ensure background removed when we leave.
      App.listenTo home, "destroy", =>
        App.execute "images:fanart:set", 'none'

    setFanart: ->
      stateObj = App.request "state:current"
      if stateObj?
        playingItem = stateObj.getPlaying 'item'
        App.execute "images:fanart:set", playingItem.fanart
      else
        App.execute "images:fanart:set"

    ## Render the shell.
    renderLayout: ->

      ## Render Shell and assign its regions to the app.
      shellLayout = new Shell.Layout()
      App.root.show( shellLayout )
      App.addRegions shellLayout.regions

      ## Kick of loading.
      App.execute "loading:show:page"

      ## Set title.
      @setAppTitle()

      ## Get playlist state.
      playlistState = config.get 'app', 'shell:playlist:state', 'open'
      if playlistState is 'closed'
        @alterRegionClasses 'add', "shell-playlist-closed"

      ## Update config options
      @configUpdated()
      App.vent.on "config:local:updated", (data) =>
        @configUpdated()

      ## Listen for active filtering
      App.vent.on "filter:filtering:start", () =>
        @alterRegionClasses 'add', "filters-loading"
      App.vent.on "filter:filtering:stop", () =>
        @alterRegionClasses 'remove', "filters-loading"

      ## Listen for changes to the playlist state.
      App.listenTo shellLayout, "shell:playlist:toggle", (child, args) =>
        playlistState = config.get 'app', 'shell:playlist:state', 'open'
        state = if playlistState is 'open' then 'closed' else 'open'
        config.set 'app', 'shell:playlist:state', state
        @alterRegionClasses 'toggle', "shell-playlist-closed"

      ## Additional listeners
      @bindListenersContextMenu shellLayout
      @bindListenersSelectedMenu shellLayout


    ## Alter region classes.
    alterRegionClasses: (op, classes, region = 'root') ->
      $body = App.getRegion(region).$el
      action = "#{op}Class"
      $body[action](classes)

    ## Config updated. We might need to add or remove some shell classes.
    configUpdated: ->
      ## Are thumbs disabled.
      disableThumbs = config.getLocal 'disableThumbs', false
      disableThumbsClassOp = if disableThumbs is true then 'add' else 'remove'
      @alterRegionClasses disableThumbsClassOp, 'disable-thumbs'
      @setAppTitle()

    ## Set app title.
    setAppTitle: ->
      App.getRegion('regionTitle').$el.html('')
      if config.getLocal('showDeviceName', false) is true
        settingsController = App.request "command:kodi:controller", 'auto', 'Settings'
        settingsController.getSettingValue 'services.devicename', (title) ->
          App.getRegion('regionTitle').$el.html(title)

    # Shell listeners for context menu.
    bindListenersContextMenu: (shellLayout) ->
      # Library
      App.listenTo shellLayout, "shell:audio:scan", ->
        App.request("command:kodi:controller", 'auto', 'AudioLibrary').scan()
      App.listenTo shellLayout, "shell:video:scan", ->
        App.request("command:kodi:controller", 'auto', 'VideoLibrary').scan()
      # Pages
      App.listenTo shellLayout, "shell:goto:lab", ->
        App.navigate "#lab", {trigger: true}
      App.listenTo shellLayout, "shell:about", ->
        App.navigate "#help", {trigger: true}
      # Input box
      App.listenTo shellLayout, "shell:send:input", ->
        App.execute "input:textbox", ''

    # Shell listeners for selected menu
    bindListenersSelectedMenu: (shellLayout) ->
      App.listenTo shellLayout, "shell:selected:play", ->
        App.execute "selected:action:play"
      App.listenTo shellLayout, "shell:selected:add", ->
        App.execute "selected:action:add"
      App.listenTo shellLayout, "shell:selected:localadd", ->
        App.execute "selected:action:localadd"

  App.addInitializer ->

    App.commands.setHandler "shell:view:ready", ->

        ## Render components.
      API.renderLayout()

      ## Shell Router
      new Shell.Router
        controller: API

      ## Tell everyone, shell is ready.
      App.vent.trigger "shell:ready"

      ## Add, Remove, Toggle classes on body.
      App.commands.setHandler "body:state", (op, state) ->
        API.alterRegionClasses op, state