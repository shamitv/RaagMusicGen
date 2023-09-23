import os.path
import random

from musictree import Score, Part
from MusicNotes import ChordGen

class Malkauns:
    name = "Malkauns"

    def getTune(self):
        octave_offset = {'D': 0, 'E': 0, 'F': 0, 'G': 0, 'A': 1, 'A#': 0, 'C': 1}

        d_major_scale = ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D']
        malkauns_raag_notes = ['सा', 'गा', 'मा', 'धा', 'नी']
        d_major_scale_modified = ['D', 'E', 'F', 'G', 'A', 'A#', 'C']
        hindi_notes = ['सा', 'रे', 'गा', 'मा', 'पा', 'धा', 'नी']

        hindi_to_western_mapping = {}

        scale = d_major_scale_modified

        for i, note in enumerate(hindi_notes):
            hindi_to_western_mapping[note] = scale[i]

        malkauns_raag_notes = ['सा', 'गा', 'मा', 'धा', 'नी']

        vaadi_swar = 'मा'
        samvaadi_swar = 'सा'

        mandra_saptak_octave = 2
        madhya_saptak_octave = 3
        taar_saptak_octave = 4

        octaves = [mandra_saptak_octave, madhya_saptak_octave, taar_saptak_octave]

        notes = []
        note_weights = []

        for octave in octaves:
            for note in malkauns_raag_notes:
                notes.append({"octave": octave, "note": note})
                weight = 10
                if note == vaadi_swar:
                    weight = weight * 5
                else:
                    if note == samvaadi_swar:
                        weight = weight * 3
                    else:
                        weight = weight * 1
                if octave == madhya_saptak_octave:
                    weight = weight * 2
                note_weights.append(weight)

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


        def get_note(hindi_note, octave, duration):
            en_note = hindi_to_western_mapping[hindi_note]
            c = ChordGen.get_chord(en_note, octave, duration)
            return c

        current_duration = random.choice(durations)
        change_duration_or_not = [None, None, 1, None, None, None]
        non_1_duration_count = 0

        notes_in_a_beat = [1, 2, 4, 8]
        weights = [100, 200, 50, 5]

        # Each iteration of this loop represents a beat
        while len(generated_notes) > 0:
            notes = []
            num_notes = random.choices(notes_in_a_beat, weights=weights, k=1)[0]
            for i in range(num_notes):
                if generated_notes:
                    notes.append(generated_notes.pop(0))
            duration = 1.0 / len(notes)
            for n in notes:
                hindi_note = n['note']
                hindi_octave = n['octave']
                en_note = en_note = hindi_to_western_mapping[hindi_note]
                piano_octave = hindi_octave + octave_offset[en_note]
                note = get_note(hindi_note, piano_octave, duration)
                note.add_lyric(hindi_note)
                p.add_chord(note)
            ret = scr.get_xml_string()

        p.id_.delete()
        del scr
        del p

        return ret
