@Kodi.module "LandingApp.Show", (Show, App, Backbone, Marionette, $, _) ->


  class Show.Controller extends App.Controllers.Base

    initialize: (options) ->
      @fanarts = []
      @rendered = 0
      @settings = options.settings
      @layout = @getLayoutView()
      $('body').addClass 'landing-loading'
      @listenTo @layout, "show", =>
        @content = @getContentView()
        @listenTo @content, "show", =>
          window.scroll(0, 350)
          @getSections @settings.sections
          @getSubNav @settings.subnavId
        @layout.regionContent.show @content

      App.regionContent.show @layout

    getLayoutView: ->
      new Show.Layout()

    getContentView: ->
      new Show.Page()

    getSubNav: (subnavId) ->
      subNav = App.request "navMain:children:show", subnavId, 'Sections'
      @layout.regionSidebarFirst.show subNav

    getSections: (sections) =>
      for i, section of sections
        section.idx = parseInt(i) + 1
        @getSection section

    getSection: (section) ->
      opts =
        sort: {method: section.sort, order: section.order}
        limit: {start: 0, end: section.limit}
        addFields: ['fanart']
        cache: false
        success: (collection) =>
          @rendered++
          if collection.length > 0
            @renderSection section, collection
            @getFanArts collection
      if section.filter
        opts.filter = section.filter
      App.request "#{section.entity}:entities", opts

    renderSection: (section, collection) =>
      view = App.request "#{section.entity}:list:view", collection, true
      setView = new Show.ListSet
        section: section
      App.listenTo setView, "show", =>
        setView.regionResult.show view
      @content["regionSection#{section.idx}"].show setView

    getFanArts: (collection) ->
      $hero = $("#landing-hero")
      for item in collection.toJSON()
        if item.fanart and item.fanart isnt ''
          @fanarts.push item
      if $hero.is(':visible') and @rendered is @settings.sections.length and @fanarts.length > 0
        randomModel = @fanarts[Math.floor(Math.random() * @fanarts.length)];
        $hero
          .css('background-image', 'url(' + randomModel.fanart + ')')
          .attr('href', '#' + randomModel.url).attr('title', randomModel.title)
        $('body').removeClass 'landing-loading'
