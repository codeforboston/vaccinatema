from . import Backend, VaccineSlots, Availability
import requests
import re
import logging
import datetime

logger = logging.getLogger(__name__)

class RxTouchBackend(Backend):
    INDEX_URL = "https://%s.rxtouch.com/rbssched/program/covid19/Patient/Advisory"
    CHECK_ZIP_API = "https://%s.rxtouch.com/rbssched/program/covid19/Patient/CheckZipCode"

    SET_LOCATION_URL = "https://%s.rxtouch.com/rbssched/program/covid19/Patient/SetLocation?mode=0"
    APPOINTMENT_URL = "https://%s.rxtouch.com/rbssched/program/covid19/Patient/Schedule?zip=%s&appointmentType=5957"
    PATIENT_CALENDAR_API = "https://%s.rxtouch.com/rbssched/program/covid19/Calendar/PatientCalendar"

    NOT_AVAIL_MSG = "There are no locations with available appointments"

    def __init__(self, locid, zip):
        self.locid = locid
        self.zip = zip

    def __repr__(self):
        return "RxTouchBackend(%s, %s)" % (self.locid, self.zip)
    
    def public_url(self):
        return self.INDEX_URL % self.locid
    

    def _query_index(self, s):
        s.get(self.INDEX_URL % self.locid)

    def _query_set_location(self, s):
        s.post(self.SET_LOCATION_URL % (self.locid), data={
                "AppointmentType": 5957,
                "AppointmentTypeText": "",
                "zip": "%s" % self.zip
            })
    
    def _query_appointments(self, s):
        r = s.get(self.APPOINTMENT_URL % (self.locid, self.zip))
        if r.status_code >= 300:
            raise Exception('Problem getting appointments (%d): %s' % (r.status_code, r.text))
        return r.text
    
    def _query_calendar(self, s, facilityId, month, year):
        r = s.post(self.PATIENT_CALENDAR_API % self.locid, data={
            "facilityId": facilityId,
            "month": month,
            "year": year,
            "snapCalendarToFirstAvailMonth": "false"
        })
        if r.status_code >= 300:
            raise Exception('Problem getting calendar (%d): %s' % (r.status_code, r.text))
        return r.json()

    def check_calendar(self):
        with requests.Session() as s:
            # Initialize cookies
            self._query_index(s)

            # r = s.post(self.CHECK_ZIP_API % self.locid, data={
            #     "zip": self.zip,
            #     "appointmentType": 5957,
            #     "PatientInterfaceMode": 0
            # })
            # output = r.text

            self._query_set_location(s)

            text = self._query_appointments(s)

            facilityIdRe = re.compile('\\$.calendar.facilityId = (.*);')
            facilityId = facilityIdRe.search(text)

            if facilityId is not None:
                facilityId = facilityId.group(1)
            else:
                raise Exception("RxTouch: no facility id could be found on page")
            
            if facilityId == "0":
                logger.info("RxTouch: facility id empty")
                return {"name": None, "calendar": None}

            facilityNameRe = re.compile('<input type="hidden" id="hdn%s" value="(.*)" />' % facilityId)
            facilityName = facilityNameRe.search(text).group(1)

            monthRe = re.compile('\\$.calendar.month = (.*);')
            month = monthRe.search(text).group(1)
            yearRe = re.compile('\\$.calendar.year = (.*);')
            year = yearRe.search(text).group(1)

            cal = self._query_calendar(s, facilityId, month, year)
            return {"name": facilityName, "calendar": cal}
        return {}
    
    def calendar_process(self):
        output = self.check_calendar()
        name = output["name"]
        c = output["calendar"]

        if name is None and c is None:
            return [], None

        if not c['Success']:
            logger.warning("Checking rxtouch calendar was not success: %s" % c)
            return [], None
        
        dates = []
        yr = c['Data']['Year']
        month = c['Data']['Month']
        for days in c['Data']['Days']:
            if days['Available']:
                dates.append((days['DayOfWeek'], days['DayNumber'], month, yr))
        
        return dates, name


    def slots_available(self):
        dates, name = self.calendar_process()
        return len(dates) > 0

    def get_slots(self):
        dates, name = self.calendar_process()
        s = VaccineSlots(name, self.public_url())
        for day in dates:
            s.add_slot("%s %s %s, %s" % (day[0], day[2], day[1], day[3]), struct=Availability(
                date=datetime.datetime(day[3], day[2], day[1]),
                location=name,
                address=None,
                count=None,
                vaccine_type=None,
                details=None
            ))
        
        return s
