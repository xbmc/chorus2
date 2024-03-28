@Kodi.module "LabApp.IconBrowser", (lab, App, Backbone, Marionette, $, _) ->

  class lab.IconsPage extends App.Views.LayoutView
    template: 'apps/lab/iconBrowser/icon_browser_page'
    tagName: "div"
    className: "icon-browser page"
    onRender: ->
      for type in ['material', 'custom']
        $ctx = $('#icons-' + type, @$el)
        set = type + 'Icons'
        for icoClass, name of @options[set]
          $ico = $('<li><i class="' + icoClass + '"></i><span>' + name + '</span><small>' + icoClass + '</small></li>')
          $ctx.append $ico
