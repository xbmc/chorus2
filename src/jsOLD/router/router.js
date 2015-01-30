app.Router = Backbone.Router.extend({

  routes: {
    "":                         "home"
//    "contact":                  "contact",
//    "artist/:id":               "artist",
//    "artist/:id/:task":         "artist",
//    "artists":                  "artists",
//    "album/:id":                "album",
//    "music/radio":              "pvr",
//    "albums":                   "music",
//    "mymusic":                  "music",
//    "music/:page":              "music",
//    "music/:page/:id":          "music",
//    "playlist/:id":             "playlist",
//    "search/:q":                "search",
//    "search":                   "searchLanding",
//    "scan/:type":               "scan",
//    "thumbsup":                 "thumbsup",
//    "files":                    "files",
//    "browser":                  "browserLanding",
//    "browser/:media/:type/:name/:hash":    "browser",
//    "movies/page/:num/:sort":   "moviesPage",
//    "movies/:tag/:id":          "moviesTag",
//    "movie-genre/:tag":         "movieGenre", // wrapper for moivesTag
//    "movies/:tag":              "moviesTag",
//    "movies":                   "moviesLanding",
//    "mymovies":                 "moviesLanding",
//    "movie/:id":                "movie",
//    "tv/page/:num/:sort":       "tvshows",
//    "tv":                       "tvshowsLanding",
//    "tv/live":                  "pvr",
//    "mytv":                     "tvshowsLanding",
//    "tv/:tag/:id":              "tvshowTag",
//    "tv/:tag":                  "tvshowTag",
//    "tvshow/:id":               "tvshow",
//    "tvshow/:tvid/:seas":       "season",
//    "tvshow/:tv/:s/:e":         "episode",
//    "xbmc/:op":                 "xbmc",
//    "remote":                   "remoteControl",
//    "playlists":                "playlists"
  },

  /**
   * Setup shell (main page layout and controls).
   */
  initialize: function () {

    // Create main layout.
    app.viewsCached.ShellView = new app.views.ShellView();
    $('body').html(app.viewsCached.ShellView.render().$el);

    // Let all that depends on shell being rendered hook in.
    $(window).trigger('shellReady');

    // Add navigation.
    app.controller.nav.render();

  },

  /**
   * Homepage.
   */
  home: function() {

  }



});
