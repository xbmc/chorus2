@Kodi.module "Components.Form", (Form, App, Backbone, Marionette, $, _) ->


  ## Full form wrapper
  class Form.FormWrapper extends App.Views.LayoutView
    template: "components/form/form"
    tagName: "form"
		
    regions:
      formContentRegion: ".form-content-region"
      formResponse:      ".response"

    triggers:
      "click .form-save"  								: "form:submit"
      "click [data-form-button='cancel']"	: "form:cancel"
		
    modelEvents:
      "change:_errors" 	: "changeErrors"
      "sync:start"			:	"syncStart"
      "sync:stop"				:	"syncStop"
		
    initialize: ->
      @config = @options.config
      @on "form:save", (msg) =>
        @addSuccessMsg(msg)

    attributes: ->
      attrs = {class: 'component-form'}
      if @options.config and @options.config.attributes
        attrs = _.extend attrs, @options.config.attributes
      attrs

    onRender: ->
      _.defer =>
        @focusFirstInput() if @config.focusFirstInput
        $('.btn').ripples({color: 'rgba(255,255,255,0.1)'})
        App.vent.trigger "form:onshow", @config
        # Bind button triggers
        $('.form-item .form-button', @$el).on 'click', (e) ->
          e.preventDefault()
          if $(@).data('trigger')
            App.execute $(@).data('trigger')
        if @config.tabs
          @makeTabs @$el

    focusFirstInput: ->
      @$(":input:visible:enabled:first").focus()

    changeErrors: (model, errors, options) ->
      if @config.errors
        if _.isEmpty(errors) then @removeErrors() else @addErrors errors

    removeErrors: ->
      @$(".error").removeClass("error").find("small").remove()
		
    addErrors: (errors = {}) ->
      for name, array of errors
        @addError name, array[0]

    addError: (name, error) ->
      el = @$("[name='#{name}']")
      sm = $("<small>").text(error)
      el.after(sm).closest(".row").addClass("error")

    addSuccessMsg: (msg) ->
      $el = $(".response", @$el)
      $el.html(msg).show()
      setTimeout((->
        $el.fadeOut()
      ), 5000)

    makeTabs: ($ctx) ->
      $tabs = $('<ul>').addClass 'form-tabs'
      $('.group-title', $ctx).each (i, d) ->
        $('<li>')
        .html($(d).html())
        .click (e) ->
          $('.group-parent').hide()
          $(d).closest('.group-parent').show()
          $(e.target).closest('.form-tabs').find('li').removeClass('active')
          $(e.target).addClass('active')
        .appendTo($tabs)
      $('.form-groups', $ctx).before($tabs)
      $tabs.find('li').first().trigger('click')
      $ctx.addClass('with-tabs')

  ## Form item element - very basic copy of drupals form api format
  class Form.Item extends App.Views.ItemView
    template: 'components/form/form_item'
    tagName: 'div'

    initialize: ->
      # Base and base material attributes
      name = if @model.get('name') then @model.get('name') else @model.get('id')
      baseAttrs = _.extend({id: 'form-edit-' + @model.get('id'), name: name, class: ''}, @model.get('attributes'))
      materialBaseAttrs = _.extend {}, baseAttrs
      materialBaseAttrs.class += ' form-control'

      # Create an element based on the type, extending base attrs
      switch @model.get('type')

        when 'checkbox'
          attrs = {type: 'checkbox', value: 1, class: 'form-checkbox'}
          if @model.get('defaultValue') is true
            attrs.checked = 'checked'
          el = @themeTag 'input', _.extend(baseAttrs, attrs), ''

        when 'textfield', 'number', 'date'
          inputType = if @model.get('type') is 'textfield' then 'text' else @model.get('type')
          attrs = {type: inputType, value: @model.get('defaultValue')}
          el = @themeTag 'input', _.extend(materialBaseAttrs, attrs), ''

        when 'hidden'
          attrs = {type: 'hidden', value: @model.get('defaultValue'), class: 'form-hidden'}
          el = @themeTag 'input', _.extend(baseAttrs, attrs), ''

        when 'button'
          attrs = {class: 'form-button btn btn-secondary'}
          if @model.get('trigger')
            attrs['data-trigger'] = @model.get('trigger')
          el = @themeTag 'button', _.extend(baseAttrs, attrs), @model.get('value')

        when 'textarea'
          el = @themeTag 'textarea', materialBaseAttrs, @model.get('defaultValue')

        when 'markup'
          attrs = {class: 'form-markup'}
          el = @themeTag 'div', attrs, @model.get('markup')

        when 'select'
          options = ''
          for key, val of @model.get('options')
            attrs = {value: key}
            value = @model.get('defaultValue')
            if String(value) is String(key)
              attrs.selected = 'selected'
            options += @themeTag 'option', attrs, val
          el = @themeTag 'select', _.extend(baseAttrs, class: 'form-control'), options

        else
          el = null

      if el
        @model.set({element: el})

    attributes: ->
      elClasses = []
      elAttrs = @model.get('attributes')
      if elAttrs.class
        elClasses = _.map elAttrs.class.split(' '), (c) -> 'form-item-' + c
      {class: 'form-item form-group form-type-' + @model.get('type') + ' form-edit-' + @model.get('id') + ' ' + elClasses.join(' ')}

    onRender: ->
      _.defer =>
        if @model.get('prefix')
          @$el.before @model.get('prefix')
        if @model.get('suffix')
          @$el.after @model.get('suffix')

  ## Form item list
  class Form.Group extends App.Views.CompositeView
    template: 'components/form/form_item_group'
    tagName: 'div'
    childView: Form.Item
    childViewContainer: '.form-items'
    attributes: ->
      {
        class: 'form-group group-parent ' + @model.get('class')
      }
    initialize: ->
      children = @model.get('children')
      if children.length is 0
        @model.set('title', '')
      else
        @collection = children

  class Form.Groups extends App.Views.CollectionView
    childView: Form.Group
    className: 'form-groups'