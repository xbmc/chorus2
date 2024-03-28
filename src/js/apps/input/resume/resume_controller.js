// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("InputApp.Resume", (Resume, App, Backbone, Marionette, $, _) => Resume.Controller = class Controller extends App.Controllers.Base {

  //# Ask to resume playback if the model has a resume position
  //# Currently only supports Kodi playback
  resumePlay(model, idKey) {
    const stateObj = App.request("state:current");
    const title = t.gettext('Resume playback');
    const resume = model.get('resume');
    let percent = 0;
    const options = [];

    // If resume position position
    if ((parseInt(resume.position) > 0) && (stateObj.getPlayer() === 'kodi')) {
      // Get percent
      percent = helpers.global.getPercent(resume.position, resume.total);

      // Build strings
      const time_string = helpers.global.formatTime(helpers.global.secToTime(resume.position));
      const complete_string = helpers.global.round(percent, 0) + '% ' + t.gettext('complete');
      const resume_string = t.gettext('Resume from') + ' <strong>' + time_string + '</strong> <small>' + complete_string + '</small>';
      const start_string = t.gettext('Start from the beginning');

      // build options as an array of jQuery objects
      const items = [{title: resume_string, percent}, {title: start_string, percent: 0}];
      for (var item of items) {
        var $el = $('<span>')
        .attr('data-percent', item.percent)
        .html(item.title)
        .click(function(e){
          // Callback for option click
          return App.execute("command:video:play", model, idKey, $(this).data('percent'));
        });
        options.push($el);
      }

      // Open options in a modal
      return App.execute("ui:modal:options", title, options);
    } else {
      // No resume point or resume is 0%
      return App.execute("command:video:play", model, idKey, 0);
    }
  }

  initialize() {}
});
      // Something.
