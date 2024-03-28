###
  Helper to return you to the same scroll position on the last page.
###
helpers.backscroll =
  lastPath: ''
  lastScroll: 0

  setLast: ->
    @lastPath = location.hash
    @lastScroll = document.body.scrollTop

  scrollToLast: ->
    scrollPos = if @lastPath is location.hash then @lastScroll else 0
    if scrollPos > 0
      window.scrollTo(0, scrollPos)

