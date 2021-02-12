class Backend:
    # bool: whether slots are available
    def slots_available(self):
        pass

    # VaccineSlots: returns slot data
    def get_slots(self):
        pass

    def __repr__(self):
        return "%s" % (self.__class__.__name__)

class Availability:
    def __init__(self, date=None, location=None, address=None, count=None, vaccine_type=None, details=None):
        self.date = date
        self.location = location
        self.address = address
        self.count = count
        self.vaccine_type = vaccine_type
        self.details = details

    def __str__(self):
        return "%s, %s, %s, %s, %s, %s" % (self.date, self.location, self.address, self.count, self.vaccine_type, self.details)


    def __repr__(self):
        return "Availability(%s)" % self.__str__()

class VaccineSlots:
    def __init__(self, location, url, slots=None):
        self.location = location
        self.url = url
        self.slots = slots or []
        self.slots_struct = []

    def add_slot(self, slot, struct=None):
        self.slots.append(slot)
        if struct:
            self.slots_struct.append(struct)

    def __str__(self):
        return "%s slots (%d)" % (self.location, len(self.slots))