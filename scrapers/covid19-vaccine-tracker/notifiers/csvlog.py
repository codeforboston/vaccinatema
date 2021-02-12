from . import Notifier

import csv
import os
import datetime

class CSVLogNotifier(Notifier):
    def __init__(self, filename='output.csv'):
        self.filename = filename
        if not os.path.exists(self.filename):
            with open(self.filename, 'w') as f:
                cw = csv.writer(f)
                cw.writerow(['Date', 'Location', 'Address', 'Count', 'Vaccine Type', 'Details', 'Backend Location', 'Backend URL'])

    def notify(self, slots):
        with open(self.filename, 'a') as f:
            cw = csv.writer(f)
            for s in slots.slots_struct:
                print('struct: %s' % s)
                cw.writerow([
                    s.date,
                    s.location,
                    s.address,
                    s.count,
                    s.vaccine_type,
                    s.details,
                    slots.location,
                    slots.url
                ])
    
    def notify_problem(self, message):
        print("PROBLEM: %s" % message)