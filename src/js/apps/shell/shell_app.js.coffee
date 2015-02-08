@Kodi.module "Shell", (Shell, App, Backbone, Marionette, $, _) ->

  class Shell.Router extends App.Router.Base
    appRoutes:
      ""      	: "homePage"
      "home"   	: "homePage"


  API =

    homePage: ->
      home = new Shell.HomepageLayout()
      App.regionContent.show home
      App.execute "images:fanart:set"
      ## Change the famart when the state changes.
      App.vent.on "state:changed", (state) ->
        stateObj = App.request "state:current"
        if stateObj.isPlayingItemChanged()
          playingItem = stateObj.getPlaying 'item'
          App.execute "images:fanart:set", playingItem.fanart
      ## Ensure background removed when we leave.
      App.listenTo home, "destroy", =>
        App.execute "images:fanart:set", 'none'

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

       ## save a list..
      ## App.request "localplaylist:remove:entity", 1
      ## App.request "localplaylist:add:entity", 'Test list 1', 'song', 'list'
#      lists = App.request "localplaylist:entities"
#      lists.reset []
#      lists.set []
#       console.log 'my lists: ', lists
#      entity = App.request "localplaylist:item:entities", 'listname'
#      console.log entity
#      App.execute "when:entity:fetched", entity, ->
#        sets = App.request "file:source:media:entities", entity
#        console.log sets


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