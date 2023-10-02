# Initial instrument list
# Guitar    0 : Acoustic Guitar : pluck.guitar.acoustic
# Flute     1 : Flute           : wind.flutes.flute
# Sitar     2 : Sitar           : pluck.sitar
# Piano     3 : Grand Piano     : keyboard.piano.grand
# Harmonium 4 : Harmonium       : keyboard.harmonium

# Source : https://musescore.org/en/instruments
class Instrument:
    def __init__(self):
        self.instruments = {0: {'name': 'Guitar',           'sound_id': 'pluck.guitar.acoustic'},
                            1: {'name': 'Flute',            'sound_id': 'wind.flutes.flute'},
                            2: {'name': 'Sitar',            'sound_id': 'pluck.sitar'},
                            3: {'name': 'Piano',            'sound_id': 'keyboard.piano.grand'},
                            4: {'name': 'Harmonium',        'sound_id': 'keyboard.harmonium'},
                            5: {'name': 'Violin',           'sound_id': 'strings.violin'}}

    def get_instrument(self, instrument_id:int):
        if instrument_id in self.instruments.keys():
            ret = self.instruments[instrument_id]
            return ret
        else:
            raise Exception('Unknown Instrument '+str(instrument_id))
