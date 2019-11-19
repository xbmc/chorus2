# Extend Marionettes template renderer to use JST.
do (Marionette) ->
	_.extend Marionette.Renderer,

    # So we don't have to add this to every template key.
		extension: [".jst"]

    # Override the default render method.
		render: (template, data) ->
			path = @getTemplate(template)
			throw "Template #{template} not found!" unless path
			path(data)

    # Add 'tpl' as the part of the path so we don't have to call it each time.
		getTemplate: (template) ->
      path = @insertAt(template.split("/"), -1, "tpl").join("/")
      path = path + @extension
      return JST[path] if JST[path]

    insertAt: (array, index, item) ->
      array.splice(index, 0, item)
      array