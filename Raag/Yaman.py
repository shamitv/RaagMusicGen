from Raag.BaseRaag import BaseRaag


class Yaman(BaseRaag):
    def __init__(self):
        vaadi_swar = 'ग'
        samvaadi_swar = 'नि'
        raag_notes = ['सा', 'रे',  'ग',  'म’', 'प', 'ध', 'नि']
        name = "Yaman"
        super().__init__(name, vaadi_swar, samvaadi_swar, raag_notes)