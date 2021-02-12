from . import Notifier
from airtable import Airtable
from datetime import datetime, timedelta
import arrow
import os

class AirtableNotifier(Notifier):
	def notify(self, slots):
		api_key = os.getenv('AIRTABLE_API_KEY')
		airtable = Airtable('applrO42eyJ3rUQyb', 'MaVaccSites_Today', api_key)
		if ("danvers" in slots.location.lower()) and ("doubletree" in slots.location.lower()):
			record = airtable.match('Location Name', "Danvers: Doubletree Hotel")

		currdate = ''
		currcount = 0
		results = ''
		for s in slots.slots_struct:
			if (currdate == arrow.get(s.date).format('MM/DD/YYYY')):
				currcount += s.count
			else:
				if currcount > 0:
					results = results + currdate + ': ' + str(currcount) + '\n'
				currdate = arrow.get(s.date).format('MM/DD/YYYY')
				currcount = s.count
		if currcount > 0:
			results = results + currdate + ': ' + str(currcount) + '\n'

		my_date = datetime.now() + timedelta(hours=5)
		fields = {'Availability': results, 'Last Updated': my_date.isoformat()}
		airtable.update(record['id'], fields)

	def notify_problem(self, message):
		print("PROBLEM: %s" % message)