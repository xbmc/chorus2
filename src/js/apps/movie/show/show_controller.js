// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MovieApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  const API = {

    bindTriggers(view) {
      App.listenTo(view, 'movie:play', viewItem => App.execute('movie:action', 'play', viewItem));
      App.listenTo(view, 'movie:add', viewItem => App.execute('movie:action', 'add', viewItem));
      App.listenTo(view, 'movie:localplay', viewItem => App.execute('movie:action', 'localplay', viewItem));
      App.listenTo(view, 'movie:download', viewItem => App.execute('movie:action', 'download', viewItem));
      App.listenTo(view, 'toggle:watched', viewItem => App.execute('movie:action:watched', viewItem.view, viewItem.view));
      App.listenTo(view, 'movie:refresh', viewItem => App.execute('movie:action', 'refresh', viewItem));
      return App.listenTo(view, 'movie:edit', viewItem => App.execute('movie:edit', viewItem.model));
    },

    moreContent: [
      {
        title: 'More from %1$s',
        filter: 'set',
        key: 'set',
        type: 'string',
        pluck: false
      },
      {
        title: 'More %1$s movies',
        filter: 'genre',
        key: 'genre',
        type: 'array',
        pluck: false
      },
      {
        title: 'More movies starring %1$s',
        filter: 'actor',
        key: 'cast',
        type: 'array',
        pluck: 'name'
      },
      {
        title: 'Other movies released in %1$s',
        filter: 'year',
        key: 'year',
        type: 'string',
        pluck: false
      }
    ]
  };

  return Show.Controller = class Controller extends App.Controllers.Base {

    //# The Movie page.
    initialize(options) {
      const id = parseInt(options.id);
      const movie = App.request("movie:entity", id);
      //# Fetch the movie
      return App.execute("when:entity:fetched", movie, () => {
        //# Get the layout.
        this.layout = this.getLayoutView(movie);
        //# Listen to the show of our layout.
        this.listenTo(this.layout, "show", () => {
          this.getDetailsLayoutView(movie);
          return this.getContentView(movie);
        });
        //# Add the layout to content.
        return App.regionContent.show(this.layout);
      });
    }

    //# Get the base layout
    getLayoutView(movie) {
      return new Show.PageLayout({
        model: movie});
    }

    getContentView(movie) {
      this.contentLayout = new Show.Content({model: movie});
      this.listenTo(this.contentLayout, "movie:youtube", function(view) {
        const trailer = movie.get('mediaTrailer');
        return App.execute("ui:modal:youtube", movie.escape('title') + ' Trailer', trailer.id);
      });
      this.listenTo(this.contentLayout, 'show', () => {
        if (movie.get('cast').length > 0) {
          this.contentLayout.regionCast.show(this.getCast(movie));
        }
        return this.getMoreContent(movie);
      });
      return this.layout.regionContent.show(this.contentLayout);
    }

    getCast(movie) {
      return App.request('cast:list:view', movie.get('cast'), 'movies');
    }


    //# Build the details layout.
    getDetailsLayoutView(movie) {
      const headerLayout = new Show.HeaderLayout({model: movie});
      this.listenTo(headerLayout, "show", () => {
        const teaser = new Show.MovieTeaser({model: movie});
        API.bindTriggers(teaser);
        const detail = new Show.Details({model: movie});
        API.bindTriggers(detail);
        headerLayout.regionSide.show(teaser);
        return headerLayout.regionMeta.show(detail);
      });
      return this.layout.regionHeader.show(headerLayout);
    }

    getMoreContent(movie) {
      let idx = 0;
      return (() => {
        const result = [];
        for (var i in API.moreContent) {
        // Get the correct value to filter by
          var more = API.moreContent[i];
          var filterVal = false;
          if (more.type === 'array') {
            var filterVals = more.pluck ? _.pluck(movie.get(more.key), more.pluck) : movie.get(more.key);
            filterVals = _.shuffle(filterVals.slice(0, 4));
            filterVal = _.first(filterVals);
          } else {
            filterVal = movie.get(more.key);
          }

          // Built req options
          if (filterVal && (filterVal !== '')) {
            idx++;
            var opts = {
              limit: {start: 0, end: 6},
              cache: false,
              sort: {method: 'random', order: 'ascending'},
              filter: {},
              title: t.sprintf(tr(more.title), '<a href="#movies?' + more.key + '=' + _.escape(filterVal) + '">' + _.escape(filterVal) + '</a>'),
              idx
            };
            opts.filter[more.filter] = filterVal;

            // On get results
            opts.success = collection => {
              collection.remove(movie);
              if (collection.length > 0) {
                const view = new Show.Set({
                  set: collection.options.title});
                App.listenTo(view, "show", () => {
                  const listview = App.request("movie:list:view", collection);
                  return view.regionCollection.show(listview);
                });
                return this.contentLayout[`regionMore${collection.options.idx}`].show(view);
              }
            };

            // Fetch
            result.push(App.request("movie:entities", opts));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  };
});
