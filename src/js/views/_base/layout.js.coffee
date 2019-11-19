@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

	class Views.LayoutView extends Backbone.Marionette.LayoutView

		## Workaround for dropdowns not closing on click
		onShow: () ->
			App.execute "ui:dropdown:bind:close", @$el
