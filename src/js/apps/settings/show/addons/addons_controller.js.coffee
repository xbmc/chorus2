@Kodi.module "SettingsApp.Show.Addons", (Addons, App, Backbone, Marionette, $, _) ->

  class Addons.Controller extends App.Controllers.Base

    initialize: ->

      ## Get and setup the layout
      @layout = @getLayoutView()
      @listenTo @layout, "show", =>
        @getSubNav()
        @getForm()

      ## Render the layout
      App.regionContent.show @layout

    getLayoutView: ->
      new App.SettingsApp.Show.Layout()

    getSubNav: ->
      subNav = App.request 'settings:subnav'
      @layout.regionSidebarFirst.show subNav

    # Get the addon controller
    addonController: ->
      App.request "command:kodi:controller", 'auto', 'AddOn'

    getAllAddons: (callback) ->
      @addonController().getAllAddons callback

    getForm: ->
      @getAllAddons (addons) =>
        options = {
          form: @getStructure(addons)
          formState: []
          config:
            attributes: {class: 'settings-form'}
            callback: (data, formView) =>
              @saveCallback(data, formView)
        }
        form = App.request "form:wrapper", options
        @layout.regionContent.show form

    getStructure: (addons) ->
      form = []
      types = []
      for i, addon of addons
        types[addon.type] = true
      for type, enabled of types
        # Parse addons into checkboxes.
        elements = _.where(addons, {type: type})
        for i, el of elements
          elements[i] = $.extend el, {
            id: el.addonid
            type: 'checkbox'
            defaultValue: el.enabled
            title: el.name
          }
        # Create fieldsets.
        form.push {
          title: type
          id: type
          children: elements
        }
      form


    # Save only changed values
    saveCallback: (data, formView) ->
      updating = []
      @getAllAddons (addons) =>
        for key, addon of addons
          addonid = addon.addonid
          # If form data differs from kodi
          if addon.enabled is not data[addonid]
            updating[addonid] = data[addonid]

        # Update all changed keys
        commander = App.request "command:kodi:controller", 'auto', 'Commander'
        commands = []
        for key, val of updating
          commands.push {method: 'Addons.SetAddonEnabled', params: [key, val]}
        commander.multipleCommands commands, (resp) =>
          # Notify.
          Kodi.execute "notification:show", 'Toggled ' + commands.length + ' addons'
