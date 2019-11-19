# Controller for the API Browser.
#
# An app that allows you to get all the methods from the api
# and execute them
#
# @param [Object] This app object
# @param [Object] The full application object
# @param [Object] Backbone
# @param [Object] Marionette
# @param [Object] jQuery
# @param [Object] lodash (underscore)
#
@Kodi.module "LabApp.apiBrowser", (apiBrowser, App, Backbone, Marionette, $, _) ->

  # Main controller
  class apiBrowser.Controller extends App.Controllers.Base

    initialize: ->
      collection = App.request "introspect:entities"
      App.execute "when:entity:fetched", collection, =>
        collection.dictionary = App.request "introspect:dictionary"

        @layout = @getLayoutView collection

        @listenTo @layout, "show", =>
          @renderList collection
          if @options.method
            @renderPage @options.method, collection
          else
            @renderLanding()

        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new apiBrowser.Layout
        collection: collection

    renderList: (collection) ->
      view = new apiBrowser.apiMethods
        collection: collection
      @listenTo view, 'childview:lab:apibrowser:method:view', (item) =>
        @renderPage(item.model.get('id'), collection)
      @layout.regionSidebarFirst.show view

    renderPage: (id, collection) ->
      model = App.request "introspect:entity", id, collection
      pageView = new apiBrowser.apiMethodPage
        model: model
      helpers.debug.msg "Params/Returns for #{model.get('method')}:", 'info', [model.get('params'), model.get('returns')]
      @listenTo pageView, 'lab:apibrowser:execute', (item) =>
        input = $('.api-method--params').val();
        params = JSON.parse input
        method = item.model.get 'method'

        # Notify
        helpers.debug.msg "Parameters for: #{method}", 'info', params

        # Execute the method
        api = App.request "command:kodi:controller", "auto", "Commander"
        api.singleCommand method, params, (response) =>
          helpers.debug.msg "Response for: #{method}", 'info', response
          output = prettyPrint response
          $('#api-result').html(output).prepend($('<h3>Response (check the console for more)</h3>'));

      App.navigate "lab/api-browser/#{model.get('method')}"
      @layout.regionContent.show pageView

    renderLanding: ->
      view = new apiBrowser.apiBrowserLanding()
      @layout.regionContent.show view