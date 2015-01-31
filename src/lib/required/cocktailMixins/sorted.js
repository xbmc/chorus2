(function (global) {

  /**
   * Sorted Mixin
   */
  var SortedMixin = {
    onBeforeRender: function() {
      this._isRendering = true;
    },

    onRender: function() {
      if(this.footer) {
        this.footerElement = this.$el.find(this.footer)[0];
      } else {
        this.footerElement = null;
      }

      delete this._isRendering;
    },

    appendHtml: function(collectionView, itemView, index) {
      var footerElement = this.footerElement;
      var el = collectionView.itemViewContainer || collectionView.el;
      var $el = collectionView.itemViewContainer ? $(collectionView.itemViewContainer) : collectionView.$el;

      // Shortcut - just place at the end!
      if (this._isRendering) {
        // if this is during rendering, then the views always come in sort order,
        // so just append
        if(footerElement) {
          itemView.$el.insertBefore(footerElement);
        } else {
          $el.append(itemView.el);
        }
        return;
      }

      // we are inserting views after rendering, find the adjacent view if there
      // is one already
      var adjView;

      if (index === 0) {
        // find the view that comes after the first one (sometimes there will be a
        // non view that is the first child so we can't prepend)
        adjView = findViewAfter(0);

        if (adjView) {
          itemView.$el.insertBefore(adjView.el);
        } else {
          // there are no existing views after the first,
          // we append (keeping the place of non-view children already present in the
          // container)
          if(footerElement) {
            itemView.$el.insertBefore(footerElement);
          } else {
            itemView.$el.appendTo(el);
          }
        }

        return;
      }

      if(index == collectionView.collection.length - 1) {
        if(footerElement) {
          itemView.$el.insertBefore(footerElement);
        } else {
          itemView.$el.appendTo(el);
        }
        return;
      }

      // find the view that comes before this one
      adjView = findViewAtPos(index - 1);
      if(adjView) {
        itemView.$el.insertAfter(adjView.$el);
      } else {
        // It could be the case that n-1 has not yet been inserted,
        // so we try find whatever is at n+1 and insert before
        adjView = findViewAfter(index);

        if(adjView) {
          itemView.$el.insertBefore(adjView.el);
        } else {
          // in this case, the itemViews are not coming in any sequential order
          // We can't find an item before, we can't find an item after,
          // just give up and insert at the end. (hopefully this will never happen eh?)
          //
          if(footerElement) {
            itemView.$el.insertBefore(footerElement);
          } else {
            itemView.$el.appendTo(el);
          }
        }
      }

      function findViewAfter(i) {
        var nearestI = 1;
        var adjView = findViewAtPos(i + 1);

        // find the nearest view that comes after this view
        while (!adjView && ((i + nearestI + 1) < collectionView.collection.length - 1)) {
          nearestI += 1;
          adjView = findViewAtPos(i + nearestI);
        }

        return adjView;
      }

      function findViewAtPos(i) {
        if (i >= collectionView.collection.length)
          return;

        var view = collectionView.children.findByModel(collectionView.collection.at(i));
        return view;
      }
    }
  };

  global.SortedMixin = SortedMixin;

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return SortedMixin;
    });
  }

  return SortedMixin;
})(window);





