// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Helper to return you to the same scroll position on the last page.
*/
helpers.backscroll = {
  lastPath: '',
  lastScroll: 0,

  setLast() {
    this.lastPath = location.hash;
    return this.lastScroll = document.body.scrollTop;
  },

  scrollToLast() {
    const scrollPos = this.lastPath === location.hash ? this.lastScroll : 0;
    if (scrollPos > 0) {
      return window.scrollTo(0, scrollPos);
    }
  }
};

