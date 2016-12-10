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

    ## Trigger watched and pass the view so the dom can be actioned on.
    toggleWatched: (e) ->
      @trigger "toggle:watched", {view: @}

    ## Adds the watched class if required
    watchedAttributes: (baseClass = '')->
      classes = [baseClass]
      if App.request "thumbsup:check", @model
        classes.push 'thumbs-up'
      if helpers.entities.isWatched @model
        classes.push 'is-watched'
      {
        class: classes.join(' ')
      }