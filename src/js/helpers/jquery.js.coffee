###
  A collection of small jquery plugin helpers.
###


# Remove a class matching a regex
# http://stackoverflow.com/a/18621161
## usage: $('#hello').removeClassRegex(/^color-/)
$.fn.removeClassRegex = (regex) ->
  $(@).removeClass (index, classes) ->
    classes.split(/\s+/).filter (c) ->
      regex.test c
    .join ' '

## Remove classes starting with...
$.fn.removeClassStartsWith = (startsWith) ->
  regex = new RegExp('^' + startsWith, 'g');
  $(@).removeClassRegex(regex)

## On scroll stop
## http://stackoverflow.com/a/14035162
$.fn.scrollStopped = (callback) ->
  $this = $(this)
  self = this
  $this.scroll ->
    if $this.data('scrollTimeout')
      clearTimeout $this.data('scrollTimeout')
    $this.data 'scrollTimeout', setTimeout(callback, 250, self)

## On resize stop
$.fn.resizeStopped = (callback) ->
  $this = $(this)
  self = this
  $this.resize ->
    if $this.data('resizeTimeout')
      clearTimeout $this.data('resizeTimeout')
    $this.data 'resizeTimeout', setTimeout(callback, 250, self)


## Filter options via search box.
## TODO: refactor.
$.fn.filterList = (settings, callback) ->
  $this = $(this)
  defaults =
    hiddenClass: 'hidden'
    items: '.filter-options-list li'
    textSelector: '.option'
  settings = $.extend defaults, settings
  $this.on 'keyup', =>
    val = $this.val().toLocaleLowerCase()
    $list = $(settings.items).removeClass(settings.hiddenClass)
    if val.length > 0
      $list.each (i, d) ->
        text = $(d).find(settings.textSelector).text().toLowerCase()
        if text.indexOf(val) is -1
          $(d).addClass(settings.hiddenClass)
    if typeof callback is "function"
      callback()


$(document).ready ->
  ## Hide dropdowns on click of item - why doesnt it do this already????
  $('.dropdown li').on 'click', ->
    $(@).closest('.dropdown').removeClass('open')
  $('.dropdown').on 'click', ->
    $(@).removeClass('open').trigger('hide.bs.dropdown')

