/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("KodiEntities", function(KodiEntities, App, Backbone, Marionette, $, _) {

  /*
    API Helpers
  */

  var API = {

    fields: {
      minimal: [],
      small: ['title', 'runtime', 'starttime', 'endtime', 'genre', 'progress'],
      full: ["plot", "plotoutline", "progresspercentage", "episodename", "episodenum", "episodepart", "firstaired", "hastimer", "isactive", "parentalrating", "wasactive", "thumbnail", "rating", "originaltitle", "cast", "director", "writer", "year", "imdbnumber", "hastimerrule", "hasrecording", "recording", "isseries"]
    },

    //# Fetch a single entity
    getEntity(channelid, options) {
      const entity = new App.KodiEntities.Broadcast();
      entity.set({channelid: parseInt(channelid), properties: helpers.entities.getFields(API.fields, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an entity collection.
    getCollection(options) {
      const defaultOptions = {useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      const collection = new KodiEntities.BroadcastCollection();
      collection.fetch(options);
      return collection;
    }
  };

  /*
   Models and collections.
  */

  //# Single Channel model.
  let Cls = (KodiEntities.Broadcast = class Broadcast extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['PVR.GetBroadcasts', 'channelid', 'properties']};
    }
    defaults() {
      const fields = _.extend(this.modelDefaults, {channelid: 1, channel: ''});
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fields, 'full'), fields);
    }
    parse(resp, xhr) {
      const obj = (resp.broadcasts != null) ? resp.broadcasts : resp;
      if (resp.broadcasts != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('broadcast', obj, obj.broadcastid);
    }
  });
  Cls.initClass();

  //# Channel collection
  Cls = (KodiEntities.BroadcastCollection = class BroadcastCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Broadcast;
      this.prototype.methods = {read: ['PVR.GetBroadcasts', 'channelid', 'properties', 'limits']};
    }
    args() { return this.getArgs({
      channelid: this.argCheckOption('channelid', 0),
      properties: helpers.entities.getFields(API.fields, 'full'),
      limits: this.argLimit()
    }); }
    parse(resp, xhr) {
      return this.getResult(resp, 'broadcasts');
    }
  });
  Cls.initClass();

  /*
   Request Handlers.
  */

  // Get a single channel
  App.reqres.setHandler("broadcast:entity", (collection, channelid) => API.getEntity(collection, parseInt(channelid)));

  //# Get an channel collection
  return App.reqres.setHandler("broadcast:entities", function(channelid, options = {}) {
    options.channelid = parseInt(channelid);
    return API.getCollection(options);
  });
});
