// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  A collection of small jquery plugin helpers.
*/


// Remove a class matching a regex
// http://stackoverflow.com/a/18621161
//# usage: $('#hello').removeClassRegex(/^color-/)
$.fn.removeClassRegex = function(regex) {
  return $(this).removeClass((index, classes) => classes.split(/\s+/).filter(c => regex.test(c)).join(' '));
};

//# Remove classes starting with...
$.fn.removeClassStartsWith = function(startsWith) {
  return this.each(function(i, el) {
    const classes = el.className.split(" ").filter(c => c.lastIndexOf(startsWith, 0) !== 0);
    el.className = $.trim(classes.join(" "));
    return this;
  });
};

//# On scroll stop
//# http://stackoverflow.com/a/14035162
$.fn.scrollStopped = function(callback) {
  const $this = $(this);
  const self = this;
  return $this.scroll(function() {
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    return $this.data('scrollTimeout', setTimeout(callback, 250, self));
  });
};

//# On resize stop
$.fn.resizeStopped = function(callback) {
  const $this = $(this);
  const self = this;
  return $this.resize(function() {
    if ($this.data('resizeTimeout')) {
      clearTimeout($this.data('resizeTimeout'));
    }
    return $this.data('resizeTimeout', setTimeout(callback, 250, self));
  });
};


//# Filter options via search box.
//# TODO: refactor.
$.fn.filterList = function(settings, callback) {
  const $this = $(this);
  const defaults = {
    hiddenClass: 'hidden',
    items: '.filter-options-list li',
    textSelector: '.option'
  };
  settings = $.extend(defaults, settings);
  return $this.on('keyup', () => {
    const val = $this.val().toLocaleLowerCase();
    const $list = $(settings.items).removeClass(settings.hiddenClass);
    if (val.length > 0) {
      $list.each(function(i, d) {
        const text = $(d).find(settings.textSelector).text().toLowerCase();
        if (text.indexOf(val) === -1) {
          return $(d).addClass(settings.hiddenClass);
        }
      });
    }
    if (typeof callback === "function") {
      return callback();
    }
  });
};


$(document).ready(function() {
  //# Hide dropdowns on click of item - why doesnt it do this already????
  $('.dropdown li').on('click', function() {
    return $(this).closest('.dropdown').removeClass('open');
  });
  return $('.dropdown').on('click', function() {
    return $(this).removeClass('open').trigger('hide.bs.dropdown');
  });
});

