# Music Generation Documentation Plan

## Objective
Provide clear, accessible documentation that explains how the RaagMusicGen backend constructs musical output—from raag note selection through score rendering—so team members and contributors can understand, maintain, and extend the pipeline.

## Target Audience
- Core developers contributing to music generation logic.
- Contributors writing documentation or tutorials for the project.
- QA/Support members who need to trace audio output back to code pathways.

## Focus Areas

### 1. Logic (Raag Framework)
- `Raag/BaseRaag.py`: core melody generation, note weighting, and XML export.
- Individual raag implementations (e.g., `Raag/Yaman.py`) highlighting how the Hindustani framework is encoded.
- Random-walk heuristics: octave weighting, beat grouping, duration selections, and lyric attachment.

### 2. Tech (Libraries & Integrations)
- `MusicNotes/ChordGen.py`: mapping Hindi/Sargam notes to Western pitches and MIDI numbers.
- `MusicNotes/Instrument.py`: instrument metadata surfaced to MusicXML.
- musictree/musicxml usage for score creation, plus output formats (MusicXML, MIDI, WAV).
- Conversion utilities (e.g., audio buffer ➔ WAV) and any environment-specific tooling.

## Documentation Deliverables
1. **Logic narrative** explaining how the raag rules drive note selection, durations, and structure (`BaseRaag.getTune`, raag subclasses).
2. **Tech reference** describing supporting libraries, data formats, and conversion helpers (ChordGen, Instrument, musictree/musicxml, audio utils).
3. **Sequence diagram or flowchart** illustrating the call stack from UI event (Generate Tune) to XML/Audio generation, annotated with Logic vs. Tech responsibilities.
4. **Reference tables** mapping Hindi/Sargam notes to Western notes and MIDI numbers, and listing supported instruments (with sound IDs).
5. **Extension guide** explaining how to add a new raag (logic) and how to integrate new instruments/formats (tech).

## Work Breakdown
1. **Source review & note-taking**
   - Trace sample execution: `BaseRaag.getTune` ➔ `ChordGen.get_western_notes` ➔ `get_note` ➔ musictree score serialisation.
   - Capture key data structures (e.g., weighting dictionaries, duration heuristics).
2. **Draft structure**
   - Outline documentation sections following the deliverables list.
   - Decide final format (Markdown in `/docs`, optionally with diagrams exported to `/docs/images`).
3. **Write core narrative**
   - Explain melody generation algorithm: note weighting, random walks, beat grouping, duration distribution.
   - Document helper utilities (ChordGen, Instrument) and how they integrate.
4. **Add reference material**
   - Include tables or bullet lists for note mappings and instrument IDs.
   - Document default raags (Yaman, Bhupali, etc.) highlighting unique note sets.
5. **Review & iterate**
   - Self-review for accuracy; run through code to confirm statements.
   - Optionally request peer review focused on musical correctness.
6. **Publish**
   - Commit documentation under `/docs` (e.g., `docs/music-generation/overview.md`).
   - Update README or docs index with a link to the new content.

## Acceptance Criteria
- Documentation explains the end-to-end flow clearly enough for a new contributor to follow without reading source code line by line.
- All referenced code modules and functions are accurate to the current codebase.
- Visual aids (if any) reference files stored within the repo.
- Plan includes next steps for extensions (new raags/instruments) and testing considerations.

## Follow-Up Ideas
- Add unit tests around `ChordGen.get_major_scale` and note weighting heuristics.
- Provide sample outputs (MIDI/XML snippets) alongside documentation for illustration.
- Record a short screencast demonstrating the generation process using the UI.
