@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

	class Views.EmptyViewPage extends App.Views.ItemView
		template: "views/empty/empty_page"
		regions:
			regionEmptyContent:  ".empty--page"

  class Views.EmptyViewResults extends App.Views.ItemView
    template: "views/empty/empty_results"
    regions:
      regionEmptyContent:  ".empty-result"
