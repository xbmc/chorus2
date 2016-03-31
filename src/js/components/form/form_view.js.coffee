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

    onShow: ->
      _.defer =>
        @focusFirstInput() if @config.focusFirstInput
        $('.btn').ripples({color: 'rgba(255,255,255,0.1)'})
        App.vent.trigger "form:onshow", @config

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


  ## Form item element - very basic copy of drupals form api format
  class Form.Item extends App.Views.ItemView
    template: 'components/form/form_item'
    tagName: 'div'

    initialize: ->
      # Base and base material attributes
      name = if @model.get('name') then @model.get('name') else @model.get('id')
      baseAttrs = _.extend({id: 'form-edit-' + @model.get('id'), name: name}, @model.get('attributes'))
      materialBaseAttrs = _.extend(baseAttrs, class: 'form-control')

      # Create an element based on the type, extending base attrs
      switch @model.get('type')

        when 'checkbox'
          attrs = {type: 'checkbox', value: 1, class: 'form-checkbox'}
          if @model.get('defaultValue') is true
            attrs.checked = 'checked'
          el = @themeTag 'input', _.extend(baseAttrs, attrs), ''

        when 'textfield'
          attrs = {type: 'text', value: @model.get('defaultValue')}
          el = @themeTag 'input', _.extend(materialBaseAttrs, attrs), ''

        when 'hidden'
          attrs = {type: 'hidden', value: @model.get('defaultValue'), class: 'form-hidden'}
          el = @themeTag 'input', _.extend(baseAttrs, attrs), ''

        when 'button'
          attrs = {class: 'form-button btn btn-secondary'}
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
      {class: 'form-item form-group form-type-' + @model.get('type') + ' form-edit-' + @model.get('id')}

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