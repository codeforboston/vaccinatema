from .curative import CurativeBackend
import json

class CurativeTestBackend(CurativeBackend):
    def __init__(self, appointments=False):
        super().__init__("dummy")
        self.appointments = appointments

    def get_testing_sites(self):
        data = json.loads(open("backends/testdata/curative.json", "r").read())
        if self.appointments:
            data["appointment_windows"][0]["slots_available"] = 3
            data["appointment_windows"][0]["public_slots_available"] = 3
        
        return data
