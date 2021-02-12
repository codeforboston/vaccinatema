from .cvs import CVSPharmacyBackend

import json

class CVSPharmacyTestBackend(CVSPharmacyBackend):
    def __init__(self, appointments=False):
        super().__init__("dummy")
        self.appointments = appointments
    
    def generic_requests(self, req):
        pass

    def get_stores_json(self, req):
        data = json.loads(open("backends/testdata/cvs_stores.json", "r").read())
        for location in data["responsePayloadData"]["locations"]:
            store_id = location["schedulerRefId"]
            if store_id != "CVS_02256":
                location["immunizationAvailability"]["available"] = []
        
        return data
    
    def get_timeslots_json(self, start_date, end_date, store_id, req):
        if store_id == "CVS_02256" and self.appointments:
            return json.loads(open("backends/testdata/cvs_timeslots.json", "r").read())
        return {}