/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Selected", function(Selected, App, Backbone, Marionette, $, _) {

  //# The Selected.List object handles what is currently selected and
  //# methods relating to selected actions.
  const Cls = (Selected.List = class List extends Marionette.Object {
    static initClass() {
  
      this.prototype.items = [];
      this.prototype.media = '';
      this.prototype.type = '';
    }

    // Get raw items
    getItems() {
      return this.items;
    }

    // Get all playable items as a collection
    getCollection(callback) {
      // Music
      if (helpers.global.inArray(this.type, ['song', 'artist', 'album'])) {
        const ids = _.pluck(this.items, 'id');
        const idProp = this.type + 'id';
        return App.request("song:custom:entities", idProp, ids, collection => callback(collection));
      } else {
        // Video
        const collection = App.request(this.type + ":build:collection", this.items);
        return callback(collection);
      }
    }

    // Add or remove a model from items
    updateItems(op, model) {
      // Remove from items first
      this.items = _.filter(this.items, item => item.uid !== model.uid);
      if (op === 'add') {
        this.items.push(model);
        this.type = model.type;
        this.media = helpers.global.inArray(this.type, ['song', 'album', 'artist']) ? 'audio' : 'video';
      }
      this.updateUi();
      return this;
    }

    // Clear all items in the list
    clearItems() {
      this.items = [];
      this.updateUi();
      return this;
    }

    setMedia(media) {
      this.media = media;
      return this;
    }

    getType() {
      return this.type;
    }

    getMedia() {
      return this.media;
    }

    // Update the count in the selected action area, toggle visibility and and media class
    updateUi() {
      const selectedText = this.items.length + ' ' + t.ngettext("item selected", "items selected", this.items.length);
      $('#selected-count').text(selectedText);
      const $selectedRegion = $('#selected-region');
      $selectedRegion.removeClassStartsWith('media-');
      $selectedRegion.addClass('media-' + this.media);
      if (this.items.length === 0) {
        $selectedRegion.hide();
        return $('.selected').removeClass('selected');
      } else {
        return $selectedRegion.show();
      }
    }
  });
  Cls.initClass();


  // Add an instance of the selected object to the app
  App.addInitializer(() => App.selected = new Selected.List);


  //# Handler to get items
  App.reqres.setHandler("selected:get:items", () => App.selected.getItems());

  //# Handler to get media
  App.reqres.setHandler("selected:get:media", () => App.selected.getMedia());

  //# Handler to update items
  App.commands.setHandler("selected:update:items", (op, model) => App.selected.updateItems(op, model));

  //# Handler to clear items
  App.commands.setHandler("selected:clear:items", () => App.selected.clearItems());

  //# Handler to clear items
  App.commands.setHandler("selected:set:media", media => App.selected.setMedia(media));

  //# Handler to Kodi play
  App.commands.setHandler("selected:action:play", () => App.selected.getCollection(function(collection) {
    const kodiPlaylist = App.request("command:kodi:controller", App.selected.getMedia(), 'PlayList');
    kodiPlaylist.playCollection(collection);
    return App.selected.clearItems();
  }));

  //# Handler to Kodi add
  App.commands.setHandler("selected:action:add", () => App.selected.getCollection(function(collection) {
    const kodiPlaylist = App.request("command:kodi:controller", App.selected.getMedia(), 'PlayList');
    kodiPlaylist.addCollection(collection);
    return App.selected.clearItems();
  }));

  //# Handler to local add
  return App.commands.setHandler("selected:action:localadd", function() {
    const items = App.selected.getItems();
    const ids = _.pluck(items, 'id');
    const idProp = App.selected.getType() + 'id';
    App.execute("localplaylist:addentity", idProp, ids);
    return App.selected.clearItems();
  });
});
