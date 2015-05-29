@Kodi.module "EPGApp.List", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "epg-page"

  class List.ProgrammeList extends App.Views.ItemView
    template: 'apps/epg/list/programmes'
    tagName: "li"
    className: "programme"
    onRender: ->
      ## Add a class to indicate the programme has finished
      if this.model.attributes.wasactive then this.$el.addClass("aired")

  class List.EPGList extends App.Views.CollectionView
    childView: List.ProgrammeList
    tagName: "ul"
    className: "programmes"
    onShow: ->
      $(window).scrollTop(this.$el.find('.airing').offset().top-150)
