// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", function(Views, App, Backbone, Marionette, $, _) {

  return Views.ItemView = class ItemView extends Backbone.Marionette.ItemView {

    // Close dropdown on blur
    onShow() {
      return this.menuBlur();
    }

    //# Toggle menu open class on row. Call this in onShow().
    menuBlur() {
      $('.dropdown', this.$el).on('show.bs.dropdown', () => {
        return this.$el.addClass('menu-open');
      });
      $('.dropdown', this.$el).on('hide.bs.dropdown', () => {
        return this.$el.removeClass('menu-open');
      });
      return $('.dropdown', this.$el).on('click', function() {
        return $(this).removeClass('open').trigger('hide.bs.dropdown');
      });
    }

    //# Trigger watched and pass the view so the dom can be actioned on.
    toggleWatched(e) {
      return this.trigger("toggle:watched", {view: this});
    }

    //# Adds the watched class if required
    watchedAttributes(baseClass = ''){
      const classes = [baseClass];
      if (App.request("thumbsup:check", this.model)) {
        classes.push('thumbs-up');
      }
      if (helpers.entities.isWatched(this.model)) {
        classes.push('is-watched');
      }
      return {
        class: classes.join(' ')
      };
    }

    //# Method to enable toggle selection. Needs to be added as an event to the
    //# view that utilizes it
    toggleSelect(e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Disable selection with items with prevent-select
        // TODO: make it work on mixed collections (thumbsup) or move check elsewhere
        if (!this.$el.hasClass('prevent-select') && (helpers.url.arg(0) !== 'thumbsup')) {
          this.$el.toggleClass('selected');
          const op = this.$el.hasClass('selected') ? 'add' : 'remove';
          return App.execute("selected:update:items", op, this.model.toJSON());
        }
      }
    }
  };
});
