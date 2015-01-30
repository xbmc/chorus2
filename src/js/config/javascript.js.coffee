Array::insertAt = (index, item) ->
	@splice(index, 0, item)
	@