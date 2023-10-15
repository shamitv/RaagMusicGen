from MusicNotes import ChordGen
from musictree import Score, Part

mandra_saptak_octave = 2
madhya_saptak_octave = 3
taar_saptak_octave = 4

octaves = [mandra_saptak_octave, madhya_saptak_octave, taar_saptak_octave]

western_notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

duration = 1.0
scr = Score()
p = scr.add_child(Part('P1', name='Part 1'))
measure = p.add_measure();

for o in octaves:
    for n in western_notes:
        c = ChordGen.get_chord(note=n,octave=o,duration=duration)
        p.add_chord(c)

output_dir = '../../data/generated_songs/'

scr.export_xml(output_dir + '/octave_test.xml')