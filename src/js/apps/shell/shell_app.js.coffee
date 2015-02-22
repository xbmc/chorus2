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
      ## Change the famart when the state changes.
      App.vent.on "state:changed", (state) =>
        stateObj = App.request "state:current"
        if stateObj.isPlayingItemChanged()
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


      ## TESTINGS!

      ## Get data
#      entity = App.request "song:searchindex:entities", 'listname'
#      App.execute "when:entity:fetched", entity, ->
#        filtered = new App.Entities.Filtered(entity)
#        filtered.filterByString('label', 'diplo')
#        ids = filtered.pluck 'songid'
#        loaded = App.request "song:byid:entities", ids
#        App.execute "when:entity:fetched", loaded, ->
#          console.log loaded


    ## Alter region classes.
    alterRegionClasses: (op, classes, region = 'root') ->
      $body = App.getRegion(region).$el
      action = "#{op}Class"
      $body[action](classes)


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