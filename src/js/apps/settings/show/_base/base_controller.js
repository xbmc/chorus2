// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SettingsApp.Show.Base", function(SettingsBase, App, Backbone, Marionette, $, _) {

  return SettingsBase.Controller = class Controller extends App.Controllers.Base {

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

    // Builds the form and adds it to the layout
    getForm() {
      return this.getCollection(collection => {
        const options = {
          form: this.getStructure(collection),
          formState: [],
          config: {
            attributes: {class: 'settings-form'},
            callback: (formState, formView) => {
              return this.saveCallback(formState, formView);
            },
            onShow: () => {
              return this.onReady();
            }
          }
        };
        const form = App.request("form:wrapper", options);
        return this.layout.regionContent.show(form);
      });
    }


    //# Override the following methods in your sub class ##

    // Callback gets passed the collection to process
    getCollection(callback) {
      // Return a collection of items
      const res = {};
      return callback(res);
    }

    // Passed the collection and returns form structure
    getStructure(collection) {
      // Return a form structure
      return [];
    }

    // Save only changed values
    saveCallback(formState, formView) {}
      // Processes the form state and save the changes

    // Called when form is rendered
    onReady() {
      // Bind onto any form elements added.
      return this.layout;
    }
  };
});
