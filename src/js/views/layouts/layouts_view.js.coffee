@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.LayoutWithSidebarFirstView extends App.Views.LayoutView
    template: "views/layouts/layout_with_sidebar_first"
    regions:
      regionSidebarFirst:  ".region-first"
      regionContent:  ".region-content"


  class Views.LayoutWithHeaderView extends App.Views.LayoutView
    template: "views/layouts/layout_with_header"
    regions:
      regionHeader:  ".region-header"
      regionContentTop:  ".region-content-top"
      regionContent:  ".region-content"


  class Views.LayoutDetailsHeaderView extends App.Views.LayoutView
    template: "views/layouts/layout_details_header"
    regions:
      regionSide:  ".region-details-side"
      regionTitle:  ".region-details-title"
      regionMeta: ".region-details-meta" ## Using this region removes the below regions.
      regionMetaSideFirst:  ".region-details-meta-side-first"
      regionMetaSideSecond:  ".region-details-meta-side-second"
      regionMetaBelow:  ".region-details-meta-below"
      regionFanart:  ".region-details-fanart"
    onRender: ->
      $('.region-details-fanart', @$el).css('background-image', 'url("' + @model.get('fanart') + '")')
