@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  class Views.CardView extends App.Views.ItemView
    template: "views/card/card"
    tagName: "li"

    events:
      "click .dropdown > i": "populateModelMenu"
      "click .thumbs" : "toggleThumbs"
      "click" : "toggleSelect"

    modelEvents:
      'change': 'modelChange'

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

    onBeforeRender: ->
      if !@model.get('labelHtml')?
        @model.set 'labelHtml', _.escape(@model.get('label'))
      if !@model.get('subtitleHtml')?
        @model.set 'subtitleHtml', _.escape(@model.get('subtitle'))

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