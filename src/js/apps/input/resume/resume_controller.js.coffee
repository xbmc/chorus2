@Kodi.module "InputApp.Resume", (Resume, App, Backbone, Marionette, $, _) ->

	class Resume.Controller extends App.Controllers.Base

		## Ask to resume playback if the model has a resume position
		## Currently only supports Kodi playback
		resumePlay: (model, idKey) ->
			stateObj = App.request "state:current"
			title = t.gettext('Resume playback')
			resume = model.get('resume')
			percent = 0
			options = []

			# If resume position position
			if parseInt(resume.position) > 0 and stateObj.getPlayer() is 'kodi'
				# Get percent
				percent = helpers.global.getPercent(resume.position, resume.total)

				# Build strings
				time_string = helpers.global.formatTime(helpers.global.secToTime(resume.position))
				complete_string = helpers.global.round(percent, 0) + '% ' + t.gettext('complete')
				resume_string = t.gettext('Resume from') + ' <strong>' + time_string + '</strong> <small>' + complete_string + '</small>'
				start_string = t.gettext('Start from the beginning')

				# build options as an array of jQuery objects
				items = [{title: resume_string, percent: percent}, {title: start_string, percent: 0}]
				for item in items
					$el = $('<span>')
					.attr('data-percent', item.percent)
					.html(item.title)
					.click (e)->
						# Callback for option click
						App.execute "command:video:play", model, idKey, $(@).data('percent')
					options.push $el

				# Open options in a modal
				App.execute "ui:modal:options", title, options
			else
				# No resume point or resume is 0%
				App.execute "command:video:play", model, idKey, 0

		initialize: ->
			# Something.
