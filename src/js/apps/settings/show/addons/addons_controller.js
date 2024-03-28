/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp.Show.Addons", function(Addons, App, Backbone, Marionette, $, _) {

  return Addons.Controller = class Controller extends App.Controllers.Base {

    initialize() {

      //# Get and setup the layout
      this.layout = this.getLayoutView();
      this.listenTo(this.layout, "show", () => {
        this.getSubNav();
        return this.getForm();
      });

      //# Render the layout
      return App.regionContent.show(this.layout);
    }

    getLayoutView() {
      return new App.SettingsApp.Show.Layout();
    }

    getSubNav() {
      const subNav = App.request('settings:subnav');
      return this.layout.regionSidebarFirst.show(subNav);
    }

    // Get the addon controller
    addonController() {
      return App.request("command:kodi:controller", 'auto', 'AddOn');
    }

    getAllAddons(callback) {
      return this.addonController().getAllAddons(callback);
    }

    getForm() {
      return this.getAllAddons(addons => {
        const options = {
          form: this.getStructure(addons),
          formState: [],
          config: {
            attributes: {class: 'settings-form'},
            callback: (data, formView) => {
              return this.saveCallback(data, formView);
            }
          }
        };
        const form = App.request("form:wrapper", options);
        return this.layout.regionContent.show(form);
      });
    }

    getStructure(addons) {
      let i;
      const form = [];
      const types = [];
      for (i in addons) {
        var addon = addons[i];
        types[addon.type] = true;
      }
      for (var type in types) {
        // Parse addons into checkboxes.
        var enabled = types[type];
        var elements = _.where(addons, {type});
        for (i in elements) {
          var el = elements[i];
          elements[i] = $.extend(el, {
            id: el.addonid,
            name: el.addonid,
            type: 'checkbox',
            defaultValue: el.enabled,
            title: el.name
          });
        }
        // Create fieldsets.
        form.push({
          title: type,
          id: type,
          children: elements
        });
      }
      return form;
    }


    // Save only changed values
    saveCallback(data, formView) {
      const updating = [];
      return this.getAllAddons(function(addons) {
        let key;
        for (key in addons) {
          var addon = addons[key];
          var {
            addonid
          } = addon;
          // If form data differs from kodi
          if (addon.enabled === !data[addonid]) {
            updating[addonid] = data[addonid];
          }
        }

        // Update all changed keys
        const commander = App.request("command:kodi:controller", 'auto', 'Commander');
        const commands = [];
        for (key in updating) {
          var val = updating[key];
          commands.push({method: 'Addons.SetAddonEnabled', params: [key, val]});
        }
        return commander.multipleCommands(commands, resp => {
          // Notify.
          return Kodi.execute("notification:show", 'Toggled ' + commands.length + ' addons');
        });
      });
    }
  };
});
