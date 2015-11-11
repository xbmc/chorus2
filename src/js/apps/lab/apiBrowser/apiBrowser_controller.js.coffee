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

        @layout = @getLayoutView collection

        @listenTo @layout, "show", =>
          @renderList collection
          if @options.method
            @renderPage @options.method, collection
            console.log @options

        App.regionContent.show @layout

    getLayoutView: (collection) ->
      new apiBrowser.Layout
        collection: collection

    renderList: (collection) ->
      view = new apiBrowser.apiMethods
        collection: collection
      @listenTo view, 'childview:method:view', (item) =>
        console.log item
        @renderPage(item.model.get('id'), collection)
      @layout.regionSidebarFirst.show view

    renderPage: (id, collection) ->
      model = App.request "introspect:entity", id, collection
      console.log model
      view = new apiBrowser.apiMethodPage
        model: model
      @layout.regionContent.show view