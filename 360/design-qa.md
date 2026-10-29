# Study 1 demo design QA

final result: passed

## Reference and capture conditions

References: `/Users/leeguhn/Downloads/1object.png` and
`/Users/leeguhn/Downloads/2object.png`. Desktop comparisons use the same
1562 × 1184 viewport at device pixel ratio 1, with verbal, automatic playback,
sequential scheduling and the corresponding object count. The red speaker is
captured during actual source playback. Mobile verification uses 390 × 844.

Local QA captures are in `/private/tmp/etri-study1-qa/`:

- `one-comparison.png` and `two-comparison.png`: reference beside implementation.
- `one-object.png` and `two-objects.png`: final desktop states.
- `radar.png`, `three-objects.png`, `mobile.png`: alternate view and size checks.
- `results.json`: browser validation outcome and concurrent speech start times.

## Visual review

The final paired captures match the reference layout: dominant white viewport,
heavy black frame, bottom-left radar, corner controls and four large black
buttons. Arial bold text, spacing, rounded corners, blue/pink cylinders and gray
disabled scheduling were checked side by side. All four controls remain visible
without horizontal overflow on the mobile capture.

An initial perspective implementation tilted the cylinder caps and exaggerated
their apparent size. The final renderer uses upright projected cylinders with
shared world dimensions. An initial button transition delayed the visible gray
disabled state; it was removed. Both fixes were checked in fresh captures.

Intentional differences: real Font Awesome shuffle/speaker glyphs, a small control
hint below the buttons, and scene geometry computed from positions rather than
copied from the illustration. The one-object preset uses a 1.5 m distance to
preserve a uniform physical cylinder size while matching its larger appearance.
Radar ring spacing is always 0.5 m. Idle sound is not shown in red.

## Interaction and audio verification

All 16 model/audio tests pass. Browser checks pass for the four controls, all
object counts, single-object scheduling lockout, Q/E rotation, view swapping,
shuffle/reset, automatic repetition, requested playback and active speaker state.
Two simultaneous speech sources have identical scheduled start times. Requested
playback does not repeat automatically. Scene changes cancel stale audio,
including activation while speech files are still loading. Missing speech files
produce a visible error. No browser page or console errors were observed.

The audio mechanism uses one listener and fixed world-space HRTF emitters. No
sweeps or moving sources were introduced. Numerical audio values are provisional
demo settings documented in `AUDIO.md`. Physical headphone loudness and human
front/back localization remain pilot checks; automated validation does not
establish perceptual accuracy or cue equivalence.
