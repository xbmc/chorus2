@Kodi.module "NotificationsApp", (NotificationApp, App, Backbone, Marionette, $, _) ->

  API =

    notificationMinTimeOut: 5000

  App.commands.setHandler "notification:show", (msg, severity = 'normal') ->
    ## Average 100 charachters takes 10 sec to read
    timeout = if msg.length < 50 then API.notificationMinTimeOut else (msg.length * 100)
    ## Trigger a ui notification.
    $.snackbar({
      content: msg
      style: 'type-' + severity
      timeout: timeout
    })
