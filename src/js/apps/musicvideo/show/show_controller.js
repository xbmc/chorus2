// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("MusicVideoApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  const API = {

    bindTriggers(view) {
      App.listenTo(view, 'musicvideo:play', viewItem => App.execute('musicvideo:action', 'play', viewItem));
      App.listenTo(view, 'musicvideo:add', viewItem => App.execute('musicvideo:action', 'add', viewItem));
      App.listenTo(view, 'musicvideo:localplay', viewItem => App.execute('musicvideo:action', 'localplay', viewItem));
      App.listenTo(view, 'musicvideo:download', viewItem => App.execute('musicvideo:action', 'download', viewItem));
      App.listenTo(view, 'musicvideo:edit', viewItem => App.execute('musicvideo:edit', viewItem.model));
      return view;
    }
  };


  //# When viewing a full page we call the controller
  return Show.Controller = class Controller extends App.Controllers.Base {

    //# The MusicVideo page.
    initialize(options) {
      const id = parseInt(options.id);
      const musicvideo = App.request("musicvideo:entity", id);
      //# Fetch the video
      return App.execute("when:entity:fetched", musicvideo, () => {
        //# Get the layout.
        this.layout = this.getLayoutView(musicvideo);
        //# Listen to the show of our layout.
        this.listenTo(this.layout, "show", () => {
          this.getDetailsLayoutView(musicvideo);
          return this.getRelatedVideos(musicvideo);
        });
        //# Add the layout to content.
        return App.regionContent.show(this.layout);
      });
    }

    //# Get the base layout
    getLayoutView(musicvideo) {
      return new Show.PageLayout({
        model: musicvideo});
    }

    //# Build the details layout.
    getDetailsLayoutView(musicvideo) {
      const headerLayout = new Show.HeaderLayout({model: musicvideo});
      this.listenTo(headerLayout, "show", () => {
        const teaser = new Show.DetailTeaser({model: musicvideo});
        API.bindTriggers(teaser);
        const detail = new Show.Details({model: musicvideo});
        this.listenTo(detail, "show", () => {
          return API.bindTriggers(detail);
        });
        headerLayout.regionSide.show(teaser);
        return headerLayout.regionMeta.show(detail);
      });
      return this.layout.regionHeader.show(headerLayout);
    }

    //# Get some extra vids from youtube.
    getRelatedVideos(musicvideo) {
      const title = tr('Related music videos from YouTube');
      const opts = {maxResults: 8};
      return App.execute('youtube:list:view', musicvideo.get('title') + ' ' + musicvideo.get('artist'), title, opts, view => {
        return this.layout.regionContent.show(view);
      });
    }
  };
});
