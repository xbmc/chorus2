@Kodi.module "EPGApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "epg-page"

  class List.ChannelActions extends App.Views.ItemView
    template: 'apps/epg/list/channel'
    className: 'nav-sub'
    triggers:
      'click .play'         : 'broadcast:play'
    events:
      'click .record'       : 'toggleRecord'
    toggleRecord: ->
      console.log $('.airing')
      $('.airing').toggleClass 'has-timer'
      @trigger 'broadcast:record', @

  class List.ProgrammeList extends App.Views.ItemView
    template: 'apps/epg/list/programme'
    tagName: "li"
    className: "pvr-card card"
    onRender: ->
      ## Add a class to indicate the programme has finished
      if @model.attributes.wasactive then @$el.addClass("aired")
      if @model.attributes.isactive then @$el.addClass("airing")
      if @model.attributes.hastimer then @$el.addClass("has-timer")
    triggers:
      'click .play'         : 'broadcast:play'
    events:
      'click .record'       : 'toggleRecord'
      'click .toggle-timer' : 'toggleTimer'
    toggleRecord: ->
      @$el.toggleClass 'has-timer'
      @trigger 'broadcast:record', @
    toggleTimer: ->
      @$el.toggleClass 'has-timer'
      @trigger 'broadcast:timer', @


  class List.EPGList extends App.Views.CollectionView
    childView: List.ProgrammeList
    tagName: "ul"
    className: "programmes"
    emptyView: App.Views.EmptyViewResults
    emptyViewOptions:
      emptyKey: 'EPG data'
    onShow: ->
      $airing = @$el.find('.airing')
      if $airing.length
        $(window).scrollTop($airing.offset().top-150)
