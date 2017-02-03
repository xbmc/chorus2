@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
  _remove = Marionette.View::remove

  _.extend Marionette.View::,

    # Build a link.
    themeLink: (name, url, options = {}) ->
      _.defaults options,
        external: false,
        className: ''

      attrs = {}

      if options.external
        attrs.target = '_blank'
        attrs.href = url
      else
        attrs.href = '#' + url

      if options.className isnt ''
        attrs.class = options.className

      @themeTag 'a', attrs, name

    # Parse tag attributes into a string.
    parseAttributes: (attrs) ->
      a = []
      for attr, val of attrs
        val = String(val).split('"').join('&quot;')
        a.push attr + '="' + val + '"'
      a.join(' ')

    # Make a tag
    themeTag: (el, attrs, value) ->
      attrsString = @parseAttributes(attrs)
      "<#{el} #{attrsString}>#{value}</#{el}>"

    # Formats dynamic text using filers.
    formatText: (text, addInLineBreaks = false) ->
      # Filter via bb code (used in browser folder names)
      res = XBBCODE.process
        text: text
        removeMisalignedTags: true
        addInLineBreaks: addInLineBreaks
      if res.error is not false
        helpers.debug.msg 'formatText error: ' + res.errorQueue.join(', '), 'warning', res
      # return updated text
      res.html

    ## Populate a dropdown menu with items from the model
    populateMenu: (type = '') ->
      menu = ''
      baseSelector = 'dropdown-menu'
      if @model.get('menu')
        for key, val of @model.get('menu')
          if key.lastIndexOf('divider', 0) is 0
            key = 'divider'
          menu += @themeTag 'li', {class: key}, val
        selector = if type isnt '' then type + ' .' + baseSelector else baseSelector
        @$el.find('.' + selector).html(menu)

    populateModelMenu: ->
      @populateMenu()

    populateSetMenu: ->
      @populateMenu 'set__actions'