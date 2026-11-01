# Study 1 cue rehearsal

A local browser sandbox and interactive rehearsal of the revised Study 1. It has
no external runtime dependencies. This is a demonstration, not the frozen
participant protocol or a validated measurement system.

## Run

```sh
npm run dev
```

Open <http://127.0.0.1:18791/>. HTTP is required for the local speech recordings.
Use headphones. `npm test` runs the model, mapping and protocol checks.

## Sandbox

The four buttons cycle verbal/nonverbal cues, automatic/requested playback,
one/two/three objects, and sequential/simultaneous playback. Scheduling is disabled
for one object. Q turns left, E right; holding either key keeps turning. Space or
the speaker controls sound. Click the radar inset (or R) to swap views. The bulb
hides the objects with an opaque shade. Shuffle changes the scene and properties,
resets head direction, and places nonoverlapping objects at unique world clock
bearings and half-metre rings. Count changes retain one common layout.

## Test rehearsal

Type **test** anywhere outside a text field.
Random trials begin immediately. Type **stop** to end
at any time and restore the previous sandbox scene and visibility setting.

- Targets are hidden by a gray viewport. The radar and target descriptions are
  hidden too. The property, shuffle and bulb buttons are locked.
- Automatic trials start and repeat their cues. Requested trials wait for Space
  or the speaker; new requests during a cycle are ignored.
- Move the pointer to preview a dotted direction ray, snapped to world-anchored
  30-degree bearings. Click to fix the bearing. Move along that ray to choose
  one of five evenly spaced distance points, then click to save the response.
- Saved rays and dots remain anchored in the world when the head turns. Turn
  with Q/E to report objects behind you. Backspace or undo cancels a pending ray
  or removes the last response; Escape cancels a pending direction.
- Saving all expected responses finishes the trial immediately.
  The submit button also permits an incomplete report, including no objects reported.
- The radar shows colored targets and black response lines/dots for three seconds,
  then a new random trial starts. There is no fixed response deadline.

The 20 distinct valid combinations are sampled uniformly; this is not a balanced
100-trial study schedule. Per-trial truth feedback and automatic completion at the
known object count are rehearsal conveniences. The research protocol has no
correctness feedback during main trials. Tests here omit NASA-TLX and interviews.

## Learning and check

Type **learn** separately in the sandbox. Each cue has five visible
reference examples, then two randomized ten-trial, single-frontal-object checks.
Every distance occurs twice per block. No correctness feedback is shown until
both blocks finish. The provisional pass rule is at least 8/10 in both blocks and
at least one correct response at every distance in each block. A pass advances
from verbal to nonverbal, then to random trials. One extra teaching/check attempt
is allowed after a failure. A skip remains available for exploring the demo;
skips, failures and actual training durations are logged, not treated as mastery.
Teaching lasts at most five minutes per cue before the check starts automatically.

Rehearsal events stay in memory; no data is transmitted. Hiding the page ends
the rehearsal, preventing background timers or stale sound.

## Coordinates, distance and scope

World +Z is initial forward / radar-up; +X is right. The listener stays fixed.
All cylinders share a 0.8 m height and 0.52 m diameter. Rings are 0.5 m apart up to
2.5 m. The POV is an upright diagram-style projection, not a complete 3D renderer.
Response rays form a screen-space input fan: their five equally spaced positions
represent range levels, not perspective distances. The review radar shows their
actual world locations.

Both speech and beeps use fixed-world HRTF emitters and one head-tracked listener.
Speech names clock bearing and metres; nonverbal distance uses five pitches, with
constant source gain and no repetition-rate distance code. See [AUDIO.md](AUDIO.md).
These gain settings are not a perceptual loudness calibration. Headphone listening,
front/back accuracy, pitch discriminability and the learning criterion require
piloting. Exact-grid matching is a demo score, not a validated study tolerance.

Source: `7102.ETRI_2026`, branch `study1-web`. Mirror the interface into
`etri_360/web-prototype` and `leeguhn.github.io/360`; pushing the website's main
branch triggers its existing Pages workflow. Preserve historical `v1.0/` and the
unused sweep sandbox files when mirroring. The older coverage/filtering research
document is not amended by this rehearsal.

Shuffle/speaker icons are Font Awesome Free assets; license in `assets/icons/`.
