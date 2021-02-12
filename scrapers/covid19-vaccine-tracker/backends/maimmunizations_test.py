from .maimmunizations import MAImmunizationsBackend

from bs4 import BeautifulSoup

class MAImmunizationsTestBackend(MAImmunizationsBackend):
    def __init__(self, appointments=False):
        super().__init__("dummy")
        self.appointments = appointments

    def get_soup(self, page):
        text = ""
        if page in (1, 2):
            text = open("backends/testdata/maimmunizations.html", "r").read()
        
        if self.appointments and page == 2:
            text = text.replace(":</strong> 0</p>", ":</strong> 3</p>")
        
        return BeautifulSoup(text, 'html.parser')

        
