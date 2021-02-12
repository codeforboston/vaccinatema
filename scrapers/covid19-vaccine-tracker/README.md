# COVID-19 Vaccine Tracker

https://github.com/jwoglom/covid19-vaccine-tracker

This is a basic Python project which allows for curation of vaccine sign-up _backends_, as well as _notifiers_, and runs a rudimentary check of each backend at a specified interval and, if there are doses available, alerts via the configured notifiers.

Please be a good citizen by ensuring those who need the vaccine are able to get it first.

Currently, the following services are live updating our Airtable backend:
* Curative (curative.com/sites/<location_id>)
TBD:
* RxTouch (<location_id>.rxtouch.com/covid19/Patient/Advisory)
* CVS Pharmacy (cvs.com/vaccine/intake/store/cvd-schedule) _**Note:** after a few attempts, CVS currently detects this script as a bot and blocks further requests. Some additional work will be necessary to avoid being banned._ 
* MAImmunizations (maimmunizations.org)

The following notifiers are supported:
* Console (to stdout, for debugging)
* CSV log (appends all available appointments to a csv file for later review)
* Slack (via webhook -- specify API token, slack channel, and bot username in config.py)
* Airtable

Currently a work-in-progress.

## Setup

Rename `config.py.example` to `config.py` and tweak its parameters (e.g., ZIP code, location radius, etc).

Then, run `pipenv run python3 main.py` to run the application using Pipenv.
For verbose logging, add `-v`.
To adjust the check interval, specify `-i <seconds>`.

See `--help` for more options.

## License

This code may be used, modified, or adapted for any non-commercial purpose related to helping individuals become vaccinated against COVID-19, as long as attribution is provided to the original project, which can be found here: https://github.com/jwoglom/covid19-vaccine-tracker
