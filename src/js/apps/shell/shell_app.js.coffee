@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  API =

    ## Render the shell.
    renderLayout: ->

      ## Render Shell and assign its regions to the app.
      shellLayout = new Shell.Layout()
      App.root.show( shellLayout )
      App.addRegions shellLayout.regions

      ## Get playlist state.
      playlistState = config.get 'app', 'shell:playlist:state', 'open'
      if playlistState is 'closed'
        @alterRegionClasses 'add', "shell-playlist-closed"

      ## Listen for changes to the playlist state.
      App.listenTo shellLayout, "shell:playlist:toggle", (child, args) =>
        playlistState = config.get 'app', 'shell:playlist:state', 'open'
        state = if playlistState is 'open' then 'closed' else 'open'
        config.set 'app', 'shell:playlist:state', state
        @alterRegionClasses 'toggle', "shell-playlist-closed"

      ## Set a background
      App.execute("images:fanart:set")



      ## TESTINGS!
      ## Get an artist collection.
      App.execute 'artist:entities', success: (data) ->
        console.log data

      ## Get an artist!
      App.execute 'artist:entity', 171, success: (data) ->
        console.log data
        App.execute "images:fanart:set", data.attributes.fanart



    ## Add the main menu.
    renderNav: ->
      navView = App.request 'navMain:view';
      App.regionNav.show( navView )

    ## Alter region classes.
    alterRegionClasses: (op, classes, region = 'root') ->
      $body = App.getRegion(region).$el
      action = "#{op}Class"
      $body[action](classes)

  App.addInitializer ->

    App.commands.setHandler "shell:view:ready", ->

      ## Render components.
      API.renderLayout()
      API.renderNav()

      ## Tell everyone, shell is ready.
      App.execute("shell:ready");