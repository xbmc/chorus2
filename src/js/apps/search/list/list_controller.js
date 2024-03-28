/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("SearchApp.List", (List, App, Backbone, Marionette, $, _) => //# Main controller
(function() {
  const Cls = (List.Controller = class Controller extends App.Controllers.Base {
    constructor(...args) {
      super(...args);
      this.getLoader = this.getLoader.bind(this);
      this.updateProgress = this.updateProgress.bind(this);
    }

    static initClass() {

      this.prototype.maxItemsCombinedSearch = 21;

      this.prototype.allEntities = ['movie', 'tvshow', 'artist', 'album', 'song', 'musicvideo'];

      this.prototype.searchFieldMap = {
        artist: 'artist',
        album: 'album',
        song: 'title',
        movie: 'title',
        tvshow: 'title',
        musicvideo: 'title'
      };

      this.prototype.entityTitles =
        {musicvideo: 'music video'};

      this.prototype.entityPreventSelect =
        ['tvshow'];
    }

    initialize() {
      this.pageLayout = this.getPageLayout();
      this.layout = this.getLayout();
      this.processed = [];
      this.processedItems = 0;
      this.addonSearches = App.request("addon:search:enabled");
      App.execute("selected:clear:items");
      const media = this.getOption('media');
      if (media === 'all') {
        this.entities = this.allEntities;
      } else {
        this.entities = [media];
      }
      this.listenTo(this.layout, "show", () => {
        //# Add the loader
        this.getLoader();
        //# Do a search for each entity
        return this.entities.map((entity) =>
          helpers.global.inArray(entity, this.allEntities) ?
            this.getResultMedia(entity)
          :
            this.getResultAddon(entity));
      });
      this.listenTo(this.pageLayout, "show", () => {
        this.pageLayout.regionContent.show(this.layout);
        return this.pageLayout.regionSidebarFirst.show(this.getSidebar());
      });
      return App.regionContent.show(this.pageLayout);
    }

    getPageLayout() {
      return new List.PageLayout();
    }

    getLayout() {
      return new List.ListLayout();
    }

    //# Get and build the sidebar links
    getSidebar() {
      let media;
      const medias = [{id: 'all', title: 'all media'}];
      for (media of this.allEntities) {
        medias.push({
          id: media,
          title: this.getTitle(media) + 's'
        });
      }
      const opts = {
        links: {media: medias, addon: this.addonSearches},
        query: this.getOption('query')
      };
      return new List.Sidebar(opts);
    }

    //# Get the loader which indicates remaining sets to search
    getLoader() {
      // Get items left to process
      const toProcess = _.difference(this.entities, this.processed);
      // Replace addon ids with title
      for (var i in toProcess) {
        var name = toProcess[i];
        var addon = _.findWhere(this.addonSearches, {id: name});
        toProcess[parseInt(i)] = addon ? addon.title : name + 's';
      }
      // Build the loading search text
      const searchNames = helpers.global.arrayToSentence(toProcess, false);
      const query = helpers.global.arrayToSentence([this.getOption('query')], false);
      const text = t.gettext('Searching for') + ' ' + query + ' ' + t.gettext('in') + ' ' + searchNames;
      return App.execute("loading:show:view", this.layout.loadingSet, text);
    }

    //# Get local library results
    getResultMedia(entity) {
      const query = this.getOption('query');
      const limit = {start: 0};
      if (this.getOption('media') === 'all') {
        limit.end = this.maxItemsCombinedSearch;
      }
      const opts = {
        limits: limit,
        filter: {'operator': 'contains', 'field': this.searchFieldMap[entity], 'value': query},
        success: loaded => {
          // If result
          if (loaded.length > 0) {
            this.processedItems = this.processedItems + loaded.length;
            // See if we need more
            let more = false;
            if (loaded.length === this.maxItemsCombinedSearch) {
              more = true;
              loaded.first(20);
            }
            // Get the result view
            const view = App.request(`${entity}:list:view`, loaded, true);
            // Wrap it in a set view container and add a title
            const setView = new List.ListSet({
              entity,
              more,
              query,
              title: this.getTitle(entity) + 's',
              noMenuDefault: helpers.global.inArray(entity, this.entityPreventSelect)
            });
            App.listenTo(setView, "show", () => {
              return setView.regionCollection.show(view);
            });
            //# Add to layout
            this.layout[`${entity}Set`].show(setView);
          }
          return this.updateProgress(entity);
        }
      };
      return App.request(`${entity}:entities`, opts);
    }

    //# Get addon results
    getResultAddon(addonId) {
      const addonSearch = _.findWhere(this.addonSearches, {id: addonId});
      const opts = {
        file: addonSearch.url.replace('[QUERY]', this.getOption('query')),
        media: addonSearch.media,
        addonId: addonSearch.id,
        success: fullCollection => {
          let i = 0;
          const typeCollection = App.request("file:parsed:entities", fullCollection);
          for (var type of ['file', 'directory']) {
            var collection = typeCollection[type];
            // If result
            if (collection.length > 0) {
              i++;
              this.processedItems = this.processedItems + collection.length;
              var filesView = App.request("browser:" + type + ":view", collection);
              var setView = new List.ListSet({
                entity: addonSearch.title,
                title: i === 1 ? addonSearch.title : '',
                more: false,
                query: this.getOption('query'),
                noMenuDefault: true
              });
              App.listenTo(setView, "show", () => {
                return setView.regionResult.show(filesView);
              });
              this.layout.appendAddonView(addonId + type, setView);
            }
          }
          return this.updateProgress(addonId);
        }
      };
      return App.request("file:entities", opts);
    }

    //# Get title for an entity
    getTitle(entity) {
      const title = this.entityTitles[entity] ? this.entityTitles[entity] : entity;
      return title;
    }

    //# Update the progress of the search
    updateProgress(done) {
      if (done != null) {
        this.processed.push(done);
      }
      this.getLoader();
      if (this.processed.length === this.entities.length) {
        this.layout.loadingSet.$el.empty();
        if (this.processedItems === 0) {
          return this.pageLayout.regionContent.$el.html('<h2 class="search-no-result">' + tr('No results found') + '</h2>');
        }
      }
    }
  });
  Cls.initClass();
  return Cls;
})());
