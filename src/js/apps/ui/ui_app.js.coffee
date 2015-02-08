@Kodi.module "UiApp", (UiApp, App, Backbone, Marionette, $, _) ->

  API =

    openModal: (title, msg, callback) ->
      @closeModal()
      ## Get the modal parts
      $title = App.getRegion('regionModalTitle').$el
      $body = App.getRegion('regionModalBody').$el
      $modal = App.getRegion('regionModal').$el
      ## Populate its content
      $title.html(title)
      $body.html(msg)
      ## Open model
      $modal.modal();
      $modal

    closeModal: ->
      App.getRegion('regionModal').$el.modal('hide')

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


  ## Open a text input modal window, callback recieves the entered text.
  App.commands.setHandler "ui:textinput:show", (title, msg = '', callback) ->
    API.closeModal()
    $input = $('<input>', {id: 'text-input', class: 'form-control', type: 'text'}).on('keyup', (e) ->
      if e.keyCode is 13 and callback
        callback( $('#text-input').val() )
        API.closeModal()
    )
    $msg = $('<p>').html(msg)
    API.defaultButtons -> callback $('#text-input').val()
    API.openModal(title, $msg, callback)
    App.getRegion('regionModalBody').$el.append($input.wrap('<div class="form-control-wrapper"></div>')).find('input').first().focus()
    $.material.init()

  App.commands.setHandler "ui:modal:close", ->
    API.closeModal()

  ## Open a modal window
  App.commands.setHandler "ui:modal:show", (title, msg = '') ->
    API.openModal(title, msg)

  ## Close a modal window
  App.commands.setHandler "ui:modal:close", ->
    API.closeModal()