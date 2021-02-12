from . import Backend, VaccineSlots, Availability
import requests

"""This is an example backend for a ficticious website. It does not function."""
class ExampleBackend(Backend):

    """Pass any arguments needed as configuration here."""
    def __init__(self, zip):
        self.zip = zip

    def __repr__(self):
        return "ExampleBackend(%s)" % (self.zip)
    
    """Return a user-accessible URL to jump to a registration page."""
    def public_url(self):
        return "http://example.com/register/%s" % self.zip

    """Return whether there are any open registration slots."""
    def slots_available(self):
        r = requests.get("http://example.com/vaccination_appointments")
        return len(r.json()) > 0

    """
    Return a VaccineSlots object, containing general site info, public URL,
    and a list of strings about each slot (e.g., time/date/location)
    """
    def get_slots(self):
        slots = VaccineSlots("The example vaccination clinic", self.public_url())
        r = requests.get("http://example.com/vaccination_appointments")

        for appointment in r.json():
            slots.add_slot("%s on %s" % (appointment["time"], appointment["date"]), struct=Availability(
                date="%s %s" % (appointment["date"], appointment["time"]),
                location="Fake Location",
                address="123 Fake St.",
                count=50,
                vaccine_type="Moderna",
                details="Available to those > 75 years old"
            ))
        
        return slots
