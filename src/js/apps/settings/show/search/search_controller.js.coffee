@Kodi.module "SettingsApp.Show.Search", (Search, App, Backbone, Marionette, $, _) ->

  class Search.Controller extends App.SettingsApp.Show.Base.Controller

    # Callback gets passed the collection to process
    getCollection: (callback) ->
      @collection = App.request 'searchAddons:entities'
      callback @collection

    # Passed the collection and returns form structure
    getStructure: (data) ->
      @data = data
      # Form header/intro
      form = [
        title: t.gettext('Custom Add-on search')
        id: 'intro'
        children: [
          id: 'intro-text'
          type: 'markup'
          markup: t.sprintf(tr("Add custom add-on searches"), '<a href="#help/addons">' + tr('Add-ons help page') + '</a>')
        ]
      ]
      # Return a form structure
      items = @collection.toJSON()
      if items.length is 0
        items.push @getBlank(items.length)
      for i, item of items
        item.weight = i
        row = @getRow item
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
          url: formState.url[i]
          media: formState.media[i]
          weight: formState.weight[i]
          id: formState.id[i]
        }
      # Save items, refresh page and show notification
      App.request "searchAddons:update:entities", items
      Kodi.execute "notification:show", t.gettext('Custom Addon search updated')

    # The form has been rendered
    onReady: =>
      self = @
      $ctx = @layout.regionContent.$el
      $('.settings-form').addClass('settings-form-draggable')
      @binds()

      # Reordering and dragging
      $('.form-groups', $ctx).sortable({
        draggable: ".draggable-row"
        onEnd: (e) ->
          $('input[id^="form-edit-weight-"]', e.target).each (i, d) ->
            $(d).attr 'value', i
      });

      # Add another button callback
      $('#form-edit-add-another', $ctx).click (e) ->
        e.preventDefault()
        blank = self.getBlank $(".item-row").length
        row = self.getRow blank
        formView = App.request "form:render:items", [row]
        $(@).closest('.add-another-wrapper').before formView.render().$el
        self.binds()

      # Reset default link
      $('.restore-defaults', $ctx).on "click", (e) =>
        # this should clear all.

    getBlank: (weight) ->
      {weight: weight, title: '', url: '', media: 'music'}

    # Things to refresh after render
    binds: ->
      $ctx = $('.settings-form')
      $('.remove-item', $ctx).on "click", (e) ->
        $(@).closest('.group-parent', $ctx).remove()
      $.material.init()

    # Get the form structure for a row
    getRow: (item) ->
      i = item.weight
      {
        id: 'item-' + item.weight
        class: 'item-row draggable-row'
        children: [
          {id: 'title-' + i, name: 'title[]', type: 'textfield', title: 'Title', defaultValue: item.title}
          {id: 'url-' + i, name: 'url[]', type: 'textfield', title: 'Url', defaultValue: item.url}
          {id: 'media-' + i, name: 'media[]', type: 'select', title: 'Media', defaultValue: item.media, options: {music: 'Music', video: 'Video'}}
          {id: 'weight-' + i, name: 'weight[]', type: 'hidden', title: '', defaultValue: i}
          {id: 'id-' + i, name: 'id[]', type: 'hidden', title: '', defaultValue: 'custom.addon.' + i}
          {id: 'remove-' + i, type: 'markup', markup: '<span class="remove-item">&times;</span>'}
        ]
      }
