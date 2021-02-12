import argparse
import time
import logging
import collections
import random
import datetime

from config import BACKENDS, NOTIFIERS

logger = logging.getLogger(__name__)

def parse_args():
    parser = argparse.ArgumentParser(description="Checks for available vaccination slots")
    parser.add_argument('--interval', '-i', dest='interval', type=int, default=300, help='The interval to check backends for')
    parser.add_argument('--exclude-night-hours', action='store_true', help='Skip running between 1am and 8am')
    parser.add_argument('--verbose', '-v', action='store_true', help='enable debug output')
    parser.add_argument('--test', '-t', action='store_true', help='use test backends (fake data)')
    parser.add_argument('--console', '-c', action='store_true', help='only use console backend')
    parser.add_argument('--csv', action='store_true', help='only use csv backend')
    parser.add_argument('--notify-exceptions', action='store_true', help='send a notification when there are more than exceptions_to_notify total exceptions raised for a given backend')
    parser.add_argument('--exceptions-to-notify', type=int, default=5, help='send a notification after a specific exception in a backend has occurred N or more times')

    return parser.parse_args()

def main():
    args = parse_args()
    if args.verbose:
        logging.basicConfig(level=logging.INFO)
    logger.info("Starting")
    
    problems = {}

    def get_backends():
        if args.test:
            from config import TEST_BACKENDS
            return TEST_BACKENDS

        return BACKENDS

    def get_notifiers():
        if args.console:
            from notifiers.console import ConsoleNotifier
            return [ConsoleNotifier()]
        
        if args.csv:
            from notifiers.csvlog import CSVLogNotifier
            return [CSVLogNotifier()]

        return NOTIFIERS
    
    def check_notify_problems():
        for b in problems:
            common = problems[b].most_common()
            to_alert = list(filter(lambda x: x[1] >= args.exceptions_to_notify and x[1] % args.exceptions_to_notify == 0, common))
            for exc, cnt in to_alert:
                msg = "Exception occurred %d times in %s: %s" % (cnt, b, exc)
                for n in get_notifiers():
                    try:
                        n.notify_problem(msg)
                    except Exception:
                        pass
    
    def process_problem(b, e):
        if b not in problems:
            problems[b] = collections.Counter()
        problems[b].update([e])
        cnt = problems[b].get(e)
        logger.exception("Logging failure for %s: '%s' has occurred %s times" % (b, e, cnt))
        check_notify_problems()

    def run_backend(b):
        try:
            if b.slots_available():
                logger.warning("Slots available for backend: %s" % b)
                slots = b.get_slots()
                if slots and slots.slots:
                    logger.warning("Available slots: %d" % len(slots.slots))
                    run_notify(slots)
            else:
                logger.info("No slots available for backend: %s" % b)
        except Exception as e:
            logger.exception("Unable to run backend: %s\n%s" % (b, e))
            process_problem('%s' % b, '%s' % e)

    def run_notify(slots):
        for n in get_notifiers():
            try:
                logger.warning("Running notify for %s (%s)" % (n, slots))
                n.notify(slots)
            except Exception:
                logger.exception("Unable to run notify: %s" % n)
    
    def is_night_hours():
        now = datetime.datetime.now()
        return now.hour >= 1 and now.hour <= 7

    while True:
        logger.info("Entering loop")

        if args.exclude_night_hours and is_night_hours():
            logger.info("Skipping - night hours")
        else:
            backends = get_backends()

            for b in backends:
                run_backend(b)

        secs = random.randint(int(0.75 * args.interval), int(1.25 * args.interval))
        logger.info("Sleeping for %d sec" % secs)
        time.sleep(secs)

if __name__ == '__main__':
    main()
