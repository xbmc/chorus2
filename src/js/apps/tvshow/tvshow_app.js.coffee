@Kodi.module "TVShowApp", (TVShowApp, App, Backbone, Marionette, $, _) ->
	
	class TVShowApp.Router extends Marionette.AppRouter
		appRoutes:
			"tvshows"   	: "list"
			"tvshow/:id"	: "view"


	API =

		list: ->
			new TVShowApp.List.Controller()

		view: (id) ->
		  new TVShowApp.Show.Controller
		    id: id

	
	App.addInitializer ->
		new TVShowApp.Router
			controller: API