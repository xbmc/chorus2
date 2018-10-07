@Kodi.module "UiApp", (UiApp, App, Backbone, Marionette, $, _) ->

  ## TODO: Clean this up, it is a bit messy and needs some better abstraction.

  API =

    openModal: (titleHtml, msgHtml, open = true, style = '') ->
      ## Get the modal parts
      $title = App.getRegion('regionModalTitle').$el
      $body = App.getRegion('regionModalBody').$el
      $modal = App.getRegion('regionModal').$el
      $modal.removeClassStartsWith 'style-'
      $modal.addClass 'style-' + style
      ## Populate its content
      $title.html(titleHtml)
      $body.html(msgHtml)
      ## Open model
      if open
        $modal.modal();
      $modal.on 'hidden.bs.modal', (e) ->
        $body.html('')
      $modal

    closeModal: ->
      App.getRegion('regionModal').$el.modal('hide')
      $('.modal-body').html('')

    closeModalButton: (text = 'close') ->
      API.getButton(t.gettext(text), 'default').on('click', -> API.closeModal())

    getModalButtonContainer: ->
      App.getRegion('regionModalFooter').$el.empty()

    getButton: (text, type = 'primary') ->
      $('<button>').addClass('btn btn-' + type).text(text)

    defaultButtons: (callback) ->
      $ok = API.getButton(t.gettext('ok'), 'primary').on('click', ->
        if callback
          callback()
        API.closeModal()
      )
      API.getModalButtonContainer()
        .append(API.closeModalButton())
        .append($ok)

    confirmButtons: (callback) ->
      $ok = API.getButton(t.gettext('yes'), 'primary').on('click', ->
        if callback
          callback()
        API.closeModal()
      )
      API.getModalButtonContainer()
      .append(API.closeModalButton('no'))
      .append($ok)

    ## Toggle player menu state.
    playerMenu: (op = 'toggle') ->
      $el = $('.player-menu-wrapper')
      openClass = 'opened'
      switch op
        when 'open'
          $el.addClass(openClass)
        when 'close'
          $el.removeClass(openClass)
        else
          $el.toggleClass(openClass)

    ## Open a options modal.
    ## options is an object with a title and items, items is an array of single objects with
    ## a title and callback key. when the option is clicked the callback is called.
    ## Options are HTML (must be pre-escaped).
    buildOptions: (options) ->
      if options.length is 0
        return
      $wrap = $('<ul>').addClass('modal-options options-list')
      $option = $('<li>')
      for option in options
        $newOption = $option.clone()
        $newOption.html(option)
        $newOption.click (e) ->
          API.closeModal()
          $(@).closest('ul').find('li, span').unbind('click')
        $wrap.append($newOption)
      $wrap

  ## Open a text input modal window, callback receives the entered text.
  ## Options properties: {msgHtml: 'string', open: 'bool', defaultVal: 'string'}
  App.commands.setHandler "ui:textinput:show", (title, options = {}, callback) ->
    msg = if options.msg then options.msg else ''
    open = if options.open then true else false
    val = if options.defaultVal then options.defaultVal else ''
    $input = $('<input>', {id: 'text-input', class: 'form-control', type: 'text', value: val}).on('keyup', (e) ->
      if e.keyCode is 13 and callback
        callback( $('#text-input').val() )
        API.closeModal()
    )
    $msg = $('<p>').text(msg)
    API.defaultButtons -> callback $('#text-input').val()
    API.openModal(title, $msg, callback, open)
    el = App.getRegion('regionModalBody').$el.append($input.wrap('<div class="form-control-wrapper"></div>'))
    setTimeout ->
      el.find('input').first().focus()
    , 200
    $.material.init()

  App.commands.setHandler "ui:modal:close", ->
    API.closeModal()

  ## Open a confirm modal
  App.commands.setHandler "ui:modal:confirm", (titleHtml, msgHtml = '', callback) ->
    API.confirmButtons -> callback true
    API.openModal(titleHtml, msgHtml, true, 'confirm')

  ## Open a modal window
  App.commands.setHandler "ui:modal:show", (titleHtml, msgHtml = '', footerHtml = '', closeButton = false, style = '') ->
    API.getModalButtonContainer().html(footerHtml)
    if closeButton
      API.getModalButtonContainer().prepend API.closeModalButton()
    API.openModal(titleHtml, msgHtml, true, style)

  ## Open a form modal window
  App.commands.setHandler "ui:modal:form:show", (titleHtml, msgHtml = '', style = 'form') ->
    API.openModal(titleHtml, msgHtml, true, style)

  ## Close a modal window
  App.commands.setHandler "ui:modal:close", ->
    API.closeModal()

  ## Open a youtube video in a modal
  App.commands.setHandler "ui:modal:youtube", (titleHtml, videoid) ->
    API.getModalButtonContainer().html('')
    msgHtml = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoid + '?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>'
    API.openModal(titleHtml, msgHtml, true, 'video')

  ## Open an options modal
  App.commands.setHandler "ui:modal:options", (titleHtml, items) ->
    $options = API.buildOptions(items)
    API.openModal(titleHtml, $options, true, 'options')

  ## Toggle player menu
  App.commands.setHandler "ui:playermenu", (op) ->
    API.playerMenu op

  ## Bind closing the f#@kn dropdown on item click
  App.commands.setHandler "ui:dropdown:bind:close", ($el) ->
    $el.on "click", '.dropdown-menu li, .dropdown-menu a', (e) ->
      $(e.target).closest('.dropdown-menu').parent().removeClass('open').trigger('hide.bs.dropdown')

  ## When shell ready.
  App.vent.on "shell:ready", (options) =>
    ## Close player menu on anywhere click
    $('html').on 'click', ->
      API.playerMenu 'close'
