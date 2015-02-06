@Kodi.module "NotificationsApp", (NotificationApp, App, Backbone, Marionette, $, _) ->


  App.commands.setHandler "notification:show", (msg, severity = 'normal') ->
    ## Trigger a ui notification.
