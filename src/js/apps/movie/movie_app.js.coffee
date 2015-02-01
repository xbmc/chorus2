@Kodi.module "MovieApp", (MovieApp, App, Backbone, Marionette, $, _) ->
	
	class MovieApp.Router extends Marionette.AppRouter
		appRoutes:
			"movies"   	: "list"
			"movie/:id"	: "view"


	API =

		list: ->
			new MovieApp.List.Controller()

		view: (id) ->
		  new MovieApp.Show.Controller
		    id: id

	
	App.addInitializer ->
		new MovieApp.Router
			controller: API