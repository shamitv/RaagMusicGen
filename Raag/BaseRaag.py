import random

from MusicNotes import ChordGen
from musictree import Score, Part


def get_note(hindi_note, hindi_to_western_mapping, octave, duration):
    en_note = hindi_to_western_mapping[hindi_note]
    c = ChordGen.get_chord(en_note, octave, duration)
    return c

class BaseRaag:
    def __init__(self,name,vadi,samvadi,raag_notes):
        self.name = name
        self.vadi = vadi
        self.samvadi = samvadi
        self.raag_notes=raag_notes


    def getTune(self,base_scale):
        octave_offset = {'D': 0, 'E': 0, 'F': 0, 'G': 0, 'A': 1, 'A#': 0, 'C': 1}
        hindi_notes = self.raag_notes
        scale_notes = ChordGen.get_western_notes(hindi_notes, base_scale)
        hindi_to_western_mapping = {}

        for i, note in enumerate(hindi_notes):
            hindi_to_western_mapping[note] = scale_notes[i]

        mandra_saptak_octave = 2
        madhya_saptak_octave = 3
        taar_saptak_octave = 4

        octaves = [mandra_saptak_octave, madhya_saptak_octave, taar_saptak_octave]

        notes = []
        note_weights = []
        ret_weights = {}

        for octave in octaves:
            ret_weights[octave] = {}
            for note in self.raag_notes:
                notes.append({"octave": octave, "note": note})
                weight = 10
                if note == self.vadi:
                    weight = weight * 5
                else:
                    if note == self.samvadi:
                        weight = weight * 3
                    else:
                        weight = weight * 1
                if octave == madhya_saptak_octave:
                    weight = weight * 2
                note_weights.append(weight)
                ret_weights[octave][hindi_to_western_mapping[note]] = weight

        durations = [0.5, 0.5, 0.25, 0.25, 0.125]
        scr = Score()
        p = scr.add_child(Part('P1', name='Part 1'))
        measure = p.add_measure();

        bars = 16
        num_notes = bars * 4

        generated_notes = []

        cur_idx = None
        idx_options = list(range(0, len(notes)))

        for i in range(num_notes):
            next_note = None
            if cur_idx is not None:
                choices = [+1, 0, -1, None]
                choice = None
                if cur_idx == len(notes) - 1:
                    choice = -1
                else:
                    if cur_idx == 0:
                        choice = +1
                    else:
                        choice = random.choice(choices)
                if choice is not None:
                    cur_idx = cur_idx + choice
                else:
                    cur_idx = random.choices(idx_options, weights=note_weights, k=1)[0]
            else:
                cur_idx = random.choices(idx_options, weights=note_weights, k=1)[0]
            next_note = notes[cur_idx]
            generated_notes.append(next_note)

        current_duration = random.choice(durations)
        change_duration_or_not = [None, None, 1, None, None, None]
        non_1_duration_count = 0

        notes_in_a_beat = [1, 2, 4, 8]
        weights = [100, 200, 50, 5]

        # Each iteration of this loop represents a beat
        while len(generated_notes) > 0:
            beat_notes = []
            num_notes = random.choices(notes_in_a_beat, weights=weights, k=1)[0]
            for i in range(num_notes):
                if generated_notes:
                    beat_notes.append(generated_notes.pop(0))
            duration = 1.0 / len(beat_notes)
            for n in beat_notes:
                hindi_note = n['note']
                hindi_octave = n['octave']
                en_note = hindi_to_western_mapping[hindi_note]
                piano_octave = hindi_octave + octave_offset[en_note]
                note = get_note(hindi_note, hindi_to_western_mapping, piano_octave, duration)
                note.add_lyric(hindi_note)
                p.add_chord(note)

        ret = scr.get_xml_string()

        p.id_.delete()
        del scr
        del p
        self.fillMissingNotes(ret_weights)
        return ret, notes, ret_weights

    def fillMissingNotes(self, ret_weights):
        western_notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        for octave in ret_weights.keys():
            weights = ret_weights[octave]
            for note in western_notes:
                if note not in weights.keys():
                    weights[note] = 0
