// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
  */

  const API = {

    settingsType: {
      sections: "SettingSectionCollection",
      categories: "SettingCategoryCollection",
      settings: "SettingCollection"
    },

    // Items s with matching ids will be skipped, weather ignored as it had no usable elements.
    // Update: As of v17+ we might be able to use weather but requires a select.
    ignoreKeys: ['weather'],

    fields: {
      minimal: ['settingstype'],
      small: ['title', 'control', 'options', 'parent', 'enabled', 'type', 'value', 'enabled', 'default', 'help', 'path', 'description', 'section', 'category'],
      full: []
    },

    getSettingsLevel() {
      return config.getLocal('kodiSettingsLevel', 'standard');
    },

    // Fetch a single entity
    getEntity(id, collection) {
      const model = collection.where({method: id}).shift();
      return model;
    },

    // Fetch an entity collection.
    getCollection(options = {type: 'sections'}) {
      const collectionMethod = this.settingsType[options.type];
      const collection = new (KodiEntities[collectionMethod])();
      options.useNamedParameters = true;
      collection.fetch(options);
      if (options.section && (options.type === 'settings')) {
        collection.where({section: options.section});
      }
      return collection;
    },

    // Get an array of settings categories. Categories are an array of category ids/keys.
    getSettings(section, categories = [], callback) {
      const commander = App.request("command:kodi:controller", 'auto', 'Commander');
      const commands = [];
      const items = [];
      $(categories).each((i, category) => {
        return commands.push({method: 'Settings.GetSettings', params: [this.getSettingsLevel(), {"section": section, "category": category}]});
    });
      return commander.multipleCommands(commands, resp => {
        for (var i in resp) {
          var item = resp[i];
          var catId = categories[i];
          items[catId] = this.parseCollection(item.settings, 'settings');
        }
        return callback(items);
      });
    },

    // Parse response items before creating collection.
    parseCollection(itemsRaw = [], type = 'settings') {
      const items = [];
      for (var method in itemsRaw) {
        // If not ignored add parsed to items.
        var item = itemsRaw[method];
        if (_.lastIndexOf(this.ignoreKeys, item.id) === -1) {
          items.push(this.parseItem(item, type));
        }
      }
      return items;
    },

    // Parse a single setting item
    parseItem(item, type = 'settings') {
      item.settingstype = type;
      item.title = item.label;
      item.description = item.help;
      item.path = 'settings/kodi/' + item.id;
      return item;
    },

    // Save a collection of settings (values from settings forms)
    saveSettings(data, callback) {
      const commander = App.request("command:kodi:controller", 'auto', 'Commander');
      const commands = [];
      for (var key in data) {
        var val = data[key];
        commands.push({method: 'Settings.SetSettingValue', params: [key, this.valuePreSave(val)]});
      }
      return commander.multipleCommands(commands, resp => {
        if (callback) {
          return callback(resp);
        }
      });
    },

    // Final parsing before save
    valuePreSave(val) {
      // If int, cast as int
      if (val === String(parseInt(val))) {
        val = parseInt(val);
      }
      return val;
    }
  };

  /*
   Models and collections.
  */

  //# Single API Setting model.
  KodiEntities.Setting = class Setting extends App.KodiEntities.Model {
    defaults() {
      const fields = _.extend(this.modelDefaults, {id: 0, params: {}});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'small'), fields);
    }
  };

  //# Sections collection
  let Cls = (KodiEntities.SettingSectionCollection = class SettingSectionCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Setting;
      this.prototype.methods = {read: ['Settings.GetSections']};
    }
    parse(resp, xhr) {
      const items = this.getResult(resp, this.options.type);
      return API.parseCollection(items, this.options.type);
    }
  });
  Cls.initClass();

  //# Categories collection
  Cls = (KodiEntities.SettingCategoryCollection = class SettingCategoryCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Setting;
      this.prototype.methods = {read: ['Settings.GetCategories', 'level', 'section']};
    }
    args() { return this.getArgs({
      level: API.getSettingsLevel(),
      section: this.argCheckOption('section', 0)
    }); }
    parse(resp, xhr) {
      const items = this.getResult(resp, this.options.type);
      return API.parseCollection(items, this.options.type);
    }
  });
  Cls.initClass();

  //# Setting collection
  Cls = (KodiEntities.SettingCollection = class SettingCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Setting;
      this.prototype.methods = {read: ['Settings.GetSettings', 'level']};
    }
    args() { return this.getArgs({
      level: API.getSettingsLevel()}); }
    parse(resp, xhr) {
      const items = this.getResult(resp, this.options.type);
      return API.parseCollection(items, this.options.type);
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a list of settings
  App.reqres.setHandler("settings:kodi:entities", (options = {}) => API.getCollection(options));

  // Get a filtered list of settings for a section
  App.reqres.setHandler("settings:kodi:filtered:entities", (options = {}) => API.getSettings(options.section, options.categories, items => options.callback(items)));

  // Save an object of settings
  return App.commands.setHandler("settings:kodi:save:entities", (data= {}, callback) => API.saveSettings(data, callback));
});
