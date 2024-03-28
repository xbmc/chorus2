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

    fieldsChannel: {
      minimal: ['thumbnail'],
      small: ['channeltype', 'hidden', 'locked', 'channel', 'lastplayed', 'broadcastnow', 'isrecording'],
      full: []
    },

    fieldsRecording: {
      minimal: ['channel', 'file', 'title'],
      small: ['resume', 'plot', 'genre', 'playcount', 'starttime', 'endtime', 'runtime', 'icon', 'art', 'streamurl', 'directory', 'radio', 'isdeleted', 'channeluid'],
      full: []
    },


    //# Fetch a single channel entity
    getChannelEntity(id, options = {}) {
      const entity = new App.KodiEntities.Channel();
      entity.set({channelid: parseInt(id), properties: helpers.entities.getFields(API.fieldsChannel, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an channel entity collection.
    getChannelCollection(options) {
      const defaultOptions = {useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      const collection = new KodiEntities.ChannelCollection();
      collection.fetch(options);
      return collection;
    },

    //# Fetch a single recording entity
    getRecordingEntity(id, options = {}) {
      const entity = new App.KodiEntities.Recording();
      entity.set({recordingid: parseInt(id), properties: helpers.entities.getFields(API.fieldsRecording, 'full')});
      entity.fetch(options);
      return entity;
    },

    //# Fetch an recording entity collection.
    getRecordingCollection(options) {
      const defaultOptions = {useNamedParameters: true};
      options = _.extend(defaultOptions, options);
      const collection = new KodiEntities.RecordingCollection();
      collection.fetch(options);
      return collection;
    }
  };


  /*
   Models and collections.
  */

  //# Single Channel model
  let Cls = (KodiEntities.Channel = class Channel extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['PVR.GetChannelDetails', 'channelid', 'properties']};
    }
    defaults() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fieldsChannel, 'full'), {});
    }
    parse(resp, xhr) {
      const obj = (resp.channeldetails != null) ? resp.channeldetails : resp;
      if (resp.channeldetails != null) {
        obj.fullyloaded = true;
      }
      return this.parseModel('channel', obj, obj.channelid);
    }
  });
  Cls.initClass();

  //# Channel collection
  Cls = (KodiEntities.ChannelCollection = class ChannelCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Channel;
      this.prototype.methods = {read: ['PVR.GetChannels', 'channelgroupid', 'properties', 'limits']};
    }
    args() { return this.getArgs({
      channelgroupid: this.argCheckOption('group', 0),
      properties: helpers.entities.getFields(API.fieldsChannel, 'small'),
      limits: this.argLimit()
    }); }
    parse(resp, xhr) {
      return this.getResult(resp, 'channels');
    }
  });
  Cls.initClass();


  //# Recording model
  Cls = (KodiEntities.Recording = class Recording extends App.KodiEntities.Model {
    static initClass() {
      this.prototype.methods = {read: ['PVR.GetRecordingDetails', 'recordingid', 'properties']};
    }
    defaults() {
      return this.parseFieldsToDefaults(helpers.entities.getFields(API.fieldsRecording, 'full'), {});
    }
    parse(obj, xhr) {
      obj.fullyloaded = true;
      obj.player = obj.radio ? 'audio' : 'video';
      return this.parseModel('recording', obj, obj.recordingid);
    }
  });
  Cls.initClass();

  //# Recording collection
  Cls = (KodiEntities.RecordingCollection = class RecordingCollection extends App.KodiEntities.Collection {
    static initClass() {
      this.prototype.model = KodiEntities.Recording;
      this.prototype.methods = {read: ['PVR.GetRecordings', 'properties', 'limits']};
    }
    args() { return this.getArgs({
      properties: helpers.entities.getFields(API.fieldsRecording, 'small'),
      limits: this.argLimit()
    }); }
    parse(resp, xhr) {
      return this.getResult(resp, 'recordings');
    }
  });
  Cls.initClass();


  /*
   Request Handlers.
  */

  // Get a single channel
  App.reqres.setHandler("channel:entity", (channelid, options = {}) => API.getChannelEntity(channelid, options));

  //# Get an channel collection
  App.reqres.setHandler("channel:entities", function(group = 'alltv', options = {}) {
    options.group = group;
    return API.getChannelCollection(options);
  });

  // Get a single recording
  App.reqres.setHandler("recording:entity", (channelid, options = {}) => API.getRecordingEntity(channelid, options));

  //# Get an recording collection
  return App.reqres.setHandler("recording:entities", function(group = 'alltv', options = {}) {
    options.group = group;
    return API.getRecordingCollection(options);
  });
});
