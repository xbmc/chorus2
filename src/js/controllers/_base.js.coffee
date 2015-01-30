@Kodi.module "Controllers", (Controllers, App, Backbone, Marionette, $, _) ->

	class Controllers.Base extends Backbone.Marionette.Controller

		constructor: (options = {}) ->
			@region = options.region or App.request "default:region"
			super options
			@_instance_id = _.uniqueId("controller")
			App.execute "register:instance", @, @_instance_id

		close: (args...) ->
			delete @region
			delete @options
			super args
			App.execute "unregister:instance", @, @_instance_id

		show: (view) ->
			@listenTo view, "close", @close
			@region.show view