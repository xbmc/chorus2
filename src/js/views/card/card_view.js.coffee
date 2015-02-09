@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.CardView extends App.Views.ItemView
    template: "views/card/card"
    tagName: "li"

    events:
      "click .dropdown > i": "populateMenu"
      "click .thumbs" : "toggleThumbs"

    populateMenu: ->
      menu = ''
      if @model.get('menu')
        for key, val of @model.get('menu')
          menu += @themeTag 'li', {class: key}, val
        this.$el.find('.dropdown-menu').html(menu)

    toggleThumbs: ->
      App.request "thumbsup:toggle:entity", @model
      this.$el.toggleClass 'thumbs-up'

    attributes: ->
      classes = ['card']
      if App.request "thumbsup:check", @model
        classes.push 'thumbs-up'
      {
        class: classes.join(' ')
      }

