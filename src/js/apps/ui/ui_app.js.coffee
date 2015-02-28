@Kodi.module "UiApp", (UiApp, App, Backbone, Marionette, $, _) ->

  API =

    openModal: (title, msg, open = true, style = '') ->
      ## Get the modal parts
      $title = App.getRegion('regionModalTitle').$el
      $body = App.getRegion('regionModalBody').$el
      $modal = App.getRegion('regionModal').$el
      $modal.removeClassStartsWith 'style-'
      $modal.addClass 'style-' + style
      ## Populate its content
      $title.html(title)
      $body.html(msg)
      ## Open model
      if open
        $modal.modal();
      $modal.on 'hidden.bs.modal', (e) ->
        $body.html('')
      $modal

    closeModal: ->
      App.getRegion('regionModal').$el.modal('hide')
      $('.modal-body').html('')

    closeModalButton: ->
      API.getButton('Close', 'default').on('click', -> API.closeModal())

    getModalButtonContainer: ->
      App.getRegion('regionModalFooter').$el.empty()

    getButton: (text, type = 'primary') ->
      $('<button>').addClass('btn btn-' + type).html(text)

    defaultButtons: (callback) ->
      $ok = API.getButton('Ok', 'primary').on('click', ->
        if callback
          callback()
        API.closeModal()
      )
      API.getModalButtonContainer()
        .append(API.closeModalButton())
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


  ## Open a text input modal window, callback recieves the entered text.
  App.commands.setHandler "ui:textinput:show", (title, msg = '', callback, open = true) ->
    $input = $('<input>', {id: 'text-input', class: 'form-control', type: 'text'}).on('keyup', (e) ->
      if e.keyCode is 13 and callback
        callback( $('#text-input').val() )
        API.closeModal()
    )
    $msg = $('<p>').html(msg)
    API.defaultButtons -> callback $('#text-input').val()
    API.openModal(title, $msg, callback, open)
    App.getRegion('regionModalBody').$el.append($input.wrap('<div class="form-control-wrapper"></div>')).find('input').first().focus()
    $.material.init()

  App.commands.setHandler "ui:modal:close", ->
    API.closeModal()

  ## Open a modal window
  App.commands.setHandler "ui:modal:show", (title, msg = '', footer = '') ->
    API.getModalButtonContainer().html(footer)
    API.openModal(title, msg, open)

  ## Open a form modal window
  App.commands.setHandler "ui:modal:form:show", (title, msg = '') ->
    API.openModal(title, msg, true, 'form')

  ## Close a modal window
  App.commands.setHandler "ui:modal:close", ->
    API.closeModal()

  ## Open a youtube video in a model
  App.commands.setHandler "ui:modal:youtube", (title, videoid) ->
    API.getModalButtonContainer().html('')
    msg = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoid + '?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>'
    API.openModal(title, msg, true, 'video')

  ## Open a youtube video in a model
  App.commands.setHandler "ui:playermenu", (op) ->
    API.playerMenu op

  ## When shell ready.
  App.vent.on "shell:ready", (options) =>
    ## Close player menu on anywhere click
    $('html').on 'click', ->
      API.playerMenu 'close'
