import random

from musictree import Score, Part
from MusicNotes import ChordGen

d_major_scale_modified = ['D', 'E', 'F', 'G', 'A', 'A#', 'C']
octave_offset = {'D': 0, 'E': 0, 'F': 0, 'G': 0, 'A': 1, 'A#': 0, 'C': 1}
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

for octave in octaves:
    for note in malkauns_raag_notes:
        notes.append({"octave": octave, "note": note})

durations = [1, 0.5, 0.25, 0.125]
scr = Score()
p = scr.add_child(Part('P1', name='Part 1'))
measure = p.add_measure();

bars = 36
num_notes = bars * 4

generated_notes = []

cur_idx = None
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
            cur_idx = random.randrange(len(notes))
    else:
        cur_idx = random.randrange(len(notes))
    next_note = notes[cur_idx]
    generated_notes.append(next_note)

print(generated_notes)


def get_note(hindi_note, octave, duration):
    en_note = hindi_to_western_mapping[hindi_note]
    print(en_note + '_' + str(octave))
    c = ChordGen.get_chord(en_note, octave, duration)
    return c


current_duration = random.choice(durations)
change_duration_or_not = [None, None, 1, None, None, None]
for n in generated_notes:
    hindi_note = n['note']
    hindi_octave = n['octave']
    en_note = en_note = hindi_to_western_mapping[hindi_note]
    piano_octave = hindi_octave + octave_offset[en_note]
    if random.choice(change_duration_or_not):
        current_duration = random.choice(durations)
    note = get_note(hindi_note, piano_octave, current_duration)
    note.add_lyric(hindi_note)
    p.add_chord(note)

scr.export_xml('../data/generated_songs/malkauns/malkauns_tune_1.xml')
