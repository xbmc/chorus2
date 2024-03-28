// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SearchApp", function(SearchApp, App, Backbone, Marionette, $, _) {

  const Cls = (SearchApp.Router = class Router extends App.Router.Base {
    static initClass() {
      this.prototype.appRoutes = {
        "search"        : "view",
        "search/:media/:query"  : "list"
      };
    }
  });
  Cls.initClass();

  var API = {

    keyUpTimeout: 2000,

    //# Search urls used for external searches
    externalSearchUrls: {
      google     : 'https://www.google.com/webhp?#q=[QUERY]',
      imdb       : 'http://www.imdb.com/find?s=all&q=[QUERY]',
      tmdb       : 'https://www.themoviedb.org/search?query=[QUERY]',
      tvdb       : 'http://thetvdb.com/?searchseriesid=&tab=listseries&function=Search&string=[QUERY]',
      soundcloud : 'https://soundcloud.com/search?q=[QUERY]',
      youtube    : 'https://www.youtube.com/results?search_query=[QUERY]'
    },

    list(media, query) {
      App.navigate(`search/${media}/${query}`);
      $('#search').val(query);
      return new SearchApp.List.Controller({
        query,
        media
      });
    },

    view() {
      //# Show the search form (for mobile)
      return new SearchApp.Show.Controller();
    },

    searchBind() {
      return $('#search').on('keyup', function(e) {
        $('#search-region').removeClass('pre-search');
        const val = $('#search').val();
        const media = helpers.url.arg(0) === 'search' ? helpers.url.arg(1) : 'all';
        clearTimeout(App.searchAllTimeout);
        // If enter key
        if (e.which === 13) {
          return API.list(media, val);
        } else {
          $('#search-region').addClass('pre-search');
          // Start search in @keyUpTimeout
          return App.searchAllTimeout = setTimeout(( function() {
            $('#search-region').removeClass('pre-search');
            return API.list(media, val);
          }), API.keyUpTimeout);
        }
      });
    }
  };


  //# Do an internal or external search
  App.commands.setHandler('search:go', function(type, query, provider = 'all') {
    if (type === 'internal') {
      return App.navigate(`search/${provider}/${query}`, {trigger: true});
    } else if (API.externalSearchUrls[provider]) {
      const url = API.externalSearchUrls[provider].replace('[QUERY]', encodeURIComponent(query));
      return window.open(url);
    }
  });


  App.on("before:start", () => new SearchApp.Router({
    controller: API}));

  //# Bind to the search box.
  return App.addInitializer(() => App.vent.on("shell:ready", () => API.searchBind()));
});

