@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.CardView extends App.Views.ItemView
    template: "views/card/card"
    tagName: "li"

    events:
      "click .dropdown > i": "populateMenu"
      "click .thumbs" : "toggleThumbs"
      "click" : "toggleSelect"

    modelEvents:
      'change': 'modelChange'

    populateMenu: ->
      menu = ''
      if @model.get('menu')
        for key, val of @model.get('menu')
          if key.lastIndexOf('divider', 0) is 0
            key = 'divider'
          menu += @themeTag 'li', {class: key}, val
        this.$el.find('.dropdown-menu').html(menu)

    toggleThumbs: ->
      App.request "thumbsup:toggle:entity", @model
      this.$el.toggleClass 'thumbs-up'

    attributes: ->
      classes = ['card', 'card-loaded']
      if App.request "thumbsup:check", @model
        classes.push 'thumbs-up'
      {
        class: classes.join(' ')
      }

    onRender: ->
      @$el.data('model', @model)

    onShow: ->
      $('.dropdown', @$el).on 'click', ->
        $(@).removeClass('open').trigger('hide.bs.dropdown')

    ## Make the links external
    makeLinksExternal: ->
      $('.title, .thumb', @$el).attr('href', @model.get('url')).attr('target', '_blank')

    ## This triggers when a model has been updated, instances can add updates to setMeta()
    ## so init is not used (which doesn't get called on a re-render)
    modelChange: ->
      if _.isFunction @setMeta
        @setMeta()
      @render()


  class Views.CardViewPlaceholder extends App.Views.ItemView
    template: "views/card/card_placeholder"
    attributes: ->
      {
        class: 'card ph'
      }
    onRender: ->
      @$el.data('model', @model)