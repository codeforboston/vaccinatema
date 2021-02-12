from . import Backend, VaccineSlots, Availability
import requests
import arrow

class CurativeBackend(Backend):
    TESTING_SITES_API = "https://labtools.curativeinc.com/api/v1/testing_sites/%s"
    PUBLIC_URL = "https://curative.com/sites/%s"

    def __init__(self, locid, min_count=1):
        self.locid = locid
        self.min_count = min_count

    def __repr__(self):
        return "CurativeBackend(%s)" % self.locid

    def public_url(self):
        return self.PUBLIC_URL % self.locid

    def get_testing_sites(self):
        r = requests.get(self.TESTING_SITES_API % self.locid)
        return r.json()
    
    def prettify(self, win):
        return ("*Slots available:* *%d*/%d " % (win["slots_available"], win["total_slots"])) + \
               ("*%s* (%s - %s) " % (self.humanize_date(win["start_time"]), self.prettify_date(win["start_time"]), self.prettify_date(win["end_time"]))) + \
               ("\n_public: %d/%d, " % (win["public_slots_available"], win["public_slots"])) + \
               ("first responder: %d/%d, " % (win["first_responder_slots_available"], win["first_responder_slots"])) + \
               ("symptomatic: %d/%d_ " % (win["symptomatic_slots_available"], win["symptomatic_slots"]))
    
    def struct(self, win, sites):
        return Availability(
            date=win["start_time"],
            location=sites["name"],
            address="%s, %s, %s %s" % (sites["street_address_1"], sites["city"], sites["state"], sites["postal_code"]),
            count=win["slots_available"],
            vaccine_type=None,
            details=("public: %d/%d, " % (win["public_slots_available"], win["public_slots"])) + \
               ("first responder: %d/%d, " % (win["first_responder_slots_available"], win["first_responder_slots"])) + \
               ("symptomatic: %d/%d" % (win["symptomatic_slots_available"], win["symptomatic_slots"]))
        )

    def humanize_date(self, d):
        return arrow.get(d).humanize()

    def prettify_date(self, d):
        return arrow.get(d).format('MM/DD/YYYY hh:mma')

    def get_slots(self):
        sites = self.get_testing_sites()
        s = VaccineSlots("%s (%s, %s, %s %s)" % (sites["name"], sites["street_address_1"], sites["city"], sites["state"], sites["postal_code"]), self.public_url())

        for win in sites["appointment_windows"]:
            if win["slots_available"] > 0:
                s.add_slot(self.prettify(win), struct=self.struct(win, sites))

        return s

    def slots_available(self):
        s = self.get_slots()
        return len(s.slots) >= self.min_count