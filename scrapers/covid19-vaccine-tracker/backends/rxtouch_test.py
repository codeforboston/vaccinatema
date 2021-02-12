from .rxtouch import RxTouchBackend

import json

class RxTouchTestBackend(RxTouchBackend):
    def __init__(self, appointments=False):
        super().__init__("dummy", "01234")
        self.appointments = appointments
    
    def _query_index(self, s):
        pass

    def _query_set_location(self, s):
        pass

    def _query_appointments(self, s):
        text = open("backends/testdata/rxtouch_appointments.html", "r").read()
        if not self.appointments:
            text = text.replace('$.calendar.facilityId = 51589;', '$.calendar.facilityId = 0;')
        
        return text
    
    def _query_calendar(self, s, facilityId, month, year):
        if not self.appointments:
            raise Exception('There are not any appointments -- method should not be called')
        
        return {
            "Success": True,
            "Data": {
                "Month": 1,
                "Year": 2021,
                "Days": [{
                    "Available": False,
                    "DayOfWeek": "Monday",
                    "DayNumber": 1
                }, {
                    "Available": True,
                    "DayOfWeek": "Tuesday",
                    "DayNumber": 2
                }]
            }
        }