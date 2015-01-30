
app.Shell.View = Backbone.Marionette.LayoutView.extend({
  template: "Shell",

  regions: {
    regionNav: '#nav-bar',
    regionContent: '#content',
    regionSidebarFirst: '#sidebar-first',
    regionSidebarSecond: '#sidebar-second',
    regionTitle: '#page-title .title',
    regionTitleContext: '#page-title .context'
  }

//  initialize: function () {
//
//  },
//
//  render: function () {
//    this.$el.html(this.template());
//    return this;
//  }

});
