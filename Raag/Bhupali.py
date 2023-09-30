from Raag.BaseRaag import BaseRaag


# Reference : http://www.tanarang.com/english/bhoopali_eng.htm

class Bhupali(BaseRaag):
    def __init__(self):
        vaadi_swar = 'ग'
        samvaadi_swar = 'ध'
        raag_notes = ['सा', 'रे', 'ग', 'प', 'ध']
        name = "Yaman"
        super().__init__(name, vaadi_swar, samvaadi_swar, raag_notes)
