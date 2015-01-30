###
  Our generic global helpers so we dont have add complexity to our app.
###
helpers.global =

  ## Shuffle an array.
  shuffle: (array) ->
    i = array.length - 1
    while i > 0
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
      i--
    array

  ## Get a random number within a range.
  getRandomInt: (min, max) ->
    Math.floor(Math.random() * (max - min + 1)) + min
