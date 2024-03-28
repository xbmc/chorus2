/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("CommandApp.Local", function(Api, App, Backbone, Marionette, $, _) {

  return Api.Base = class Base extends Marionette.Object {

    localLoad(model, callback) {

      //# Local state obj
      const stateObj = App.request("state:local");

      //# If no valid model passed tell the UI we have stopped
      if ((model == null)) {
        stateObj.setPlaying('playing', false);
        this.localStateUpdate();
        return;
      }

      //# Unique browser playback id
      stateObj.setState('currentPlaybackId', 'browser-' + model.get('id'));

      //# Get the download path for the file.
      const files = App.request("command:kodi:controller", 'video', 'Files');
      return files.downloadPath(model.get('file'), path => {

        //# Clone soundmanager
        const sm = soundManager;

        //# Stop anything currently playing
        this.localStop();

        //# Create a sm object and load it into the state
        stateObj.setState('localPlay', sm.createSound({
          id: stateObj.getState('currentPlaybackId'),
          url: path,
          autoplay: false,
          autoLoad: true,
          stream: true,
          volume: stateObj.getState('volume'),
          onerror() {
            return console.log('SM ERROR!');
          },
          onplay: () => {
            stateObj.setPlayer('local');
            stateObj.setPlaying('playing', true);
            stateObj.setPlaying('paused', false);
            stateObj.setPlaying('playState', 'playing');
            stateObj.setPlaying('position', model.get('position'));
            stateObj.setPlaying('itemChanged', true);
            stateObj.setPlaying('item', model.attributes);
            stateObj.setPlaying('totaltime', helpers.global.secToTime( model.get('duration') ));
            //# Set volume
            //# Trigger listeners
            return this.localStateUpdate();
          },
          onstop: () => {
            stateObj.setPlaying('playing', false);
            //# trigger listeners (remove classes, etc)
            return this.localStateUpdate();
          },
          onpause: () => {
            stateObj.setPlaying('paused', true);
            stateObj.setPlaying('playState', 'paused');
            //# trigger listeners
            return this.localStateUpdate();
          },
          onresume: () => {
            stateObj.setPlaying('paused', false);
            stateObj.setPlaying('playState', 'playing');
            //# trigger listeners
            return this.localStateUpdate();
          },
          onfinish: () => {
            return this.localFinished();
          },
          whileplaying() {
            const pos = parseInt(this.position) / 1000;
            const dur = parseInt( model.get('duration') ); //# @duration is also available (represents loaded not total)
            const percentage = Math.round((pos / dur) * 100);
            stateObj.setPlaying('time', helpers.global.secToTime(pos));
            stateObj.setPlaying('percentage', percentage);
            return App.execute('player:local:progress:update', percentage, helpers.global.secToTime(pos));
          }
        })
        );

        //# stuff after load
        return this.doCallback(callback);
      });
    }


    //# What to do when finished.
    localFinished() {
      return this.localGoTo('next');
    }

    //# Wrapper for playing current item.
    localPlay() {
      return this.localCommand('play');
    }

    //# Wrapper for stopping current item.
    localStop() {
      return this.localCommand('stop');
    }

    //# Wrapper for pausing current item.
    localPause() {
      return this.localCommand('pause');
    }

    localPlayPause() {
      const stateObj = App.request("state:local");
      if (stateObj.getPlaying('paused')) {
        return this.localCommand('play');
      } else {
        return this.localCommand('pause');
      }
    }

    //# Set volume
    localSetVolume(volume) {
      return this.localCommand('setVolume', volume);
    }

    //# Wrapper for calling a command on the current soundmanager sound.
    localCommand(command, param) {
      const stateObj = App.request("state:local");
      const currentItem = stateObj.getState('localPlay');
      if (currentItem !== false) {
        currentItem[command](param);
      }
      return this.localStateUpdate();
    }

    //# Go to next/prev item adhering to repeat and shuffle
    localGoTo(param) {
      //# Get current playlist and state
      const collection = App.request("localplayer:get:entities");
      const stateObj = App.request("state:local");
      const currentPos = stateObj.getPlaying('position');
      let posToPlay = false;
      //# Need songs to continue.
      if (collection.length > 0) {
        //# Repeat this item
        if (stateObj.getState('repeat') === 'one') {
          posToPlay = currentPos;
        } else if (stateObj.getState('shuffled') === true) {
          //# Shuffle
          //# TODO: store what positions have been played so we dont repeat
          posToPlay = helpers.global.getRandomInt(0, collection.length - 1);
        } else {
          //# Next action
          if (param === 'next') {
            //# repeat all, back to the start
            if ((currentPos === (collection.length - 1)) && (stateObj.getState('repeat') === 'all')) {
              posToPlay = 0;
            } else if (currentPos < collection.length) {
              //# Standard next
              posToPlay = currentPos + 1;
            }
            this.localStateNext();
          }
          //# Prev action
          if (param === 'previous') {
            //# repeat all, go to the end
            if ((currentPos === 0) && (stateObj.getState('repeat') === 'all')) {
              posToPlay = collection.length - 1;
            } else if (currentPos > 0) {
              //# Standard prev
              posToPlay = currentPos - 1;
            }
          }
        }
      }
      //# Check we have a position to play, if so, play it.
      if (posToPlay !== false) {
        const model = collection.findWhere({position: parseInt(posToPlay)});
        return this.localLoad(model, () => {
          this.localPlay();
          return this.localStateUpdate();
        });
      }
    }

    //# Seek to a percentage in the song
    localSeek(param) {
      const stateObj = App.request("state:local");
      const localPlay = stateObj.getState('localPlay');
      if (localPlay !== false) {
        const newPos = (param.percentage / 100) * localPlay.duration;
        const sound = soundManager.getSoundById(stateObj.getState('currentPlaybackId'));
        return sound.setPosition(newPos);
      }
    }

    //# Set repeat state (cycle is available).
    localRepeat(param) {
      const stateObj = App.request("state:local");
      if (param !== 'cycle') {
        return stateObj.setState('repeat', param);
      } else {
        let newState = false;
        const states = ['off', 'all', 'one'];
        for (var i in states) {
          var state = states[i];
          i = parseInt(i);
          if (newState !== false) {
            continue;
          }
          if (stateObj.getState('repeat') === state) {
            if (i !== (states.length - 1)) {
              var key = i + 1;
              newState = states[key];
            } else {
              newState = 'off';
            }
          }
        }
        return stateObj.setState('repeat', newState);
      }
    }

    //# Toggle shuffle
    localShuffle() {
      const stateObj = App.request("state:local");
      const currentShuffle = stateObj.getState('shuffled');
      return stateObj.setState('shuffled', !currentShuffle);
    }

    //# Triggers when something changes in the player.
    localStateUpdate() {
      return App.vent.trigger("state:local:changed");
    }

    //# Trigger when we have moved to the next song
    localStateNext() {
      return App.vent.trigger("state:local:next");
    }

    paramObj(key, val) {
      return helpers.global.paramObj(key, val);
    }

    doCallback(callback, response) {
      if (typeof callback === 'function') {
        return callback(response);
      }
    }

    onError(commands, error) {
      return helpers.debug.rpcError(commands, error);
    }
  };
});
