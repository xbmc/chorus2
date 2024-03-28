/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("NotificationsApp", function(NotificationApp, App, Backbone, Marionette, $, _) {

  const API =

    {notificationMinTimeOut: 5000};

  return App.commands.setHandler("notification:show", function(msg, severity = 'normal') {
    //# Average 100 characters takes 10 sec to read
    const timeout = msg.length < 50 ? API.notificationMinTimeOut : (msg.length * 100);
    //# Trigger a ui notification.
    return $.snackbar({
      content: msg,
      style: 'type-' + severity,
      timeout
    });
  });
});
