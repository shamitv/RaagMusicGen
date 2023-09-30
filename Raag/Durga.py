from Raag.BaseRaag import BaseRaag


class Durga(BaseRaag):
    def __init__(self):
        vaadi_swar = 'म'
        samvaadi_swar = 'सा'
        raag_notes = ['सा', 'रे', 'म', 'प', 'ध']
        name = "Durga"
        super().__init__(name, vaadi_swar, samvaadi_swar, raag_notes)