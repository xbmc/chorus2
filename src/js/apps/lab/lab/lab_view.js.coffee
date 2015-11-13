# View for the Lab.
#
# @param [Object] This app object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "LabApp.lab", (lab, App, Backbone, Marionette, $, _) ->

  # A single lab item
  class lab.labItem extends App.Views.ItemView
    className: "lab--item"
    template: 'apps/lab/lab/lab_item'
    tagName: "div"

  # List of lab items
  class lab.labItems extends App.Views.CollectionView
    tagName: "div"
    className: "lab--items page"
    childView: lab.labItem
    onRender: ->
      @$el.prepend $('<h3>').html( t.gettext('Experimental code, use at own risk') )
      @$el.prepend $('<h2>').html( t.gettext('The Lab') )
      @$el.addClass('page-secondary')

