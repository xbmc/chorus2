@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.ItemView extends Backbone.Marionette.ItemView

    # Populate a dropdown menu with menu links in the model.
    menuPopulate: ->
      menu = ''
      if @model.get('menu')
        for key, val of @model.get('menu')
          menu += @themeTag 'li', {class: key}, val
        this.$el.find('.dropdown-menu').html(menu)

    ## Toggle menu open class on row. Call this in onShow().
    menuBlur: ->
      $('.dropdown', @$el).on 'show.bs.dropdown', =>
        @$el.addClass('menu-open')
      $('.dropdown', @$el).on 'hide.bs.dropdown', =>
        @$el.removeClass('menu-open')
      $('.dropdown', @$el).on 'click', ->
        $(@).removeClass('open').trigger('hide.bs.dropdown')
