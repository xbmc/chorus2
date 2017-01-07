@Kodi.module "LandingApp.Show", (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends App.Views.LayoutWithSidebarFirstView
    className: "landing-page"

  class Show.Page extends App.Views.LayoutView
    template: "apps/landing/show/landing_page"
    className: "landing-content"
    regions:
      regionHero: '#landing-hero'
      regionSection1: '#landing-section-1'
      regionSection2: '#landing-section-2'
      regionSection3: '#landing-section-3'
      regionSection4: '#landing-section-4'
      regionSection5: '#landing-section-5'
      regionSection6: '#landing-section-6'


  class Show.ListSet extends App.Views.LayoutView
    template: 'apps/landing/show/landing_set'
    className: "landing-set"
    onRender: =>
      if @options
        $header = $('h3.set-header', @$el)
        if @options.filter isnt false and @options.section.title
          $header.html( t.sprintf(tr(@options.section.title), @options.filter) )
        else if @options.section.title
          $header.html( tr(@options.section.title) )
        if @options.filter isnt false and @options.section.moreLink
          $header.append @themeLink tr('more'), @options.section.moreLink + @options.filter
        else if @options.section.moreLink
          $header.append @themeLink tr('more'), @options.section.moreLink
    regions:
      regionResult: '.set-results'