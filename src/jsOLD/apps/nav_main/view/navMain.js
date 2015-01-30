app.NavMain.View = Backbone.View.extend({

  initialize: function () {

  },

  render: function () {
    this.$el.html(this.template(this.model));
    return this;
  }

});
