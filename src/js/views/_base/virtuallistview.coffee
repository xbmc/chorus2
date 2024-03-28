@Kodi.module "Views", (Views, App, Backbone, Marionette, $, _) ->

  ## This is an extension of the list view that shows a placeholder until
  ## the child view is visible which greatly improves performance by removing
  ## 95% of the markup added to to the dom that is not visible until you
  ## scroll to it.
  ##
  ## Inspiration: http://blog.sprint.ly/post/42929468986/web-ui-rendering-performance
  ## Made this easy: https://github.com/customd/jquery-visible
  class Views.VirtualListView extends Views.CollectionView
    originalCollection: {}
    preload: 20
    originalChildView: {}
    buffer: 30
    cardSelector: '.card'
    animateFrameTrigger: "ui:animate:stop"
    placeHolderViewName: 'CardViewPlaceholder'

    ## Initial render before scrolling
    addChild: (child, ChildView, index) ->
      if index > @preload
        ChildView = App.Views[@placeHolderViewName]
      Backbone.Marionette.CollectionView.prototype.addChild.apply(this, arguments)


    ## Store the various views and bind scroll.
    initialize: ->
      @originalChildView = @getOption('childView')
      @placeholderChildView = App.Views[@placeHolderViewName]
      App.vent.on @animateFrameTrigger, () =>
        @renderItemsInViewport()

    ## incase the view re-rendered when we are not at the top.
    onRender: ->
      @renderItemsInViewport()

    ## Our callback for updating the viewport with visible items.
    renderItemsInViewport: () ->
      $cards = $(@cardSelector, @$el);
      visibleIndexes = []
      ## Get visible cards (show all if collection is less than preload)
      $cards.each (i, d) =>
        if $cards.length <= @preload || $(d).visible(true)
          visibleIndexes.push i
      # Check we have visible items before building a range
      visibleRange = []
      if visibleIndexes.length > 0
        min = _.min visibleIndexes
        max = _.max visibleIndexes
        ## Add the buffer.
        min = if (min - @buffer) < 0 then 0 else (min - @buffer)
        max = if (max + @buffer) >= $cards.length then ($cards.length - 1) else (max + @buffer)
        visibleRange = [min..max]
      ## Loop over the cards, show visible, hide the rest
      $cards.each (i, d) =>
        if $(d).hasClass('ph') and helpers.global.inArray(i, visibleRange)
          $(d).replaceWith @getRenderedChildView($(d).data('model'), @originalChildView, i)
        else if not $(d).hasClass('ph') and not helpers.global.inArray(i, visibleRange)
          $(d).replaceWith @getRenderedChildView($(d).data('model'), @placeholderChildView, i)

    ## Returns the child item with a new view, would be nice if marionette had a
    ## 'updateChildView' method but this will do.
    getRenderedChildView: (child, ChildView, index) ->
      childViewOptions = this.getOption('childViewOptions')
      childViewOptions = Marionette._getValue(childViewOptions, this, [child, index])
      view = this.buildChildView(child, ChildView, childViewOptions)
      @proxyChildEvents(view)
      view.render().$el

    ## When a link is clicked we store the scroll position so if they go back
    ## they are scrolled to the correct position
    events:
      "click a": "storeScroll"

    storeScroll: ->
      helpers.backscroll.setLast()

    onShow: ->
      helpers.backscroll.scrollToLast()
