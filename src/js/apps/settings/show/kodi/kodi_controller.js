/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp.Show.Kodi", (Kodi, App, Backbone, Marionette, $, _) => (function() {
  let API = undefined;
  const Cls = (Kodi.Controller = class Controller extends App.Controllers.Base {
    static initClass() {

      API = {

        // To turn an addon text field into a select with a list of available addons
        // Key is the setting id, Val is the type of addon (see #settings/addons)
        optionLookups: {
          'lookandfeel.skin': 'xbmc.gui.skin',
          'locale.language': 'kodi.resource.language',
          'screensaver.mode': 'xbmc.ui.screensaver',
          'musiclibrary.albumsscraper' : 'xbmc.metadata.scraper.albums',
          'musiclibrary.artistsscraper' : 'xbmc.metadata.scraper.artists',
          'musicplayer.visualisation' : 'xbmc.player.musicviz',
          'services.webskin' : 'xbmc.webinterface', // No don't go...
          'subtitles.tv' : 'xbmc.subtitle.module',
          'subtitles.movie' : 'xbmc.subtitle.module',
          'audiocds.encoder' : 'xbmc.audioencoder'
        },

        // Enabled actions, A trigger must be supplied for each
        actionLookups: {
          "musiclibrary.cleanup" : "command:kodi:audio:clean",
          "videolibrary.cleanup" : "command:kodi:video:clean"
        },

        // Turn the returned options into form friendly select options.
        parseOptions(options) {
          const out = {};
          $(options).each((i, option) => out[option.value] = option.label);
          return out;
        },

        // Not ideal solution to vague labels introduced in v17+
        labelRewrites(item) {
          if (item.id.lastIndexOf('videolibrary', 0) === 0) {
            item.title += ' (video)';
          }
          if (item.id.lastIndexOf('musiclibrary', 0) === 0) {
            item.title += ' (music)';
          }
          return item;
        }
      };
    }

    initialize(options) {

      // Get and setup the layout
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", () => {
        this.getSubNav();
        if (options.section) {
          return this.getSettingsForm(options.section);
        }
      });

      // Render the layout
      return App.regionContent.show(this.layout);
    }

    getLayoutView() {
      return new App.SettingsApp.Show.Layout();
    }

    getSubNav() {
      const subNav = App.request('settings:subnav');
      return this.layout.regionSidebarFirst.show(subNav);
    }

    getSettingsForm(section) {
      const formStructure = [];

      // Get the category collection
      const categoryCollection = App.request("settings:kodi:entities", {type: 'categories', section});
      return App.execute("when:entity:fetched", categoryCollection, () => {

        // Do a multi lookup to get all settings for this section.
        const categoryNames = categoryCollection.pluck("id");
        const categories = categoryCollection.toJSON();
        return App.request("settings:kodi:filtered:entities", {
          type: 'settings',
          section,
          categories: categoryNames,

          // Category settings fetched.
          callback: categorySettings => {
            // Build a fieldset for each section
            $(categories).each((i, category) => {
              // only if not empty.
              const items = this.mapSettingsToElements(categorySettings[category.id]);
              if (items.length > 0) {
                return formStructure.push({
                  title: category.title,
                  id: category.id,
                  children: items
                });
              }
          });

            // Render the form
            return this.getForm(section, formStructure);
          }
        }
        );
      });
    }


    getForm(section, formStructure) {
      const options = {
        form: formStructure,
        config: {
          attributes: {class: 'settings-form'},
          callback: (data, formView) => {
            return this.saveCallback(data, formView);
          }
        }
      };
      const form = App.request("form:wrapper", options);
      return this.layout.regionContent.show(form);
    }

    // Turn a group of addon types into an array for form options
    getAddonOptions(elId, value) {
      const mappedType = API.optionLookups[elId];
      const options = [];
      const lookup = {};
      if (mappedType) {
        const addons = App.request('addon:enabled:addons');
        const filteredAddons = _.where(addons, {type: mappedType});
        for (var i in filteredAddons) {
          // Key by addon id, Value is name
          var addon = filteredAddons[i];
          options.push({value: addon.addonid, label: addon.name});
          lookup[addon.addonid] = true;
        }
        // If value isn't in the options, we add it
        if (!lookup[value]) {
          options.push({value, label: value});
        }
        return options;
      }
      return false;
    }

    // Map Kodi types to form types in the web form
    mapSettingsToElements(items) {
      const elements = [];

      // For each setting.
      $(items).each((i, item) => {
        let options;
        let type = null;

        // Get type
        switch (item.type) {
          case 'boolean':
            type = 'checkbox';
            break;
          case 'path':
            type = 'textfield';
            break;
          case 'addon':
            options = this.getAddonOptions(item.id, item.value);
            if (options) {
              item.options = options;
            } else {
              type = 'textfield';
            }
            break;
          case 'integer':
            type = 'textfield';
            break;
          case 'string':
            type = 'textfield';
            break;
          case 'action':
            if (API.actionLookups[item.id]) {
              type = 'button';
              item.value = item.label;
              item.trigger = API.actionLookups[item.id];
            } else {
              type = 'hide';
            }
            break;
          default:
            type = 'hide';
        }

        if (item.options) {
          type = 'select';
          item.options = API.parseOptions(item.options);
        }

        // Update vague labels
        item = API.labelRewrites(item);

        if (type === 'hide') {
          return console.log('no setting to field mapping for: ' + item.type + ' -> ' + item.id);
        } else {
          item.type = type;
          item.defaultValue = item.value;

          // add to elements
          return elements.push(item);
        }
      });

      return elements;
    }

    saveCallback(data, formView) {
      return App.execute("settings:kodi:save:entities", data, resp => {
        App.execute("notification:show", t.gettext("Saved Kodi settings"));
        App.vent.trigger("config:local:updated", {});
        return App.vent.trigger("config:kodi:updated", data);
      });
    }
  });
  Cls.initClass();
  return Cls;
})());
