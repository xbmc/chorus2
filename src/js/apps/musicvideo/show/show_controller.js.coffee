@Kodi.module "MusicVideoApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  API =

    bindTriggers: (view) ->
      App.listenTo view, 'musicvideo:play', (viewItem) ->
        App.execute 'musicvideo:action', 'play', viewItem
      App.listenTo view, 'musicvideo:add', (viewItem) ->
        App.execute 'musicvideo:action', 'add', viewItem
      App.listenTo view, 'musicvideo:localplay', (viewItem) ->
        App.execute 'musicvideo:action', 'localplay', viewItem
      App.listenTo view, 'musicvideo:download', (viewItem) ->
        App.execute 'musicvideo:action', 'download', viewItem
      App.listenTo view, 'musicvideo:edit', (viewItem) ->
        App.execute 'musicvideo:edit', viewItem.model
      view


  ## When viewing a full page we call the controller
  class Show.Controller extends App.Controllers.Base

    ## The MusicVideo page.
    initialize: (options) ->
      id = parseInt options.id
      musicvideo = App.request "musicvideo:entity", id
      ## Fetch the video
      App.execute "when:entity:fetched", musicvideo, =>
        ## Get the layout.
        @layout = @getLayoutView musicvideo
        ## Listen to the show of our layout.
        @listenTo @layout, "show", =>
          @getDetailsLayoutView musicvideo
        ## Add the layout to content.
        App.regionContent.show @layout

    ## Get the base layout
    getLayoutView: (musicvideo) ->
      new Show.PageLayout
        model: musicvideo

    ## Build the details layout.
    getDetailsLayoutView: (musicvideo) ->
      headerLayout = new Show.HeaderLayout model: musicvideo
      @listenTo headerLayout, "show", =>
        teaser = new Show.DetailTeaser model: musicvideo
        API.bindTriggers teaser
        detail = new Show.Details model: musicvideo
        @listenTo detail, "show", =>
          API.bindTriggers detail
        headerLayout.regionSide.show teaser
        headerLayout.regionMeta.show detail
      @layout.regionHeader.show headerLayout

