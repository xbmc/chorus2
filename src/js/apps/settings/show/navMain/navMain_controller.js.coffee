@Kodi.module "SettingsApp.Show.navMain", (NavMain, App, Backbone, Marionette, $, _) ->

  ## There is a lot of jQuery'ing happening in this file, if you require the same functionality
  ## again (draggable lists) you should abstract it in a nicer way
  class NavMain.Controller extends App.SettingsApp.Show.Base.Controller

    # Callback gets passed the collection to process
    getCollection: (callback) ->
      collection = App.request 'navMain:entities'
      $.getJSON 'lib/icons/mdi.json', (iconList) ->
        callback {
          collection: collection
          icons: iconList
        }

    # Passed the collection and returns form structure
    getStructure: (data) ->
      @data = data
      # Form header/intro
      defaults = ' <a class="nav-restore-defaults">' + t.gettext('Click here restore defaults') + '</a>'
      iconLink = '<a href="#lab/icon-browser">icons</a>'
      form = [
        title: t.gettext('Main Menu Structure')
        id: 'intro'
        children: [
          id: 'intro-text'
          type: 'markup'
          markup: t.sprintf(tr('Here you can change the title, url and %1$s for menu items. You can also remove, re-order and add new items.'), iconLink) + defaults
        ]
      ]
      # Return a form structure
      for i, item of data.collection.getRawCollection()
        item.weight = i
        row = @getRow item, data.icons
        form.push row
      form.push {
        id: 'add-another'
        class: 'add-another-wrapper'
        children: [
          {type: 'button', value: 'Add another', id: 'add-another'}
        ]
      }
      form

    # Save only changed values
    saveCallback: (formState, formView) ->
      # Parse the elements into items
      items = []
      for i, item of formState.title
        items.push {
          title: formState.title[i]
          path: formState.path[i]
          icon: formState.icon[i]
          weight: formState.weight[i]
          id: formState.id[i]
          parent: 0
        }
      # Save items, refresh page and show notification
      App.request "navMain:update:entities", items
      App.vent.trigger "navMain:refresh"
      Kodi.execute "notification:show", t.gettext('Menu updated')

    # The form has been rendered
    onReady: =>
      self = @
      $ctx = @layout.regionContent.$el
      $('.settings-form').addClass('settings-form-draggable')
      @binds()

      # Add another button callback
      $('#form-edit-add-another', $ctx).click (e) ->
        e.preventDefault()
        blank = {weight: $(".nav-item-row").length + 1, title: '', path: '', icon: 'mdi-action-extension'}
        row = self.getRow blank
        formView = App.request "form:render:items", [row]
        $(@).closest('.add-another-wrapper').before formView.render().$el
        self.binds()

      # Reordering and dragging (large screen only)
      if $(window).width() > config.getLocal('largeBreakpoint')
        $('.form-groups', $ctx).sortable({
          draggable: ".draggable-row"
          onEnd: (e) ->
            $('input[id^="form-edit-weight-"]', e.target).each (i, d) ->
              $(d).attr 'value', i
        });

      # Reset default link
      $('.nav-restore-defaults', $ctx).on "click", (e) =>
        e.preventDefault()
        App.request "navMain:update:defaults"
        @initialize()
        App.vent.trigger "navMain:refresh"

    # Things to refresh after render
    binds: ->
      $ctx = $('.settings-form')
      $('select[id^="form-edit-icon"]', $ctx).once('icon-changer').on "change", (e) ->
        $(@).closest('.group-parent', $ctx).find('i').first().attr('class', $(@).val())
      $('.remove-item', $ctx).on "click", (e) ->
        $(@).closest('.group-parent', $ctx).remove()
      $.material.init()

    # Get the form structure for a row
    getRow: (item) ->
      icons = @data.icons
      i = item.weight
      icon = '<i class="' + item.icon + '"></i>'
      {
        id: 'item-' + item.weight
        class: 'nav-item-row draggable-row'
        children: [
          {id: 'title-' + i, name: 'title[]', type: 'textfield', title: 'Title', defaultValue: item.title}
          {id: 'path-' + i, name: 'path[]', type: 'textfield', title: 'Url', defaultValue: item.path}
          {id: 'icon-' + i, name: 'icon[]', type: 'select', title: 'Icon' + icon, defaultValue: item.icon, options: icons}
          {id: 'weight-' + i, name: 'weight[]', type: 'hidden', title: '', defaultValue: i}
          {id: 'id-' + i, name: 'id[]', type: 'hidden', title: '', defaultValue: (1000 + i)}
          {id: 'remove-' + i, type: 'markup', markup: '<span class="remove-item">&times;</span>'}
        ]
      }
