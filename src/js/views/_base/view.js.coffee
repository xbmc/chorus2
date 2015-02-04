@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->
	
  _remove = Marionette.View::remove

  _.extend Marionette.View::,

    ## Build a link.
    themeLink: (name, url, options = {}) ->
      _.defaults options,
        external: false,
        className: ''

      attrs =
        href: "#" + url unless options.external

      if options.className isnt ''
        attrs.class = options.className

      @themeTag 'a', attrs, name

    ## Parse tag attributes into a string.
    parseAttributes: (attrs) ->
      a = []
      for attr, val of attrs
        a.push "#{attr}='#{val}'"
      a.join(' ')

    ## Make a tag
    themeTag: (el, attrs, value) ->
      attrsString = @parseAttributes(attrs)
      "<#{el} #{attrsString}>#{value}</#{el}>"

