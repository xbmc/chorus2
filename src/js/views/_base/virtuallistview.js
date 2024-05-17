// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
this.Kodi.module("Views", (Views, App, Backbone, Marionette, $, _) => //# This is an extension of the list view that shows a placeholder until
//# the child view is visible which greatly improves performance by removing
//# 95% of the markup added to to the dom that is not visible until you
//# scroll to it.
//#
//# Inspiration: http://blog.sprint.ly/post/42929468986/web-ui-rendering-performance
//# Made this easy: https://github.com/customd/jquery-visible
(function() {
  const Cls = (Views.VirtualListView = class VirtualListView extends Views.CollectionView {
    static initClass() {
      this.prototype.originalCollection = {};
      this.prototype.preload = 20;
      this.prototype.originalChildView = {};
      this.prototype.buffer = 30;
      this.prototype.cardSelector = '.card';
      this.prototype.animateFrameTrigger = "ui:animate:stop";
      this.prototype.placeHolderViewName = 'CardViewPlaceholder';

      //# When a link is clicked we store the scroll position so if they go back
      //# they are scrolled to the correct position
      this.prototype.events =
        {"click a": "storeScroll"};
    }

    //# Initial render before scrolling
    addChild(child, ChildView, index) {
      if (index > this.preload) {
        ChildView = App.Views[this.placeHolderViewName];
      }
      return Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments);
    }


    //# Store the various views and bind scroll.
    initialize() {
      this.originalChildView = this.getOption('childView');
      this.placeholderChildView = App.Views[this.placeHolderViewName];
      return App.vent.on(this.animateFrameTrigger, () => {
        return this.renderItemsInViewport();
      });
    }

    //# incase the view re-rendered when we are not at the top.
    onRender() {
      return this.renderItemsInViewport();
    }

    //# Our callback for updating the viewport with visible items.
    renderItemsInViewport() {
      const $cards = $(this.cardSelector, this.$el);
      const visibleIndexes = [];
      //# Get visible cards (show all if collection is less than preload)
      $cards.each((i, d) => {
        if (($cards.length <= this.preload) || $(d).visible(true)) {
          return visibleIndexes.push(i);
        }
      });
      // Check we have visible items before building a range
      let visibleRange = [];
      if (visibleIndexes.length > 0) {
        let min = _.min(visibleIndexes);
        let max = _.max(visibleIndexes);
        //# Add the buffer.
        min = (min - this.buffer) < 0 ? 0 : (min - this.buffer);
        max = (max + this.buffer) >= $cards.length ? ($cards.length - 1) : (max + this.buffer);
        visibleRange = __range__(min, max, true);
      }
      //# Loop over the cards, show visible, hide the rest
      return $cards.each((i, d) => {
        if ($(d).hasClass('ph') && helpers.global.inArray(i, visibleRange)) {
          return $(d).replaceWith(this.getRenderedChildView($(d).data('model'), this.originalChildView, i));
        } else if (!$(d).hasClass('ph') && !helpers.global.inArray(i, visibleRange)) {
          return $(d).replaceWith(this.getRenderedChildView($(d).data('model'), this.placeholderChildView, i));
        }
      });
    }

    //# Returns the child item with a new view, would be nice if marionette had a
    //# 'updateChildView' method but this will do.
    getRenderedChildView(child, ChildView, index) {
      let childViewOptions = this.getOption('childViewOptions');
      childViewOptions = Marionette._getValue(childViewOptions, this, [child, index]);
      const view = this.buildChildView(child, ChildView, childViewOptions);
      this.proxyChildEvents(view);
      return view.render().$el;
    }

    storeScroll() {
      return helpers.backscroll.setLast();
    }

    onShow() {
      return helpers.backscroll.scrollToLast();
    }
  });
  Cls.initClass();
  return Cls;
})());

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}