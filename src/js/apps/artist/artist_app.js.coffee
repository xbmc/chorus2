@Kodi.module "ArtistApp", (ArtistApp, App, Backbone, Marionette, $, _) ->
	
	class ArtistApp.Router extends Marionette.AppRouter
		appRoutes:
			"music/artists"   	: "list"
			"music/artist/:id"	: "view"


	API =
		list: ->
			new ArtistApp.List.Controller

		view: (id) ->
      foo = 'bar'
			# new ArtistApp.Show.Controller
			# 	id: id

	
	App.addInitializer ->
		new ArtistApp.Router
			controller: API