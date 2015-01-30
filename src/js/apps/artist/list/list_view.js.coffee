@Kodi.module "ArtistApp.List", (List, App, Backbone, Marionette, $, _) ->
	
	class List.Layout extends App.Views.LayoutView
		template: "artist/list/list_layout"

		regions:
			filtersRegion: 	".region-filters"
			contentRegion:	".region-content"

	class List.ArtistTeaser extends App.Views.ItemView
		template: "artist/list/artist_teaser"
		tagName: "li"
		className: "card"
		triggers:
			"click .menu" : "artist-menu:clicked"


	class List.Empty extends App.Views.ItemView
    template: "artist/list/empty"
    tagName: "li"
    className: "empty-result"


	class List.Artists extends App.Views.CollectionView
		itemView: List.ArtistTeaser
		emptyView: List.Empty