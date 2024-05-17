// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Controller for the API Browser.
//
// An app that allows you to get all the methods from the api
// and execute them
//
// @param [Object] This app object
// @param [Object] The full application object
// @param [Object] Backbone
// @param [Object] Marionette
// @param [Object] jQuery
// @param [Object] lodash (underscore)
//
this.Kodi.module("LabApp.apiBrowser", function(apiBrowser, App, Backbone, Marionette, $, _) {

  // Main controller
  return apiBrowser.Controller = class Controller extends App.Controllers.Base {

    initialize() {
      const collection = App.request("introspect:entities");
      return App.execute("when:entity:fetched", collection, () => {
        collection.dictionary = App.request("introspect:dictionary");

        this.layout = this.getLayoutView(collection);

        this.listenTo(this.layout, "show", () => {
          this.renderList(collection);
          if (this.options.method) {
            return this.renderPage(this.options.method, collection);
          } else {
            return this.renderLanding();
          }
        });

        return App.regionContent.show(this.layout);
      });
    }

    getLayoutView(collection) {
      return new apiBrowser.Layout({
        collection});
    }

    renderList(collection) {
      const view = new apiBrowser.apiMethods({
        collection});
      this.listenTo(view, 'childview:lab:apibrowser:method:view', item => {
        return this.renderPage(item.model.get('id'), collection);
      });
      return this.layout.regionSidebarFirst.show(view);
    }

    renderPage(id, collection) {
      const model = App.request("introspect:entity", id, collection);
      const pageView = new apiBrowser.apiMethodPage({
        model});
      helpers.debug.msg(`Params/Returns for ${model.get('method')}:`, 'info', [model.get('params'), model.get('returns')]);
      this.listenTo(pageView, 'lab:apibrowser:execute', item => {
        const input = $('.api-method--params').val();
        const params = JSON.parse(input);
        const method = item.model.get('method');

        // Notify
        helpers.debug.msg(`Parameters for: ${method}`, 'info', params);

        // Execute the method
        const api = App.request("command:kodi:controller", "auto", "Commander");
        return api.singleCommand(method, params, response => {
          helpers.debug.msg(`Response for: ${method}`, 'info', response);
          const output = prettyPrint(response);
          return $('#api-result').html(output).prepend($('<h3>Response (check the console for more)</h3>'));
        });
      });

      App.navigate(`lab/api-browser/${model.get('method')}`);
      return this.layout.regionContent.show(pageView);
    }

    renderLanding() {
      const view = new apiBrowser.apiBrowserLanding();
      return this.layout.regionContent.show(view);
    }
  };
});
