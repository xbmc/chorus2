@Kodi.module "SettingsApp.Show.Kodi", (Kodi, App, Backbone, Marionette, $, _) ->

  class Kodi.Controller extends App.Controllers.Base

    API =

      # To turn an addon text field into a select with a list of available addons
      # Key is the setting id, Val is the type of addon (see #settings/addons)
      optionLookups:
        'lookandfeel.skin': 'xbmc.gui.skin'
        'locale.language': 'kodi.resource.language'
        'screensaver.mode': 'xbmc.ui.screensaver'
        'musiclibrary.albumsscraper' : 'xbmc.metadata.scraper.albums'
        'musiclibrary.artistsscraper' : 'xbmc.metadata.scraper.artists'
        'musicplayer.visualisation' : 'xbmc.player.musicviz'
        'services.webskin' : 'xbmc.webinterface' # No don't go...
        'subtitles.tv' : 'xbmc.subtitle.module'
        'subtitles.movie' : 'xbmc.subtitle.module'
        'audiocds.encoder' : 'xbmc.audioencoder'


      # Turn the returned options into form friendly select options.
      parseOptions: (options) ->
        out = {}
        $(options).each (i, option) ->
          out[option.value] = option.label
        out

    initialize: (options) ->

      # Get and setup the layout
      @layout = @getLayoutView()
      @listenTo @layout, "show", =>
        @getSubNav()
        if options.section
          @getSettingsForm options.section

      # Render the layout
      App.regionContent.show @layout

    getLayoutView: ->
      new App.SettingsApp.Show.Layout()

    getSubNav: ->
      subNav = App.request 'settings:subnav'
      @layout.regionSidebarFirst.show subNav

    getSettingsForm: (section) ->
      formStructure = []

      # Get the category collection
      categoryCollection = App.request "settings:kodi:entities", {type: 'categories', section: section}
      App.execute "when:entity:fetched", categoryCollection, =>

        # Do a multi lookup to get all settings for this section.
        categoryNames = categoryCollection.pluck("id")
        categories = categoryCollection.toJSON()
        App.request "settings:kodi:filtered:entities",
          type: 'settings',
          section: section,
          categories: categoryNames

          # Category settings fetched.
          callback: (categorySettings) =>
            # Build a fieldset for each section
            $(categories).each (i, category) =>
              # only if not empty.
              items = @mapSettingsToElements(categorySettings[category.id])
              if items.length > 0
                formStructure.push {
                  title: category.title,
                  id: category.id,
                  children: items
                }

            # Render the form
            @getForm section, formStructure


    getForm: (section, formStructure) ->
      options = {
        form: formStructure
#        formState: {}
        config:
          attributes: {class: 'settings-form'}
          callback: (data, formView) =>
            @saveCallback(data, formView)
      }
      form = App.request "form:wrapper", options
      @layout.regionContent.show form

    # Turn a group of addon types into an array for form options
    getAddonOptions: (elId, value) ->
      mappedType = API.optionLookups[elId]
      options = []
      lookup = {}
      if mappedType
        addons = App.request 'addon:enabled:addons'
        filteredAddons = _.where(addons, {type: mappedType})
        for i, addon of filteredAddons
          # Key by addon id, Value is name
          options.push {value: addon.addonid, label: addon.name}
          lookup[addon.addonid] = true
        # If value isn't in the options, we add it
        if not lookup[value]
          options.push {value: value, label: value}
        return options
      false

    # Map Kodi types to form types in the web form
    mapSettingsToElements: (items) ->
      elements = []

      # For each setting.
      $(items).each (i, item) =>
        type = null

        # Get type
        switch item.type
          when 'boolean'
            type = 'checkbox'
          when 'path'
            type = 'textfield'
          when 'addon'
            options = @getAddonOptions item.id, item.value
            if options
              item.options = options
            else
              type = 'textfield'
          when 'integer'
            type = 'textfield'
          when 'string'
            type = 'textfield'
          else
            type = 'hide'

        if item.options
          type = 'select'
          item.options = API.parseOptions item.options

        if type is 'hide'
          console.log 'no setting to field mapping for: ' + item.type + ' -> ' + item.id
        else
          item.type = type
          item.defaultValue = item.value

          # add to elements
          elements.push item

      elements

    saveCallback: (data, formView) ->
      App.execute "settings:kodi:save:entities", data, (resp) =>
        App.execute "notification:show", t.gettext("Saved Kodi settings")
        App.vent.trigger "config:local:updated", {}
        App.vent.trigger "config:kodi:updated", data
