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

print(notes)

duration = 1
scr = Score()
p = scr.add_child(Part('P1', name='Part 1'))


def get_note(hindi_note, octave, duration):
    en_note = hindi_to_western_mapping[hindi_note]
    print(en_note + '_' + str(octave))
    c = ChordGen.get_chord(en_note, octave, duration)
    return c


for n in notes:
    hindi_note = n['note']
    hindi_octave = n['octave']
    en_note = en_note = hindi_to_western_mapping[hindi_note]
    piano_octave = hindi_octave + octave_offset[en_note]
    note = get_note(hindi_note, piano_octave, duration)
    p.add_chord(note)

scr.export_xml('../data/generated_songs/malkauns/malkauns_all_notes.xml')
