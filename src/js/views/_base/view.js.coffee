@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
  _remove = Marionette.View::remove

  _.extend Marionette.View::,

    # Build a link. Link text gets escaped.
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

      $("<a>").attr(attrs).text(name).wrap('<div/>').parent().html()

    # Make a tag. Contents can be HTML (they are not escaped)
    themeTag: (el, attrs, value) ->
      $("<#{el}>").attr(attrs).html(value).wrap('<div/>').parent().html()

    # Formats dynamic text using filers. Returns HTML.
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
