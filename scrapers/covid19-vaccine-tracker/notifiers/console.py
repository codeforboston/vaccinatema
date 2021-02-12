from . import Notifier

class ConsoleNotifier(Notifier):
    def notify(self, slots):
        print("--NOTIFY: %s" % slots.location)
        for s in slots.slots:
            print("\n".join(["\t%s" % i for i in s.splitlines()]))
        print("--")
    
    def notify_problem(self, message):
        print("PROBLEM: %s" % message)