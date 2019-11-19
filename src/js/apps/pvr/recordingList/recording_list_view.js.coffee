@Kodi.module "PVR.RecordingList", (List, App, Backbone, Marionette, $, _) ->

  class List.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "pvr-page"

  class List.RecordingTeaser extends App.Views.ItemView
    template: 'apps/pvr/recordingList/recording'
    tagName: "li"
    className: 'pvr-card card'
    triggers:
      "click .play"       : "recording:play"

  class List.RecordingList extends App.Views.CollectionView
    childView: List.RecordingTeaser
    tagName: "ul"
    className: "recordings"