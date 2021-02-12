from . import Backend, VaccineSlots, Availability

import requests
from bs4 import BeautifulSoup

class MAImmunizationsBackend(Backend):
    QUERY_URL = "https://www.maimmunizations.org/clinic/search?q[services_name_in][]=Vaccination&q[venue_search_name_or_venue_name_i_cont]=&q[clinic_date_eq]=&q[vaccinations_name_i_cont]=&location=%s&search_radius=%s+miles&commit=Search&page=%d"

    # in lowercase
    AVAIL_TEXT = "available appointments"
    OFFERED_TEXT = "vaccinations offered"

    def __init__(self, address, radius_miles="25"):
        self.address = address
        self.radius_miles = radius_miles

    def __repr__(self):
        return "MAImmunizationsBackend(%s, %s)" % (self.address, self.radius_miles)
    
    def public_url(self, page=1):
        return self.QUERY_URL % (self.address, self.radius_miles, page)

    """Return whether there are any open registration slots."""
    def slots_available(self):
        return len(self.get_slots().slots) > 0

    def get_soup(self, page):
        r = requests.get(self.public_url(page))
        soup = BeautifulSoup(r.text, 'html.parser')

        return soup

    def read_page(self, page=1):
        def fmt(t):
            t = t.replace('\n', '').strip()
            if t.endswith(':'):
                t = t[:-1]
            if t.startswith(':'):
                t = t[1:]
            return t.strip()

        soup = self.get_soup(page)

        all_results = []
        open_results = []

        for item in soup.select('.field-fullwidth > .flex > div'):
            title = item.select('h1')
            if title:
                title = title[0].text
            address = item.select('h4')
            if address:
                address = address[0].text

            fields = {"title": title, "address": address}

            for f in item.select('p strong'):
                key = fmt(f.text)
                fields[key.lower()] = fmt(fmt(f.parent.text).split('%s' % key)[1])
            
            all_results.append(fields)
            if self.AVAIL_TEXT in fields and fields[self.AVAIL_TEXT] != "0":
                open_results.append(fields)
        
        return all_results, open_results
    
    def to_text(self, fields):
        return "*%s* (%s): %s for %s" % (fields["title"], fields["address"], fields[self.AVAIL_TEXT], fields[self.OFFERED_TEXT])

    """
    Return a VaccineSlots object, containing general site info, public URL,
    and a list of strings about each slot (e.g., time/date/location)
    """
    def get_slots(self):
        slots = VaccineSlots("MAImmunizations.org", self.public_url())

        p = 1
        while True:
            all_results, open_results = self.read_page(p)
            if len(all_results) == 0:
                break

            for r in open_results:
                loc = r["title"]
                date = ""
                if " on " in r["title"]:
                    loc, date = r["title"].split(" on ", 1)

                slots.add_slot(self.to_text(r), struct=Availability(
                    date=date,
                    location=loc,
                    address=r["address"],
                    count=r[self.AVAIL_TEXT],
                    vaccine_type=r[self.OFFERED_TEXT]
                ))
            
            p += 1
        
        return slots


        

