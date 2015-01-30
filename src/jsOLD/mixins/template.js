/**
 * Template helpers.
 */

/**
 * The base template object.
 */
app.template = {
  store: {}
};

/**
 * Preloaded templates.
 */
app.template.preLoadedTemplates = [
  'Shell',
  'NavMain'
];

/**
 * Get load multiple templates.
 */
app.template.loadTemplates = function (templateKeys, callback) {

  var deferreds = [];

  // Loop over the templates and load each.
  $.each(templateKeys, function (index, template) {
    deferreds.push($.get('tpl/' + template + '.html', function (data) {

      // Store the template.
      app.template.store[template] = data; //_.template(data);

      // If the template has a view then save as a prototype template.
      if (app[template] && app[template].View) {
        app[template].View.prototype.template = Backbone.Marionette.TemplateCache.get(template);
      }

    }, 'html'));
  });

  // Callback after all are loaded.
  $.when.apply(null, deferreds).done(callback);

};

/**
 * Load a template
 */
app.template.getTemplate = function (template, callback) {
  var req = app.request.ajax('tpl/' + template + '.html');
  req.then(callback, app.debug.requestError);
};

/**
 * Override how marionette gets the templates.
 */
Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId){
  return app.template.store[templateId];
};
