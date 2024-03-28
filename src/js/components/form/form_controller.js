/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Components.Form", function(Form, App, Backbone, Marionette, $, _) {

  Form.Controller = class Controller extends App.Controllers.Base {

    initialize(options = {}) {
      const config = options.config ? options.config : {};

      this.formLayout = this.getFormLayout(config);

      this.listenTo(this.formLayout, "show", () => {
        this.formBuild(options.form, options.formState, config);
        $.material.init();
        if (config && (typeof config.onShow === 'function')) {
          return config.onShow(options);
        }
      });

      this.listenTo(this.formLayout, "form:submit", () => {
        return this.formSubmit(options);
      });

      return this;
    }

    formSubmit(options) {
      let data = Backbone.Syphon.serialize(this.formLayout);
      data = App.request("form:value:entities", options.form, data);
      return this.processFormSubmit(data, options);
    }

    processFormSubmit(data, options) {
      if (options.config && (typeof options.config.callback === 'function')) {
        return options.config.callback(data, this.formLayout);
      }
    }

    getFormLayout(options = {}) {
      return new Form.FormWrapper({
        config: options});
    }

    formBuild(form = [], formState = {}, options = {}) {
      const collection = App.request("form:item:entities", form, formState);
      const buildView = new Form.Groups({
        collection});
      return this.formLayout.formContentRegion.show(buildView);
    }
  };


  App.reqres.setHandler("form:render:items", function(form, formState, options = {}) {
    const collection = App.request("form:item:entities", form, formState);
    return new Form.Groups({
      collection});
  });

  App.reqres.setHandler("form:wrapper", function(options = {}) {
    const formController = new Form.Controller(options);
    return formController.formLayout;
  });

  return App.reqres.setHandler("form:popup:wrapper", function(options = {}) {
    const originalCallback = options.config.callback;
    options.config.callback = function(data, layout) {
      App.execute("ui:modal:close");
      return originalCallback(data, layout);
    };
    const formController = new Form.Controller(options);
    const formContent = formController.formLayout.render().$el;
    formController.formLayout.trigger('show');
    const popupStyle = options.config.editForm ? 'edit-form' : 'form';
    const titleHtml = options.titleHtml != null ? options.titleHtml : _.escape(options.title);
    return App.execute("ui:modal:form:show", titleHtml, formContent, popupStyle);
  });
});

