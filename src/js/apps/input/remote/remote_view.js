/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("InputApp.Remote", function(Remote, App, Backbone, Marionette, $, _) {

  let Cls = (Remote.Control = class Control extends App.Views.ItemView {
    static initClass() {
      this.prototype.template = 'apps/input/remote/remote_control';
      this.prototype.events = {
        'click .input-button': 'inputClick',
        'click .player-button': 'playerClick',
        'click .close-remote': 'closeRemote'
      };
      this.prototype.triggers = {
        'click .power-button': 'remote:power',
        'click .info-button': 'remote:info'
      };
  
      Remote.Landing = class Landing extends App.Views.ItemView {};
    }

    inputClick(e) {
      const type = $(e.target).data('type');
      return this.trigger('remote:input', type);
    }

    playerClick(e) {
      const type = $(e.target).data('type');
      return this.trigger('remote:player', type);
    }

    closeRemote(e) {
      return App.execute("input:remote:toggle");
    }
  });
  Cls.initClass();


  return (function() {
    Cls = (Remote.System = class System extends App.Views.ItemView {
      static initClass() {
        this.prototype.template = 'apps/input/remote/system';
        this.prototype.className = 'system-menu';
        this.prototype.events =
          {'click li': 'doAction'};
      }
      doAction(e) {
        const action = $(e.target).data('action');
        return this.trigger('system:action', action);
      }
    });
    Cls.initClass();
    return Cls;
  })();
});

