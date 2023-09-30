import os.path
import random

from Raag.BaseRaag import BaseRaag
from musictree import Score, Part
from MusicNotes import ChordGen


class Malkauns(BaseRaag):
    def __init__(self):
        vaadi_swar = 'म'
        samvaadi_swar = 'सा'
        raag_notes = ['सा', 'ग(k)', 'म', 'ध(k)', 'नि(k)']
        name = "Malkauns"
        super().__init__(name,vaadi_swar,samvaadi_swar,raag_notes)



